"use client";

import { Check, Clock3, Pill, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useApp } from "../../components/app-provider";
import { EmptyState, Notice, PageHeading } from "../../components/ui";
import { errorMessage, localDate } from "../../lib/utils";

export function Medications() {
    const { data, updateData } = useApp();

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [time, setTime] = useState("09:00");
    const [error, setError] = useState("");

    const today = localDate();
    const taken = data.medications.filter(item => item.takenDates.includes(today)).length;

    function addMedication(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        try {
            if (!name.trim() || !instructions.trim()) {
                throw new Error("Enter a sample name and instructions.");
            }

            updateData(current => ({
                ...current,
                medications: [
                    ...current.medications,
                    {
                        id: crypto.randomUUID(),
                        name: name.trim(),
                        instructions: instructions.trim(),
                        time,
                        takenDates: [],
                    },
                ],
            }));

            setName("");
            setInstructions("");
            setShowForm(false);
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    function toggleTaken(id: string) {
        try {
            const currentDate = localDate();

            updateData(current => ({
                ...current,
                medications: current.medications.map(medication => {
                    if (medication.id !== id) return medication;

                    const alreadyTaken = medication.takenDates.includes(currentDate);

                    return {
                        ...medication,
                        takenDates: alreadyTaken
                            ? medication.takenDates.filter(date => date !== currentDate)
                            : [...medication.takenDates, currentDate],
                    };
                }),
            }));
            setError("");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    function removeMedication(id: string) {
        if (!window.confirm("Remove this demo medication reminder?")) return;

        try {
            updateData(current => ({
                ...current,
                medications: current.medications.filter(item => item.id !== id),
            }));
            setError("");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    return (
        <>
            <PageHeading
                eyebrow="Small everyday routines"
                title="Medications"
                description="A once-daily demo checklist, not a prescription or dosing tool."
                action={
                    <button className="btn btn-primary" onClick={() => setShowForm(value => !value)}>
                        <Plus size={17} /> {showForm ? "Close form" : "Add reminder"}
                    </button>
                }
            />

            <div className="card mb-7 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-bold">Today’s check-in</h2>
                    <p className="muted mt-1">
                        {taken} of {data.medications.length} reminders marked taken.
                    </p>
                </div>

                <progress
                    aria-label="Today's medication checklist progress"
                    className="h-3 w-full max-w-xs overflow-hidden rounded-full accent-teal-700"
                    max={data.medications.length || 1}
                    value={taken}
                />
            </div>

            {error && (
                <div className="mb-6">
                    <Notice error>{error}</Notice>
                </div>
            )}

            {showForm && (
                <form onSubmit={addMedication} className="card mb-7 space-y-5 p-6">
                    <h2 className="text-lg font-bold">New sample reminder</h2>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div>
                            <label htmlFor="medication-name" className="label">
                                Sample medication name
                            </label>
                            <input
                                id="medication-name"
                                className="field"
                                placeholder="Demo medication"
                                value={name}
                                onChange={event => setName(event.target.value)}
                                maxLength={100}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="medication-instructions" className="label">
                                Sample instructions
                            </label>
                            <input
                                id="medication-instructions"
                                className="field"
                                placeholder="Example text only"
                                value={instructions}
                                onChange={event => setInstructions(event.target.value)}
                                maxLength={200}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="medication-time" className="label">
                                Daily reminder time
                            </label>
                            <input
                                id="medication-time"
                                type="time"
                                className="field"
                                value={time}
                                onChange={event => setTime(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save reminder
                    </button>
                </form>
            )}

            {data.medications.length === 0 ? (
                <EmptyState
                    title="A fresh start"
                    description="Add a fictional medication reminder to try the daily checklist."
                />
            ) : (
                <div className="space-y-4">
                    {[...data.medications]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(medication => {
                            const isTaken = medication.takenDates.includes(today);

                            return (
                                <article
                                    key={medication.id}
                                    className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center"
                                >
                                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                                        <Pill size={26} />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="break-words font-bold">{medication.name}</h2>
                                        <p className="muted mt-1 break-words">{medication.instructions}</p>
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                            <Clock3 size={14} /> Daily at {medication.time}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            aria-pressed={isTaken}
                                            onClick={() => toggleTaken(medication.id)}
                                            className={`btn ${
                                                isTaken ? "bg-teal-50 text-teal-700 hover:bg-teal-100" : "btn-secondary"
                                            }`}
                                        >
                                            <Check size={16} />
                                            {isTaken ? "Taken today · Undo" : "Mark as taken"}
                                        </button>
                                        <button
                                            aria-label={`Remove ${medication.name}`}
                                            className="btn btn-danger px-3"
                                            onClick={() => removeMedication(medication.id)}
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                </div>
            )}

            <p className="muted mt-6">
                This page does not send notifications or determine whether a medication is appropriate. Follow your
                clinician’s instructions for actual medications.
            </p>
        </>
    );
}
