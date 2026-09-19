"use client";

import { ArrowRight, CalendarDays, FileText, Heart, Pill, Stethoscope, Video } from "lucide-react";
import Link from "next/link";
import { useApp } from "../../components/app-provider";
import { Badge, EmptyState, PageHeading } from "../../components/ui";
import { doctors } from "../../lib/data";
import { formatDate, formatTime, localDate } from "../../lib/utils";

export function Overview() {
    const { user, data } = useApp();
    const today = localDate();

    const upcoming = data.appointments
        .filter(appointment => appointment.status === "booked" && new Date(appointment.startsAt).getTime() > Date.now())
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

    const takenToday = data.medications.filter(medication => medication.takenDates.includes(today)).length;

    const stats = [
        {
            label: "Upcoming appointments",
            value: upcoming.length,
            icon: CalendarDays,
            color: "bg-teal-50 text-teal-700",
            href: "/dashboard/appointments",
        },
        {
            label: "Saved records",
            value: data.records.length,
            icon: FileText,
            color: "bg-violet-50 text-violet-700",
            href: "/dashboard/records",
        },
        {
            label: "Medication reminders",
            value: data.medications.length,
            icon: Pill,
            color: "bg-sky-50 text-sky-700",
            href: "/dashboard/medications",
        },
        {
            label: "Checked off today",
            value: `${takenToday}/${data.medications.length}`,
            icon: Heart,
            color: "bg-rose-50 text-rose-700",
            href: "/dashboard/medications",
        },
    ];

    return (
        <>
            <PageHeading
                eyebrow="Your daily overview"
                title={`Hello, ${user?.name.split(" ")[0] ?? "there"} 👋`}
                description="Here is what is happening in your personal care workspace."
                action={
                    <Link href="/dashboard/doctors" className="btn btn-primary">
                        <CalendarDays size={17} /> Book an appointment
                    </Link>
                }
            />

            <section className="relative mb-7 overflow-hidden rounded-3xl bg-[#deefe7] p-7 sm:p-9">
                <div className="absolute -right-10 -top-12 h-64 w-64 rounded-full border-[35px] border-white/25" />
                <div className="relative max-w-xl">
                    <Badge>Your care, at your pace</Badge>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-teal-950">
                        A little planning.
                        <br />A little more peace of mind.
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-7 text-teal-900/70">
                        Keep appointments and everyday reminders together. Your dashboard updates as you add demo
                        entries.
                    </p>
                    <Link
                        href="/dashboard/records"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-800"
                    >
                        Organize your records <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, icon: Icon, color, href }) => (
                    <Link href={href} key={label} className="card p-5 transition hover:border-teal-200">
                        <div className="flex items-start justify-between gap-3">
                            <span className={`rounded-xl p-3 ${color}`}>
                                <Icon size={21} />
                            </span>
                            <ArrowRight size={17} className="text-slate-300" />
                        </div>
                        <p className="mt-5 text-3xl font-bold text-slate-900">{value}</p>
                        <p className="mt-2 text-xs text-slate-500">{label}</p>
                    </Link>
                ))}
            </section>

            <div className="mt-7 grid gap-7 xl:grid-cols-[1.4fr_1fr]">
                <section className="card p-6">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold">Upcoming appointments</h2>
                        <Link href="/dashboard/appointments" className="text-xs font-semibold text-teal-700">
                            View all →
                        </Link>
                    </div>

                    {upcoming.length === 0 ? (
                        <EmptyState
                            title="Your calendar is clear"
                            description="Find a demo doctor and add your first appointment."
                            action={
                                <Link href="/dashboard/doctors" className="btn btn-secondary">
                                    Explore doctors
                                </Link>
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {upcoming.slice(0, 3).map(appointment => {
                                const doctor = doctors.find(item => item.id === appointment.doctorId);

                                return (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                                    >
                                        <span
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold ${
                                                doctor?.color ?? "bg-slate-100"
                                            }`}
                                        >
                                            {doctor?.initials ?? "DR"}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold">{doctor?.name}</h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {formatDate(appointment.startsAt)} · {formatTime(appointment.startsAt)}
                                            </p>
                                        </div>
                                        {appointment.type === "Video consultation" ? (
                                            <Video size={19} className="text-teal-600" />
                                        ) : (
                                            <Stethoscope size={19} className="text-teal-600" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="card p-6">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold">Today’s reminders</h2>
                        <Link href="/dashboard/medications" className="text-xs font-semibold text-teal-700">
                            Manage →
                        </Link>
                    </div>

                    {data.medications.length === 0 ? (
                        <EmptyState
                            title="No reminders yet"
                            description="Add a sample medication to explore the daily checklist."
                        />
                    ) : (
                        <div className="space-y-3">
                            {data.medications.slice(0, 4).map(medication => (
                                <div
                                    key={medication.id}
                                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4"
                                >
                                    <div>
                                        <p className="text-sm font-semibold">{medication.name}</p>
                                        <p className="mt-1 text-xs text-slate-500">{medication.time}</p>
                                    </div>
                                    <Badge neutral={!medication.takenDates.includes(today)}>
                                        {medication.takenDates.includes(today) ? "Taken" : "Pending"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
