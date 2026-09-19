import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./ui";

export function LandingNavbar() {
    return (
        <header className="landing-navbar sticky top-0 z-30 border-b border-slate-200/60 bg-white/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 lg:px-8">
                <Logo />

                <nav
                    aria-label="Main navigation"
                    className="landing-nav-links hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
                >
                    <a href="#features" className="hover:text-teal-700">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-teal-700">
                        How it works
                    </a>
                    <a href="#faq" className="hover:text-teal-700">
                        FAQs
                    </a>
                </nav>

                <div className="flex shrink-0 items-center gap-2">
                    <ThemeToggle />
                    <Link href="/login" className="btn landing-nav-btn hidden whitespace-nowrap sm:inline-flex">
                        Log in
                    </Link>
                    <Link href="/signup" className="btn btn-primary shrink-0 whitespace-nowrap px-3 sm:px-5">
                        Get started <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
