"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const THEME_KEY = "althea-theme";
const LEGACY_THEME_KEY = "careflow-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getTheme(): Theme {
    const storedTheme = window.localStorage.getItem(THEME_KEY) ?? window.localStorage.getItem(LEGACY_THEME_KEY);

    return storedTheme === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener("althea-theme-change", callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("althea-theme-change", callback);
    };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribeToTheme, getTheme, (): Theme => "light");

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    function toggleTheme() {
        const nextTheme = theme === "light" ? "dark" : "light";

        window.localStorage.setItem(THEME_KEY, nextTheme);
        window.document.documentElement.dataset.theme = nextTheme;
        window.dispatchEvent(new Event("althea-theme-change"));
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider.");
    }

    return context;
}
