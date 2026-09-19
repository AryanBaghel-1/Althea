"use client";

import {
    CalendarDays,
    FileText,
    HeartHandshake,
    LayoutDashboard,
    LogOut,
    Menu,
    Pill,
    Settings,
    Stethoscope,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "../components/app-provider";
import { ThemeToggle } from "../components/theme-toggle";
import { LoadingScreen, Logo, Notice } from "../components/ui";
import { errorMessage, initials } from "../lib/utils";

const navigation = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/doctors", label: "Find doctors", icon: Stethoscope },
    {
        href: "/dashboard/appointments",
        label: "Appointments",
        icon: CalendarDays,
    },
    { href: "/dashboard/records", label: "Medical records", icon: FileText },
    { href: "/dashboard/medications", label: "Medications", icon: Pill },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
    const { ready, user, logout, storageError } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (ready && !user) router.replace("/login");
    }, [ready, user, router]);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    if (!ready || !user) return <LoadingScreen />;

    function handleLogout() {
        try {
            logout();
            router.replace("/login");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    const currentTitle = navigation.find(item => item.href === pathname)?.label ?? "Dashboard";

    return (
        <div className="dashboard-theme min-h-screen bg-[#f3f6fb]">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-4"
            >
                Skip to content
            </a>

            {open && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                id="dashboard-navigation"
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/70 bg-white px-5 py-7 transition-transform lg:translate-x-0 lg:[interactivity:auto] ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-2">
                    <Logo />
                    <button
                        type="button"
                        aria-label="Close navigation"
                        className="rounded-lg p-2 text-slate-500 lg:hidden"
                        onClick={() => setOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-3 mt-8 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Patient workspace
                </p>

                <nav aria-label="Dashboard navigation" className="space-y-1.5">
                    {navigation.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                                    active
                                        ? "bg-teal-700 text-white shadow-sm shadow-teal-700/20"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-teal-700"
                                }`}
                            >
                                <Icon size={19} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-8">
                    <div className="rounded-2xl bg-teal-50 p-5">
                        <HeartHandshake size={26} className="text-teal-700" />
                        <p className="mt-3 text-sm font-bold text-teal-900">A space for your care</p>
                        <p className="mt-2 text-xs leading-5 text-teal-800/70">
                            Demo only. For urgent medical help, contact local emergency services.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/95 px-5 backdrop-blur lg:px-9">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Open navigation"
                            aria-expanded={open}
                            aria-controls="dashboard-navigation"
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                            onClick={() => setOpen(true)}
                        >
                            <Menu size={21} />
                        </button>

                        <div>
                            <p className="text-sm font-semibold text-slate-800">{currentTitle}</p>
                            <p className="mt-1 hidden text-xs text-slate-400 sm:block">
                                A little more organized. A little more at ease.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-teal-700"
                        >
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold">{user.name}</p>
                                <p className="mt-1 text-xs text-slate-400">Demo patient</p>
                            </div>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
                                {initials(user.name)}
                            </span>
                        </Link>
                    </div>
                </header>

                <main id="main-content" className="mx-auto max-w-7xl p-5 lg:p-9">
                    {(error || storageError) && (
                        <div className="mb-6">
                            <Notice error>{error || storageError}</Notice>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
