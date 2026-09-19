"use client";

import { CalendarDays, MapPin, Search, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useApp } from "../../components/app-provider";
import { Badge, EmptyState, Notice, PageHeading } from "../../components/ui";
import { doctors } from "../../lib/data";
import type { Appointment } from "../../lib/types";
import { errorMessage, localDate } from "../../lib/utils";

const specialties = ["All specialties", ...new Set(doctors.map(d => d.specialty))];

export function Doctors() {
    const { updateData } = useApp();
    const bookingRef = useRef<HTMLElement>(null);

    const [query, setQuery] = useState("");
    const [specialty, setSpecialty] = useState("All specialties");
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState(localDate());
    const [time, setTime] = useState("10:00");
    const [type, setType] = useState<Appointment["type"]>("Video consultation");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const selectedDoctor = doctors.find(doctor => doctor.id === doctorId);

    const filtered = doctors.filter(doctor => {
        const matchesSearch = `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(query.toLowerCase());

        return matchesSearch && (specialty === "All specialties" || doctor.specialty === specialty);
    });

    function selectDoctor(id: string) {
        setDoctorId(id);
        setMessage("");
        setError("");

        requestAnimationFrame(() => {
            bookingRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            bookingRef.current?.focus({ preventScroll: true });
        });
    }

    function handleBooking(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            if (!selectedDoctor) throw new Error("Choose a doctor first.");

            const start = new Date(`${date}T${time}:00`);

            if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
                throw new Error("Please choose a future date and time.");
            }

            const startsAt = start.toISOString();

            updateData(current => {
                const conflict = current.appointments.some(
                    appointment =>
                        appointment.status === "booked" &&
                        Math.abs(new Date(appointment.startsAt).getTime() - start.getTime()) < 30 * 60 * 1000,
                );

                if (conflict) {
                    throw new Error("You already have a demo appointment within 30 minutes of this time.");
                }

                return {
                    ...current,
                    appointments: [
                        ...current.appointments,
                        {
                            id: crypto.randomUUID(),
                            doctorId,
                            startsAt,
                            type,
                            status: "booked",
                        },
                    ],
                };
            });

            setMessage(`Demo appointment with ${selectedDoctor.name} saved. No clinic has been contacted.`);
            setDoctorId("");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    return (
        <>
            <PageHeading
                eyebrow="Meet your care team"
                title="Find a doctor"
                description="Explore fictional specialists and create a local demo appointment."
            />

            <div className="card mb-7 grid gap-4 p-4 sm:grid-cols-[1fr_240px]">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        aria-label="Search doctors"
                        className="field pl-11"
                        placeholder="Search name or specialty"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                    />
                </div>
                <select
                    aria-label="Filter by specialty"
                    className="field"
                    value={specialty}
                    onChange={event => setSpecialty(event.target.value)}
                >
                    {specialties.map(item => (
                        <option key={item}>{item}</option>
                    ))}
                </select>
            </div>

            {message && (
                <div className="mb-6">
                    <Notice>{message}</Notice>
                </div>
            )}

            <p className="mb-4 text-xs text-slate-500">{filtered.length} fictional doctors</p>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map(doctor => (
                    <article key={doctor.id} className="card p-6">
                        <div className="flex items-start justify-between">
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold ${doctor.color}`}
                            >
                                {doctor.initials}
                            </div>
                            <Badge neutral>Demo profile</Badge>
                        </div>

                        <h2 className="mt-5 text-lg font-bold">{doctor.name}</h2>
                        <p className="mt-1 text-sm font-medium text-teal-700">{doctor.specialty}</p>
                        <p className="mt-3 text-xs text-slate-500">{doctor.experience} years · Fictional experience</p>
                        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <MapPin size={14} /> {doctor.location}
                        </p>

                        <button onClick={() => selectDoctor(doctor.id)} className="btn btn-secondary mt-6 w-full">
                            <CalendarDays size={16} /> Book demo visit
                        </button>
                    </article>
                ))}
            </div>

            {filtered.length === 0 && (
                <EmptyState title="No doctors found" description="Try a different name or specialty." />
            )}

            {selectedDoctor && (
                <section
                    ref={bookingRef}
                    tabIndex={-1}
                    className="card mt-8 scroll-mt-24 p-6 outline-none sm:p-8"
                    aria-label="Appointment booking"
                >
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <p className="eyebrow">New demo appointment</p>
                            <h2 className="mt-2 text-xl font-bold">{selectedDoctor.name}</h2>
                            <p className="muted mt-2">
                                30-minute appointment. Times use your device’s local timezone. Provider availability is
                                not checked.
                            </p>
                        </div>
                        <button
                            aria-label="Close booking form"
                            onClick={() => setDoctorId("")}
                            className="rounded-xl p-2 hover:bg-slate-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleBooking} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label htmlFor="appointment-date" className="label">
                                    Date
                                </label>
                                <input
                                    id="appointment-date"
                                    type="date"
                                    className="field"
                                    min={localDate()}
                                    value={date}
                                    onChange={event => setDate(event.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="appointment-time" className="label">
                                    Time
                                </label>
                                <input
                                    id="appointment-time"
                                    type="time"
                                    className="field"
                                    value={time}
                                    onChange={event => setTime(event.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="appointment-type" className="label">
                                    Visit type
                                </label>
                                <select
                                    id="appointment-type"
                                    className="field"
                                    value={type}
                                    onChange={event => setType(event.target.value as Appointment["type"])}
                                >
                                    <option>Video consultation</option>
                                    <option>In-person</option>
                                </select>
                            </div>
                        </div>

                        {error && <Notice error>{error}</Notice>}

                        <button className="btn btn-primary" type="submit">
                            Confirm demo appointment
                        </button>
                    </form>
                </section>
            )}
        </>
    );
}
