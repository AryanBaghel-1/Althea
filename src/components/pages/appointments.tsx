"use client";

import { CalendarDays, Clock3, MapPin, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { doctors } from "../../lib/data";
import { errorMessage, formatDate, formatTime } from "../../lib/utils";
import { useApp } from "../app-provider";
import { Badge, EmptyState, Notice, PageHeading } from "../ui";

export function Appointments() {
    const { data, updateData } = useApp();
    const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
    const [error, setError] = useState("");

    const now = Date.now();

    const visible = data.appointments
        .filter(appointment => {
            const upcoming = appointment.status === "booked" && new Date(appointment.startsAt).getTime() > now;

            return tab === "upcoming" ? upcoming : !upcoming;
        })
        .sort((a, b) =>
            tab === "upcoming" ? a.startsAt.localeCompare(b.startsAt) : b.startsAt.localeCompare(a.startsAt),
        );

    function cancelAppointment(id: string) {
        if (!window.confirm("Cancel this demo appointment?")) return;

        try {
            updateData(current => ({
                ...current,
                appointments: current.appointments.map(appointment =>
                    appointment.id === id ? { ...appointment, status: "cancelled" } : appointment,
                ),
            }));
            setError("");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    return (
        <>
            <PageHeading
                eyebrow="Your care calendar"
                title="Appointments"
                description="View and manage your local demo visits."
                action={
                    <Link href="/dashboard/doctors" className="btn btn-primary">
                        <CalendarDays size={17} /> New appointment
                    </Link>
                }
            />

            <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1">
                {(["upcoming", "history"] as const).map(item => (
                    <button
                        key={item}
                        aria-pressed={tab === item}
                        onClick={() => setTab(item)}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold capitalize ${
                            tab === item ? "bg-teal-700 text-white" : "text-slate-500"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-5">
                    <Notice error>{error}</Notice>
                </div>
            )}

            {visible.length === 0 ? (
                <EmptyState
                    title={tab === "upcoming" ? "No upcoming appointments" : "No appointment history"}
                    description="Appointments you create will appear here."
                />
            ) : (
                <div className="space-y-4">
                    {visible.map(appointment => {
                        const doctor = doctors.find(item => item.id === appointment.doctorId);
                        const isVideo = appointment.type === "Video consultation";

                        return (
                            <article
                                key={appointment.id}
                                className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center"
                            >
                                <div
                                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                                        doctor?.color ?? "bg-slate-100"
                                    }`}
                                >
                                    {doctor?.initials ?? "DR"}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="font-bold">{doctor?.name ?? "Demo doctor"}</h2>
                                        <Badge neutral={tab === "history"}>
                                            {appointment.status === "cancelled"
                                                ? "Cancelled"
                                                : tab === "upcoming"
                                                  ? "Demo booking"
                                                  : "Past"}
                                        </Badge>
                                    </div>

                                    <p className="mt-2 text-sm text-slate-500">{doctor?.specialty}</p>

                                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays size={14} />
                                            {formatDate(appointment.startsAt)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock3 size={14} />
                                            {formatTime(appointment.startsAt)} · 30 min
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            {isVideo ? <Video size={14} /> : <MapPin size={14} />}
                                            {isVideo ? appointment.type : doctor?.location}
                                        </span>
                                    </div>
                                </div>

                                {tab === "upcoming" && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => cancelAppointment(appointment.id)}
                                    >
                                        Cancel appointment
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            <p className="muted mt-6">
                Times are displayed in your device’s timezone. Demo video visits do not generate meeting links or
                contact providers.
            </p>
        </>
    );
}
