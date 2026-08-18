import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lingua School — Book your free English trial lesson",
  description:
    "Learn English with certified teachers. Book a free 30-minute trial lesson in under a minute.",

  openGraph: {
    title: "Lingua School — Free English trial lesson",
    description:
      "Certified teachers, flexible schedules, and a free trial lesson to get started.",
  },
};

const benefits = [
  {
    icon: Users,
    title: "Certified teachers",
    text: "Native and near-native teachers matched to your level and goals.",
  },
  {
    icon: Clock,
    title: "Flexible schedule",
    text: "Pick slots that fit your week — reschedule up to 12h before.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp reminders",
    text: "Never miss a lesson. Automatic reminders before every class.",
  },
  {
    icon: BarChart3,
    title: "Visible progress",
    text: "Attendance, notes and level tracking after every single lesson.",
  },
];

const steps = [
  {
    n: "01",
    title: "Pick a date",
    text: "Choose any day that works — we only show slots that are really free.",
  },
  {
    n: "02",
    title: "Choose a time",
    text: "Availability accounts for teacher schedules, breaks and existing lessons.",
  },
  {
    n: "03",
    title: "Meet your teacher",
    text: "Get a confirmation with the lesson link and a WhatsApp reminder.",
  },
];

const testimonials = [
  {
    name: "Marina C.",
    role: "Product designer",
    text: "I went from freezing in meetings to leading them in four months. The trial lesson sold me instantly.",
  },
  {
    name: "Hiroshi T.",
    role: "IELTS candidate",
    text: "Structured, honest feedback every lesson. My band score went from 6.0 to 7.5.",
  },
  {
    name: "Lucas M.",
    role: "Sales lead",
    text: "Booking takes 40 seconds and the schedule always fits around my calls.",
  },
];

const faqs = [
  {
    q: "Is the trial lesson really free?",
    a: "Yes. Your first 30-minute lesson is completely free, with no card required.",
  },
  {
    q: "How do I choose a plan?",
    a: "After the trial, your teacher recommends a plan based on your level and goals. You can change it any time.",
  },
  {
    q: "Can I reschedule a lesson?",
    a: "Absolutely — reschedule from your confirmation link up to 12 hours before the lesson.",
  },
  {
    q: "Which levels do you teach?",
    a: "From A1 beginner to C2 advanced, plus Business English and IELTS/TOEFL exam preparation.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate font-semibold tracking-tight">
              Lingua School
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Admin login
            </Button>
          </div>
        </div>
      </header>

      <section className="hero-surface border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Speak English with confidence — starting this week
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              One-to-one lessons with certified teachers, scheduled around your
              life. Try your first 30-minute lesson free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="px-6 py-6"
                nativeButton={false}
                render={<Link href="/book" />}
              >
                Book Your Free Trial Lesson{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "No card required",
                "Cancel anytime",
                "Lessons from $79/mo",
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                This week`&apos;`s open slots
              </p>
              <CalendarCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                "Mon 09:00",
                "Mon 14:45",
                "Tue 10:30",
                "Wed 08:00",
                "Wed 16:15",
                "Thu 11:00",
                "Thu 18:30",
                "Fri 09:45",
                "Fri 15:00",
              ].map((slot) => (
                <Link
                  key={slot}
                  href="/book"
                  className="rounded-lg border border-border bg-background px-2 py-2.5 text-center text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {slot}
                </Link>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              nativeButton={false}
              render={<Link href="/book" />}
            >
              See all available times
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          Why students stay
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="card-surface p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <b.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-medium">{b.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card-surface p-6">
                <span className="text-sm font-semibold text-primary">
                  {s.n}
                </span>
                <p className="mt-3 text-lg font-medium">{s.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Students say
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card-surface p-6">
                <Quote className="h-5 w-5 text-primary" />
                <blockquote className="mt-3 text-sm leading-relaxed">
                  {t.text}
                </blockquote>
                <figcaption className="mt-4 text-sm font-medium">
                  {t.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {t.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 bg-card/50">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Frequently asked
          </h2>
          <Accordion className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="font-semibold tracking-tight">Lingua School</p>
            <p className="mt-1 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lingua School. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/book" className="hover:text-foreground">
              Book a trial
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Admin
            </Link>
            <Link href="/settings" className="hover:text-foreground">
              Settings
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
