"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyPatientData } from "../lib/data";
import {
    clearSession,
    createSalt,
    DATABASE_KEY,
    emptyDatabase,
    hashPassword,
    readDatabase,
    readSession,
    SESSION_KEY,
    writeDatabase,
    writeSession,
} from "../lib/storage";
import type { Database, PatientData, Profile } from "../lib/types";
import { errorMessage } from "../lib/utils";

type ProfileChanges = Pick<Profile, "name" | "phone" | "bloodGroup">;

type AppContextValue = {
    ready: boolean;
    storageError: string;
    user: Profile | null;
    data: PatientData;
    signup: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (changes: ProfileChanges) => void;
    updateData: (updater: (current: PatientData) => PatientData) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [database, setDatabase] = useState<Database>(emptyDatabase);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [ready, setReady] = useState(false);
    const [storageError, setStorageError] = useState("");

    const syncFromStorage = useCallback(() => {
        try {
            const next = readDatabase();
            const savedId = readSession();

            setDatabase(next);
            setSessionId(next.accounts.some(account => account.profile.id === savedId) ? savedId : null);
            setStorageError("");
        } catch (error) {
            setSessionId(null);
            setStorageError(errorMessage(error));
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        syncFromStorage();

        function handleStorage(event: StorageEvent) {
            if (event.key === DATABASE_KEY || event.key === SESSION_KEY || event.key === null) {
                syncFromStorage();
            }
        }

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [syncFromStorage]);

    const user = database.accounts.find(account => account.profile.id === sessionId)?.profile ?? null;

    const data = (sessionId && database.patients[sessionId]) || emptyPatientData();

    function getAuthenticatedDatabase() {
        const current = readDatabase();

        if (
            !sessionId ||
            readSession() !== sessionId ||
            !current.accounts.some(account => account.profile.id === sessionId)
        ) {
            throw new Error("Your demo session has ended. Please log in again.");
        }

        return current;
    }

    async function signup(name: string, email: string, password: string): Promise<void> {
        const normalizedEmail = email.trim().toLowerCase();

        if (name.trim().length < 2) {
            throw new Error("Please enter a name with at least two characters.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            throw new Error("Please enter a valid email address.");
        }

        if (password.length < 8) {
            throw new Error("Use a password with at least eight characters.");
        }

        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);
        const current = readDatabase();

        if (current.accounts.some(account => account.profile.email === normalizedEmail)) {
            throw new Error("An account with this email already exists here.");
        }

        const profile: Profile = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: normalizedEmail,
            phone: "",
            bloodGroup: "",
        };

        const next: Database = {
            ...current,
            accounts: [...current.accounts, { profile, salt, passwordHash }],
            patients: {
                ...current.patients,
                [profile.id]: emptyPatientData(),
            },
        };

        writeDatabase(next);

        try {
            writeSession(profile.id);
        } catch {
            setDatabase(next);
            throw new Error("Your demo account was created, but the session could not be saved. Try logging in.");
        }

        setDatabase(next);
        setSessionId(profile.id);
    }

    async function login(email: string, password: string): Promise<void> {
        const current = readDatabase();
        const account = current.accounts.find(item => item.profile.email === email.trim().toLowerCase());

        if (!account) {
            throw new Error("Incorrect email or password.");
        }

        const candidate = await hashPassword(password, account.salt);

        if (candidate !== account.passwordHash) {
            throw new Error("Incorrect email or password.");
        }

        // Re-read after the async hashing operation.
        const latest = readDatabase();
        const stillExists = latest.accounts.some(
            item => item.profile.id === account.profile.id && item.passwordHash === account.passwordHash,
        );

        if (!stillExists) {
            throw new Error("This demo account changed. Please try again.");
        }

        writeSession(account.profile.id);
        setDatabase(latest);
        setSessionId(account.profile.id);
    }

    function logout() {
        clearSession();
        setSessionId(null);
    }

    function updateProfile(changes: ProfileChanges) {
        const current = getAuthenticatedDatabase();

        if (changes.name.trim().length < 2) {
            throw new Error("Your name must contain at least two characters.");
        }

        const next: Database = {
            ...current,
            accounts: current.accounts.map(account =>
                account.profile.id === sessionId
                    ? {
                          ...account,
                          profile: {
                              ...account.profile,
                              ...changes,
                              name: changes.name.trim(),
                              phone: changes.phone.trim(),
                          },
                      }
                    : account,
            ),
        };

        writeDatabase(next);
        setDatabase(next);
    }

    function updateData(updater: (current: PatientData) => PatientData) {
        const current = getAuthenticatedDatabase();
        const id = sessionId as string;

        const next: Database = {
            ...current,
            patients: {
                ...current.patients,
                [id]: updater(current.patients[id] ?? emptyPatientData()),
            },
        };

        writeDatabase(next);
        setDatabase(next);
    }

    return (
        <AppContext.Provider
            value={{
                ready,
                storageError,
                user,
                data,
                signup,
                login,
                logout,
                updateProfile,
                updateData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useApp must be used inside AppProvider.");
    }

    return context;
}
