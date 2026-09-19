import { HeartPulse, LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function Logo({ light = false }: { light?: boolean }) {
    return (
        <Link
            href="/"
            aria-label="CareFlow home"
            className={`inline-flex items-center gap-2.5 text-xl font-extrabold tracking-tight ${
                light ? "text-white" : "text-slate-900"
            }`}
        >
            <span className="rounded-xl bg-teal-700 p-2 text-white">
                <HeartPulse size={22} aria-hidden="true" />
            </span>
            CareFlow<span className="text-teal-500">.</span>
        </Link>
    );
}

export function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-slate-500" role="status">
            <LoaderCircle className="animate-spin" size={22} />
            Loading CareFlow…
        </div>
    );
}

export function PageHeading({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="eyebrow mb-2">{eyebrow}</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                <p className="muted mt-2">{description}</p>
            </div>
            {action}
        </div>
    );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="muted mx-auto mt-2 max-w-sm">{description}</p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
    return (
        <div
            role={error ? "alert" : "status"}
            className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-teal-200 bg-teal-50 text-teal-800"
            }`}
        >
            {children}
        </div>
    );
}

export function Badge({ children, neutral = false }: { children: ReactNode; neutral?: boolean }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                neutral ? "bg-slate-100 text-slate-600" : "bg-teal-50 text-teal-700"
            }`}
        >
            {children}
        </span>
    );
}
