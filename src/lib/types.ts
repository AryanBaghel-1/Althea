export type Profile = {
    id: string;
    name: string;
    email: string;
    phone: string;
    bloodGroup: string;
};

export type Account = {
    profile: Profile;
    salt: string;
    passwordHash: string;
};

export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    initials: string;
    experience: number;
    location: string;
    color: string;
};

export type Appointment = {
    id: string;
    doctorId: string;
    startsAt: string;
    type: "Video consultation" | "In-person";
    status: "booked" | "cancelled";
};

export type MedicalRecord = {
    id: string;
    title: string;
    category: "Lab report" | "Prescription" | "Visit summary" | "Other";
    date: string;
    notes: string;
};

export type Medication = {
    id: string;
    name: string;
    instructions: string;
    time: string;
    takenDates: string[];
};

export type PatientData = {
    appointments: Appointment[];
    records: MedicalRecord[];
    medications: Medication[];
};

export type Database = {
    version: 1;
    accounts: Account[];
    patients: Record<string, PatientData>;
};
