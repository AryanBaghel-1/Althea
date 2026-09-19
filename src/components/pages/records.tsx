"use client";

import { Download, FileText, Plus, Search, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useApp } from "../../components/app-provider";
import { Badge, EmptyState, Notice, PageHeading } from "../../components/ui";
import type { MedicalRecord } from "../../lib/types";
import { errorMessage, formatDate, localDate } from "../../lib/utils";

export function Records() {
    const { data, updateData } = useApp();

    const [showForm, setShowForm] = useState(false);
    const [query, setQuery] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<MedicalRecord["category"]>("Lab report");
    const [date, setDate] = useState(localDate());
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const filtered = data.records
        .filter(record => `${record.title} ${record.category}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => b.date.localeCompare(a.date));

    function addRecord(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        try {
            if (!title.trim()) throw new Error("Enter a record title.");

            if (date > localDate()) {
                throw new Error("Record dates cannot be in the future.");
            }

            updateData(current => ({
                ...current,
                records: [
                    {
                        id: crypto.randomUUID(),
                        title: title.trim(),
                        category,
                        date,
                        notes: notes.trim(),
                    },
                    ...current.records,
                ],
            }));

            setTitle("");
            setNotes("");
            setShowForm(false);
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    function removeRecord(id: string) {
        if (!window.confirm("Delete this demo record?")) return;

        try {
            updateData(current => ({
                ...current,
                records: current.records.filter(record => record.id !== id),
            }));
            setError("");
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    function downloadRecord(record: MedicalRecord) {
        const content = [
            "CAREFLOW DEMO RECORD",
            "Not an official medical document.",
            "",
            `Title: ${record.title}`,
            `Category: ${record.category}`,
            `Date: ${record.date}`,
            "",
            "Sample notes:",
            record.notes || "No notes provided.",
        ].join("\n");

        const blob = new Blob([content], {
            type: "text/plain;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = `${record.title.replace(/[^a-z0-9]/gi, "-") || "record"}.txt`;

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    return (
        <>
            <PageHeading
                eyebrow="Everything in one place"
                title="Medical records"
                description="Organize fictional record summaries. File uploads are not enabled."
                action={
                    <button className="btn btn-primary" onClick={() => setShowForm(value => !value)}>
                        <Plus size={17} /> {showForm ? "Close form" : "Add demo record"}
                    </button>
                }
            />

            {error && (
                <div className="mb-6">
                    <Notice error>{error}</Notice>
                </div>
            )}

            {showForm && (
                <form onSubmit={addRecord} className="card mb-7 space-y-5 p-6">
                    <h2 className="text-lg font-bold">New demo record</h2>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div>
                            <label htmlFor="record-title" className="label">
                                Record title
                            </label>
                            <input
                                id="record-title"
                                className="field"
                                placeholder="Sample annual checkup"
                                value={title}
                                onChange={event => setTitle(event.target.value)}
                                maxLength={120}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="record-category" className="label">
                                Category
                            </label>
                            <select
                                id="record-category"
                                className="field"
                                value={category}
                                onChange={event => setCategory(event.target.value as MedicalRecord["category"])}
                            >
                                <option>Lab report</option>
                                <option>Prescription</option>
                                <option>Visit summary</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="record-date" className="label">
                                Date
                            </label>
                            <input
                                id="record-date"
                                type="date"
                                className="field"
                                value={date}
                                max={localDate()}
                                onChange={event => setDate(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="record-notes" className="label">
                            Fictional notes
                        </label>
                        <textarea
                            id="record-notes"
                            className="field min-h-28 resize-y"
                            placeholder="Use sample text only. Do not enter real health information."
                            value={notes}
                            onChange={event => setNotes(event.target.value)}
                            maxLength={2000}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save demo record
                    </button>
                </form>
            )}

            <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    aria-label="Search records"
                    className="field pl-11"
                    placeholder="Search records by title or category"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="No records found" description="Add a fictional record or try another search." />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map(record => (
                        <article key={record.id} className="card flex flex-col p-6">
                            <div className="flex items-start justify-between gap-3">
                                <span className="rounded-2xl bg-violet-50 p-3 text-violet-600">
                                    <FileText size={25} />
                                </span>
                                <Badge neutral>{record.category}</Badge>
                            </div>

                            <h2 className="mt-5 break-words text-lg font-bold">{record.title}</h2>
                            <p className="mt-2 text-xs text-slate-400">{formatDate(record.date)}</p>
                            <p className="muted mt-4 line-clamp-3 break-words">{record.notes || "No notes added."}</p>

                            <div className="mt-auto flex gap-2 pt-6">
                                <button onClick={() => downloadRecord(record)} className="btn btn-secondary flex-1">
                                    <Download size={16} /> Download
                                </button>
                                <button
                                    aria-label={`Delete ${record.title}`}
                                    onClick={() => removeRecord(record.id)}
                                    className="btn btn-danger px-3"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </>
    );
}
