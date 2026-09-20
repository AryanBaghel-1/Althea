import {
    ArrowDownToLine,
    ArrowRight,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    FileText,
    Heart,
    HeartPulse,
    Pill,
    Sparkles,
    Stethoscope,
    Video,
} from "lucide-react";
import Link from "next/link";
import { LandingFooter } from "../components/landing-footer";
import { LandingNavbar } from "../components/landing-navbar";

const features = [
    {
        icon: Stethoscope,
        title: "Find your care team",
        text: "Explore a demo directory of specialists and find the right type of care.",
    },
    {
        icon: CalendarDays,
        title: "A calmer calendar",
        text: "Create demo appointments and keep upcoming visits in one place.",
    },
    {
        icon: FileText,
        title: "Less searching. More clarity.",
        text: "Organize sample records and download simple text summaries.",
    },
    {
        icon: Pill,
        title: "Build a daily routine",
        text: "Add medication reminders and track your daily check-ins.",
    },
];

const steps = [
    {
        title: "Create your demo account",
        text: "Get started with a name, email, and a unique demo password.",
    },
    {
        title: "Make yourself at home",
        text: "Explore your dashboard and personalize your sample profile.",
    },
    {
        title: "Keep everything together",
        text: "Manage demo appointments, records, and reminders in one workspace.",
    },
];

const faqs = [
    {
        question: "Is this a real healthcare service?",
        answer: "No. Althea is a frontend demonstration. Doctors and clinics are fictional, bookings are local demo entries, and no healthcare services are provided.",
    },
    {
        question: "Where is my information stored?",
        answer: "Demo accounts and entries are stored in this browser's localStorage. They are not synced across devices and may disappear when site data is cleared.",
    },
    {
        question: "Can I store real medical information?",
        answer: "No. Browser storage is not suitable for sensitive patient data. Use fictional details and do not reuse an important password.",
    },
    {
        question: "Does Althea send medication notifications?",
        answer: "This version provides an in-app checklist only. It does not send push notifications, email, or medical advice.",
    },
];

export default function LandingPage() {
    return (
        <main className="overflow-x-clip bg-white">
            <LandingNavbar />

            <div className="hero-glow">
                <section className="hero-grid">
                    <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-14 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-20">
                        <div>
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-semibold text-teal-800">
                                <Sparkles size={15} />A little less admin. A little more care.
                            </div>

                            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                                Your health.
                                <br />
                                Your space.
                                <br />
                                <span className="text-teal-700">All together.</span>
                            </h1>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-500">
                                A thoughtfully simple place for appointments, records, and everyday reminders. Make room
                                for what matters most: you.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link href="/signup" className="btn btn-primary">
                                    Create demo account <ArrowRight size={17} />
                                </Link>
                                <Link href="/login" className="btn btn-secondary">
                                    Log in to dashboard
                                </Link>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Check size={15} className="text-teal-600" />
                                    No credit card
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Check size={15} className="text-teal-600" />
                                    Browser-only demo
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Check size={15} className="text-teal-600" />
                                    Made for every screen
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-5 rounded-[3rem] bg-teal-200/30 blur-2xl" />

                            <div className="relative rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-teal-900/10 sm:p-7">
                                <div className="mb-7 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-2xl bg-teal-700 p-3 text-white">
                                            <HeartPulse size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Your care overview</p>
                                            <p className="mt-1 text-xs text-slate-400">Illustrative dashboard</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                                        Demo
                                    </span>
                                </div>

                                <div className="landing-preview rounded-2xl bg-[#eaf7f2] p-6">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
                                        One thing at a time
                                    </p>
                                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                                        Looking after you,
                                        <br />
                                        starts here.
                                    </h2>
                                    <div className="mt-5 flex gap-2">
                                        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                                            <div
                                                key={index}
                                                className={`flex h-12 flex-1 items-center justify-center rounded-xl text-xs font-semibold ${
                                                    index === 3
                                                        ? "bg-teal-700 text-white"
                                                        : "bg-white/80 text-slate-500"
                                                }`}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-slate-100 p-4">
                                        <CalendarDays className="text-teal-600" size={21} />
                                        <p className="mt-4 text-2xl font-bold">02</p>
                                        <p className="mt-1 text-xs text-slate-400">Sample appointments</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 p-4">
                                        <FileText className="text-violet-500" size={21} />
                                        <p className="mt-4 text-2xl font-bold">08</p>
                                        <p className="mt-1 text-xs text-slate-400">Sample records</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 font-bold text-sky-700">
                                        AS
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold">Dr. Aanya Sharma</p>
                                        <p className="mt-1 text-xs text-slate-400">Sample video consultation</p>
                                    </div>
                                    <Video size={20} className="text-teal-600" />
                                </div>
                            </div>

                            <div className="absolute -bottom-6 right-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:-right-5">
                                <span className="rounded-full bg-teal-50 p-2 text-teal-600">
                                    <CheckCircle2 size={22} />
                                </span>
                                <div>
                                    <p className="text-xs font-bold">A clearer day ahead</p>
                                    <p className="mt-1 text-xs text-slate-400">Everything in its place</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="border-y border-slate-100 bg-slate-50/70 px-5 py-7">
                <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-12 gap-y-5 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-2">
                        <CalendarDays size={19} /> Simple scheduling
                    </span>
                    <span className="flex items-center gap-2">
                        <ArrowDownToLine size={19} /> Downloadable summaries
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock3 size={19} /> Daily check-ins
                    </span>
                    <span className="flex items-center gap-2">
                        <Heart size={19} /> Patient-first design
                    </span>
                </div>
            </section>

            <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
                <div className="max-w-2xl">
                    <p className="eyebrow">Thoughtfully connected</p>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                        Everything you need.
                        <br />
                        Nothing in your way.
                    </h2>
                    <p className="muted mt-5 max-w-lg">
                        Healthcare admin can feel complicated. Your personal workspace should not.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map(({ icon: Icon, title, text }) => (
                        <article
                            key={title}
                            className="card p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-900/5"
                        >
                            <div className="mb-7 inline-flex rounded-2xl bg-teal-50 p-3 text-teal-700">
                                <Icon size={25} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                            <p className="muted mt-3">{text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="how-it-works" className="landing-steps bg-[#f0f7f4] px-5 py-20">
                <div className="mx-auto max-w-7xl lg:px-3">
                    <div className="text-center">
                        <p className="eyebrow">Getting started</p>
                        <h2 className="mt-4 text-4xl font-bold tracking-tight">A fresh start in three steps.</h2>
                    </div>

                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <article key={step.title} className="text-center">
                                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-teal-700 shadow-sm">
                                    0{index + 1}
                                </span>
                                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                                <p className="muted mx-auto mt-3 max-w-xs">{step.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
                <p className="eyebrow text-center">Good to know</p>
                <h2 className="mt-4 text-center text-4xl font-bold tracking-tight">A little more clarity.</h2>

                <div className="mt-10 space-y-3">
                    {faqs.map(faq => (
                        <details key={faq.question} className="card group p-6">
                            <summary className="cursor-pointer font-semibold text-slate-800">{faq.question}</summary>
                            <p className="muted mt-4">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section className="px-5 pb-20">
                <div className="mx-auto max-w-7xl rounded-[2rem] bg-teal-900 px-6 py-14 text-center text-white">
                    <Sparkles className="mx-auto mb-5 text-teal-300" size={30} />
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Your next chapter of care starts here.
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-teal-100">
                        Explore a calmer, more connected way to organize your day.
                    </p>
                    <Link href="/signup" className="btn mt-8 bg-white text-teal-900 hover:bg-teal-50">
                        Try the demo <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            <LandingFooter />
        </main>
    );
}
