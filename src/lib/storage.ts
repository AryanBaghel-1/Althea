import type { Database } from "./types";

export const DATABASE_KEY = "careflow.database.v1";
export const SESSION_KEY = "careflow.session.v1";

export function emptyDatabase(): Database {
    return {
        version: 1,
        accounts: [],
        patients: {},
    };
}

export function readDatabase(): Database {
    const raw = localStorage.getItem(DATABASE_KEY);

    if (!raw) return emptyDatabase();

    try {
        const parsed = JSON.parse(raw) as Database;

        if (
            parsed.version !== 1 ||
            !Array.isArray(parsed.accounts) ||
            !parsed.patients ||
            typeof parsed.patients !== "object"
        ) {
            throw new Error("Invalid database structure.");
        }

        for (const account of parsed.accounts) {
            if (
                !account.profile ||
                typeof account.profile.id !== "string" ||
                typeof account.profile.name !== "string" ||
                typeof account.profile.email !== "string" ||
                typeof account.salt !== "string" ||
                typeof account.passwordHash !== "string"
            ) {
                throw new Error("Invalid account.");
            }

            const patient = parsed.patients[account.profile.id];

            if (
                !patient ||
                !Array.isArray(patient.appointments) ||
                !Array.isArray(patient.records) ||
                !Array.isArray(patient.medications)
            ) {
                throw new Error("Invalid patient data.");
            }
        }

        return parsed;
    } catch {
        throw new Error("CareFlow demo storage is unreadable. Clear this site's demo storage to start again.");
    }
}

export function writeDatabase(database: Database): void {
    try {
        localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    } catch {
        throw new Error("Unable to save. Browser storage may be disabled or full.");
    }
}

export function readSession(): string | null {
    return localStorage.getItem(SESSION_KEY);
}

export function writeSession(userId: string): void {
    try {
        localStorage.setItem(SESSION_KEY, userId);
    } catch {
        throw new Error("Your browser could not save the demo session.");
    }
}

export function clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
    if (!/^[a-f0-9]{32}$/i.test(hex)) {
        throw new Error("Invalid password salt.");
    }

    const bytes = new Uint8Array(hex.length / 2);

    for (let index = 0; index < bytes.length; index++) {
        bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    }

    return bytes;
}

export function createSalt(): string {
    return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password: string, salt: string): Promise<string> {
    if (!globalThis.crypto?.subtle) {
        throw new Error("Password hashing requires localhost or an HTTPS connection.");
    }

    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
        "deriveBits",
    ]);

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: hexToBytes(salt),
            iterations: 600_000,
            hash: "SHA-256",
        },
        key,
        256,
    );

    return bytesToHex(new Uint8Array(bits));
}
