import Link from "next/link";
import { Logo } from "./ui";

export function LandingFooter() {
    return (
        <footer className="border-t border-slate-100 px-5 py-9">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <Logo />
                <p className="max-w-md text-xs leading-6 text-slate-500">
                    CareFlow is a frontend demo, not a healthcare provider. Do not enter real patient data. For
                    emergencies, contact your local emergency services.
                </p>
                <Link href="/login" className="text-sm font-semibold text-teal-700">
                    Member login →
                </Link>
            </div>
        </footer>
    );
}
