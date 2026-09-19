"use client";

import { ArrowLeft, ArrowRight, Eye, EyeOff, HeartHandshake, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "../components/app-provider";
import { LoadingScreen, Logo, Notice } from "../components/ui";
import { errorMessage } from "../lib/utils";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
    const isSignup = mode === "signup";
    const router = useRouter();
    const { ready, user, signup, login, storageError } = useApp();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (ready && user) router.replace("/dashboard");
    }, [ready, user, router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (isSignup && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setBusy(true);

        try {
            if (isSignup) {
                await signup(name, email, password);
            } else {
                await login(email, password);
            }

            router.replace("/dashboard");
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    if (!ready || user) return <LoadingScreen />;

    return (
        <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-teal-950 p-12 text-white lg:flex">
                <Logo light />

                <div className="absolute -right-32 top-32 h-96 w-96 rounded-full border border-teal-700/40" />
                <div className="absolute -right-16 top-48 h-64 w-64 rounded-full border border-teal-700/40" />

                <div className="relative max-w-md">
                    <div className="mb-8 inline-flex rounded-3xl bg-white/10 p-5 text-teal-200">
                        <HeartHandshake size={44} />
                    </div>
                    <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
                        Your personal care space
                    </p>
                    <h1 className="text-5xl font-bold leading-tight tracking-tight">
                        Less to manage.
                        <br />
                        More room for you.
                    </h1>
                    <p className="mt-7 text-lg leading-8 text-teal-100/70">
                        A simple home for your appointments, reminders, and sample health records.
                    </p>
                </div>

                <p className="max-w-sm text-xs leading-6 text-teal-200/60">
                    Frontend demonstration only. Use fictional information and a password you do not use elsewhere.
                </p>
            </aside>

            <section className="flex flex-col bg-white px-6 py-8 sm:px-12">
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"
                    >
                        <ArrowLeft size={16} /> Back to home
                    </Link>
                    <div className="lg:hidden">
                        <Logo />
                    </div>
                </div>

                <div className="mx-auto my-auto w-full max-w-md py-12">
                    <p className="eyebrow">{isSignup ? "A fresh start" : "Your space awaits"}</p>
                    <h2 className="mt-3 text-4xl font-bold tracking-tight">
                        {isSignup ? "Create your account" : "Welcome back"}
                    </h2>
                    <p className="muted mt-3">
                        {isSignup
                            ? "Start organizing your care with a local demo account."
                            : "Log in to the demo account saved in this browser."}
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {isSignup && (
                            <div>
                                <label htmlFor="name" className="label">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    className="field"
                                    autoComplete="name"
                                    placeholder="Alex Taylor"
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                    minLength={2}
                                    maxLength={80}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="label">
                                Email address
                            </label>
                            <input
                                id="email"
                                className="field"
                                type="email"
                                autoComplete="email"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                                maxLength={254}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    className="field pr-12"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete={isSignup ? "new-password" : "current-password"}
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    minLength={8}
                                    maxLength={128}
                                    required
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword(value => !value)}
                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isSignup && (
                            <>
                                <div>
                                    <label htmlFor="confirm-password" className="label">
                                        Confirm password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        className="field"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={event => setConfirmPassword(event.target.value)}
                                        minLength={8}
                                        maxLength={128}
                                        required
                                    />
                                </div>

                                <label className="flex items-start gap-3 text-xs leading-6 text-slate-500">
                                    <input type="checkbox" required className="mt-1.5 accent-teal-700" />I understand
                                    this is a browser-only demo and will not enter real patient information.
                                </label>
                            </>
                        )}

                        {(error || storageError) && <Notice error>{error || storageError}</Notice>}

                        <button
                            type="submit"
                            disabled={busy || Boolean(storageError)}
                            className="btn btn-primary w-full"
                        >
                            {busy ? (
                                <>
                                    <LoaderCircle size={17} className="animate-spin" />
                                    Please wait…
                                </>
                            ) : (
                                <>
                                    {isSignup ? "Create account" : "Log in"}
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-500">
                        {isSignup ? "Already have an account?" : "New to CareFlow?"}{" "}
                        <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-teal-700">
                            {isSignup ? "Log in" : "Create an account"}
                        </Link>
                    </p>

                    <p className="mt-8 text-center text-xs leading-6 text-slate-400">
                        Data stays in this browser. Clearing site storage removes local accounts and entries. No
                        password-reset email service is connected.
                    </p>
                </div>
            </section>
        </main>
    );
}
