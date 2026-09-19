import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProvider } from "../components/app-provider";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "CareFlow — Your care, beautifully connected",
        template: "%s | CareFlow",
    },
    description: "A medical-app frontend demo for appointments, records, and medication reminders.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased">
                <ThemeProvider>
                    <AppProvider>{children}</AppProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
