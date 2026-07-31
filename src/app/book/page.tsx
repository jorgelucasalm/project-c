"use client";

import Link from "next/link";
// import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addDays, format, isSameDay } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { availableSlots, teacherName } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// export const Route = createFileRoute("/book/")({
//   head: () => ({
//     meta: [
//       { title: "Book a free trial lesson — Lingua School" },
//       {
//         name: "description",
//         content:
//           "Pick a date and time for your free 30-minute English trial lesson with a certified teacher.",
//       },
//       {
//         property: "og:title",
//         content: "Book a free trial lesson — Lingua School",
//       },
//       {
//         property: "og:description",
//         content: "Only real available slots. Confirmation in under a minute.",
//       },
//     ],
//   }),
//   component: BookTrial,
// });

export default function BookTrial() {
  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)),
    [],
  );
  const [date, setDate] = useState<Date>(days[0]);
  const [slot, setSlot] = useState<{ time: string; teacherId: string } | null>(
    null,
  );
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });

  const slots = useMemo(() => availableSlots(date, 30, 15), [date]);

  const pickDate = (d: Date) => {
    setDate(d);
    setSlot(null);
    setLoadingSlots(true);
    setTimeout(() => setLoadingSlots(false), 400);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return toast.error("Please choose a time slot");
    if (!form.name || !form.email || !form.whatsapp)
      return toast.error("Please fill in all fields");
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      //   navigate({
      //     to: "/book/confirmed",
      //     search: {
      //       name: form.name,
      //       date: format(date, "yyyy-MM-dd"),
      //       time: slot.time,
      //       teacher: teacherName(slot.teacherId),
      //     },
      //   });
    }, 700);
  };

  return (
    <div className="min-h-screen hero-surface">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> Lingua School
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Book your free trial lesson
          </h1>
          <p className="mt-2 text-muted-foreground">
            30 minutes, one-to-one, no card required.
          </p>
        </div>

        <section className="card-surface mt-8 p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-primary" /> 1. Select a date
          </p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const active = isSameDay(d, date);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => pickDate(d)}
                  className={cn(
                    "min-w-[74px] shrink-0 rounded-xl border px-3 py-3 text-center transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span className="block text-[11px] uppercase tracking-wide opacity-80">
                    {format(d, "EEE")}
                  </span>
                  <span className="mt-0.5 block text-lg font-semibold">
                    {format(d, "d")}
                  </span>
                  <span className="block text-[11px] opacity-80">
                    {format(d, "MMM")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card-surface mt-4 p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-primary" /> 2. Choose an available
            time
          </p>
          {loadingSlots ? (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-11 rounded-xl" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={CalendarDays}
                title="No slots on this day"
                description="Our teachers are fully booked. Try another date."
              />
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => (
                  <button
                    key={s.time + s.teacherId}
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-xl border px-2 py-3 text-sm font-medium transition-colors",
                      slot?.time === s.time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
              {slot && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {format(date, "EEEE, d MMM")} at {slot.time} with{" "}
                  <span className="font-medium text-foreground">
                    {teacherName(slot.teacherId)}
                  </span>
                </p>
              )}
            </>
          )}
        </section>

        <form onSubmit={submit} className="card-surface mt-4 p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-primary" /> 3. Your details
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@mail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp number</Label>
              <Input
                id="whatsapp"
                placeholder="+55 11 98765-4321"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm my free trial lesson
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            We&#39;ll send a confirmation by email and a reminder on WhatsApp.
          </p>
        </form>
      </main>
    </div>
  );
}
