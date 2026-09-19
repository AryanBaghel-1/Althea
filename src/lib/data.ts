import type { Doctor, PatientData } from "./types";

export const doctors: Doctor[] = [
    {
        id: "doctor-1",
        name: "Dr. Aanya Sharma",
        specialty: "General Physician",
        initials: "AS",
        experience: 12,
        location: "CareFlow Central Clinic",
        color: "bg-teal-100 text-teal-800",
    },
    {
        id: "doctor-2",
        name: "Dr. Rohan Mehta",
        specialty: "Cardiologist",
        initials: "RM",
        experience: 15,
        location: "CareFlow Heart Centre",
        color: "bg-rose-100 text-rose-800",
    },
    {
        id: "doctor-3",
        name: "Dr. Meera Iyer",
        specialty: "Dermatologist",
        initials: "MI",
        experience: 9,
        location: "CareFlow Skin Clinic",
        color: "bg-violet-100 text-violet-800",
    },
    {
        id: "doctor-4",
        name: "Dr. Kabir Singh",
        specialty: "Orthopedist",
        initials: "KS",
        experience: 11,
        location: "CareFlow Movement Centre",
        color: "bg-sky-100 text-sky-800",
    },
    {
        id: "doctor-5",
        name: "Dr. Sara Khan",
        specialty: "Pediatrician",
        initials: "SK",
        experience: 8,
        location: "CareFlow Family Clinic",
        color: "bg-amber-100 text-amber-800",
    },
    {
        id: "doctor-6",
        name: "Dr. Arjun Rao",
        specialty: "Neurologist",
        initials: "AR",
        experience: 14,
        location: "CareFlow Neuro Centre",
        color: "bg-indigo-100 text-indigo-800",
    },
];

export function emptyPatientData(): PatientData {
    return {
        appointments: [],
        records: [],
        medications: [],
    };
}
