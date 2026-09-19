"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const THEME_KEY = "careflow-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getTheme(): Theme {
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener("careflow-theme-change", callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("careflow-theme-change", callback);
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
        window.dispatchEvent(new Event("careflow-theme-change"));
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
