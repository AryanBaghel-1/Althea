"use client";

import { LogOut, Save, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useApp } from "../../components/app-provider";
import { Notice, PageHeading } from "../../components/ui";
import { errorMessage, initials } from "../../lib/utils";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function Settings() {
    const { user, updateProfile, logout } = useApp();
    const router = useRouter();

    const [name, setName] = useState(user?.name ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup ?? "");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    function saveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            updateProfile({ name, phone, bloodGroup });
            setMessage("Your demo profile has been updated.");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    function signOut() {
        try {
            logout();
            router.replace("/login");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    return (
        <>
            <PageHeading
                eyebrow="Make yourself at home"
                title="Settings"
                description="Update your fictional profile and manage your local demo session."
            />

            <div className="grid items-start gap-7 xl:grid-cols-[1.5fr_1fr]">
                <section className="card p-6 sm:p-8">
                    <div className="mb-8 flex items-center gap-4">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-xl font-bold text-amber-800">
                            {initials(user?.name ?? "Demo User")}
                        </span>
                        <div>
                            <h2 className="text-lg font-bold">{user?.name}</h2>
                            <p className="muted">{user?.email}</p>
                        </div>
                    </div>

                    <form onSubmit={saveProfile} className="space-y-5">
                        <div>
                            <label htmlFor="profile-name" className="label">
                                Full name
                            </label>
                            <input
                                id="profile-name"
                                className="field"
                                value={name}
                                onChange={event => setName(event.target.value)}
                                minLength={2}
                                maxLength={80}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-email" className="label">
                                Email address
                            </label>
                            <input
                                id="profile-email"
                                className="field bg-slate-50 text-slate-400"
                                type="email"
                                value={user?.email ?? ""}
                                disabled
                            />
                            <p className="mt-2 text-xs text-slate-400">Email changes are not supported in this demo.</p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="profile-phone" className="label">
                                    Sample phone number
                                </label>
                                <input
                                    id="profile-phone"
                                    className="field"
                                    type="tel"
                                    placeholder="Optional fictional number"
                                    value={phone}
                                    onChange={event => setPhone(event.target.value)}
                                    maxLength={24}
                                />
                            </div>

                            <div>
                                <label htmlFor="profile-blood-group" className="label">
                                    Sample blood group
                                </label>
                                <select
                                    id="profile-blood-group"
                                    className="field"
                                    value={bloodGroup}
                                    onChange={event => setBloodGroup(event.target.value)}
                                >
                                    <option value="">Not specified</option>
                                    {bloodGroups.map(group => (
                                        <option key={group}>{group}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {error && <Notice error>{error}</Notice>}
                        {message && <Notice>{message}</Notice>}

                        <button type="submit" className="btn btn-primary">
                            <Save size={17} /> Save changes
                        </button>
                    </form>
                </section>

                <div className="space-y-6">
                    <section className="card p-6">
                        <div className="mb-4 inline-flex rounded-xl bg-teal-50 p-3 text-teal-700">
                            <UserRound size={23} />
                        </div>
                        <h2 className="text-lg font-bold">About this account</h2>
                        <p className="muted mt-3">
                            This account exists only in this browser. Patient entries are separated by account in the
                            interface, but anyone with access to browser storage can inspect or modify them.
                        </p>
                        <p className="muted mt-3">
                            There is no server authentication, cross-device sync, email verification, or password
                            recovery.
                        </p>
                    </section>

                    <section className="card p-6">
                        <h2 className="text-lg font-bold">End your session</h2>
                        <p className="muted mt-3">
                            Signing out removes the active demo session. Your local account and entries remain in this
                            browser.
                        </p>
                        <button onClick={signOut} className="btn btn-secondary mt-5 w-full">
                            <LogOut size={17} /> Sign out
                        </button>
                    </section>
                </div>
            </div>
        </>
    );
}
