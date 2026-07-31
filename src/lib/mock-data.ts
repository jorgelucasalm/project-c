export type LessonStatus = "scheduled" | "completed" | "canceled" | "absent" | "trial";
export type LessonType = "Regular" | "Trial" | "Conversation" | "Exam Prep" | "Business";
export type StudentStatus = "active" | "inactive" | "trial";

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  lessonDuration: number;
  lessonsPerWeek: number;
  active: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  specialty: string;
  color: string;
  studentsCount: number;
  active: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  planId: string | null;
  status: StudentStatus;
  level: string;
  joinedAt: string;
  teacherId: string;
  notes: string;
}

export interface Lesson {
  id: string;
  studentId: string;
  teacherId: string;
  type: LessonType;
  status: LessonStatus;
  start: string;
  end: string;
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  method: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: "lesson" | "trial" | "canceled" | "payment" | "absence" | "whatsapp";
  createdAt: string;
  read: boolean;
}

export interface AvailabilityBlock {
  id: string;
  teacherId: string;
  weekday: number; // 0 = Sunday
  start: string;
  end: string;
}

const dayStart = (offset: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const addMinutes = (iso: string, minutes: number) =>
  new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

export const plans: Plan[] = [
  { id: "p1", name: "Starter", monthlyPrice: 89, lessonDuration: 45, lessonsPerWeek: 1, active: true },
  { id: "p2", name: "Fluency", monthlyPrice: 149, lessonDuration: 60, lessonsPerWeek: 2, active: true },
  { id: "p3", name: "Intensive", monthlyPrice: 259, lessonDuration: 60, lessonsPerWeek: 4, active: true },
  { id: "p4", name: "Business Pro", monthlyPrice: 329, lessonDuration: 90, lessonsPerWeek: 3, active: true },
  { id: "p5", name: "Kids Club", monthlyPrice: 79, lessonDuration: 30, lessonsPerWeek: 2, active: false },
];

export const teachers: Teacher[] = [
  { id: "t1", name: "Emma Whitfield", email: "emma@lingua.school", whatsapp: "+1 415 555 0132", specialty: "Business English", color: "var(--color-primary)", studentsCount: 18, active: true },
  { id: "t2", name: "Daniel Okafor", email: "daniel@lingua.school", whatsapp: "+1 415 555 0177", specialty: "Conversation", color: "var(--color-success)", studentsCount: 14, active: true },
  { id: "t3", name: "Sofia Marchetti", email: "sofia@lingua.school", whatsapp: "+1 415 555 0198", specialty: "IELTS & Exams", color: "var(--color-warning)", studentsCount: 11, active: true },
  { id: "t4", name: "Liam Brennan", email: "liam@lingua.school", whatsapp: "+1 415 555 0110", specialty: "Kids & Teens", color: "var(--color-chart-4)", studentsCount: 9, active: false },
];

export const students: Student[] = [
  { id: "s1", name: "Marina Costa", email: "marina@mail.com", whatsapp: "+55 11 98888 1010", planId: "p2", status: "active", level: "B2", joinedAt: "2025-02-11", teacherId: "t1", notes: "Prefers evening lessons. Working on presentation skills." },
  { id: "s2", name: "Hiroshi Tanaka", email: "hiroshi@mail.com", whatsapp: "+81 90 1234 5678", planId: "p3", status: "active", level: "C1", joinedAt: "2024-09-03", teacherId: "t3", notes: "IELTS target band 7.5 by December." },
  { id: "s3", name: "Ana Beatriz Lima", email: "ana@mail.com", whatsapp: "+55 21 97777 2020", planId: "p1", status: "active", level: "A2", joinedAt: "2025-05-20", teacherId: "t2", notes: "Very shy at first — warm up with small talk." },
  { id: "s4", name: "Lucas Meyer", email: "lucas@mail.com", whatsapp: "+49 151 2233 4455", planId: "p4", status: "active", level: "B1", joinedAt: "2025-01-15", teacherId: "t1", notes: "Company-sponsored. Invoice monthly." },
  { id: "s5", name: "Chloé Dubois", email: "chloe@mail.com", whatsapp: "+33 6 12 34 56 78", planId: null, status: "trial", level: "A1", joinedAt: "2026-07-25", teacherId: "t2", notes: "Trial booked from landing page." },
  { id: "s6", name: "Diego Ramírez", email: "diego@mail.com", whatsapp: "+52 55 1234 9876", planId: "p2", status: "inactive", level: "B1", joinedAt: "2024-11-08", teacherId: "t3", notes: "Paused until September." },
  { id: "s7", name: "Priya Nair", email: "priya@mail.com", whatsapp: "+91 98200 11223", planId: "p3", status: "active", level: "B2", joinedAt: "2025-03-30", teacherId: "t1", notes: "Loves debate topics." },
  { id: "s8", name: "Tom Andersen", email: "tom@mail.com", whatsapp: "+47 412 33 555", planId: null, status: "trial", level: "A2", joinedAt: "2026-07-29", teacherId: "t3", notes: "Referred by Priya." },
];

export const lessons: Lesson[] = [
  { id: "l1", studentId: "s1", teacherId: "t1", type: "Regular", status: "scheduled", start: dayStart(0, 9), end: dayStart(0, 10) },
  { id: "l2", studentId: "s3", teacherId: "t2", type: "Conversation", status: "scheduled", start: dayStart(0, 11), end: dayStart(0, 11, 45) },
  { id: "l3", studentId: "s5", teacherId: "t2", type: "Trial", status: "trial", start: dayStart(0, 14), end: dayStart(0, 14, 30) },
  { id: "l4", studentId: "s2", teacherId: "t3", type: "Exam Prep", status: "scheduled", start: dayStart(0, 16), end: dayStart(0, 17) },
  { id: "l5", studentId: "s4", teacherId: "t1", type: "Business", status: "scheduled", start: dayStart(1, 8), end: dayStart(1, 9, 30) },
  { id: "l6", studentId: "s7", teacherId: "t1", type: "Regular", status: "scheduled", start: dayStart(1, 10), end: dayStart(1, 11) },
  { id: "l7", studentId: "s8", teacherId: "t3", type: "Trial", status: "trial", start: dayStart(1, 15), end: dayStart(1, 15, 30) },
  { id: "l8", studentId: "s2", teacherId: "t3", type: "Exam Prep", status: "completed", start: dayStart(-1, 16), end: dayStart(-1, 17) },
  { id: "l9", studentId: "s1", teacherId: "t1", type: "Regular", status: "absent", start: dayStart(-2, 9), end: dayStart(-2, 10) },
  { id: "l10", studentId: "s3", teacherId: "t2", type: "Conversation", status: "canceled", start: dayStart(-3, 11), end: dayStart(-3, 11, 45) },
  { id: "l11", studentId: "s7", teacherId: "t1", type: "Regular", status: "completed", start: dayStart(-3, 13), end: dayStart(-3, 14) },
  { id: "l12", studentId: "s4", teacherId: "t1", type: "Business", status: "scheduled", start: dayStart(2, 8), end: dayStart(2, 9, 30) },
  { id: "l13", studentId: "s2", teacherId: "t3", type: "Exam Prep", status: "scheduled", start: dayStart(2, 16), end: dayStart(2, 17) },
  { id: "l14", studentId: "s7", teacherId: "t1", type: "Regular", status: "scheduled", start: dayStart(3, 10), end: dayStart(3, 11) },
  { id: "l15", studentId: "s1", teacherId: "t1", type: "Regular", status: "scheduled", start: dayStart(4, 9), end: dayStart(4, 10) },
  { id: "l16", studentId: "s3", teacherId: "t2", type: "Conversation", status: "scheduled", start: dayStart(5, 11), end: dayStart(5, 11, 45) },
];

export const payments: Payment[] = [
  { id: "pay1", studentId: "s1", amount: 149, date: "2026-07-05", status: "paid", method: "Credit card" },
  { id: "pay2", studentId: "s2", amount: 259, date: "2026-07-03", status: "paid", method: "Bank transfer" },
  { id: "pay3", studentId: "s3", amount: 89, date: "2026-07-12", status: "pending", method: "Pix" },
  { id: "pay4", studentId: "s4", amount: 329, date: "2026-06-28", status: "paid", method: "Invoice" },
  { id: "pay5", studentId: "s7", amount: 259, date: "2026-06-15", status: "overdue", method: "Credit card" },
];

export const notifications: AppNotification[] = [
  { id: "n1", title: "Upcoming lesson in 30 minutes", description: "Marina Costa with Emma Whitfield — Regular lesson", type: "lesson", createdAt: dayStart(0, 8, 30), read: false },
  { id: "n2", title: "Trial lesson scheduled", description: "Tom Andersen booked a trial for tomorrow at 15:00", type: "trial", createdAt: dayStart(-1, 18), read: false },
  { id: "n3", title: "Lesson canceled", description: "Ana Beatriz Lima canceled her conversation lesson", type: "canceled", createdAt: dayStart(-3, 9, 15), read: false },
  { id: "n4", title: "Payment reminder sent", description: "Priya Nair — $259 invoice is 12 days overdue", type: "payment", createdAt: dayStart(-3, 7), read: true },
  { id: "n5", title: "Student absent", description: "Marina Costa missed her lesson on Monday", type: "absence", createdAt: dayStart(-2, 10, 5), read: true },
  { id: "n6", title: "WhatsApp reminder sent", description: "24h reminder delivered to 7 students", type: "whatsapp", createdAt: dayStart(-4, 20), read: true },
];

export const availability: AvailabilityBlock[] = [
  { id: "a1", teacherId: "t1", weekday: 1, start: "08:00", end: "12:00" },
  { id: "a2", teacherId: "t1", weekday: 1, start: "14:00", end: "18:00" },
  { id: "a3", teacherId: "t1", weekday: 2, start: "09:00", end: "13:00" },
  { id: "a4", teacherId: "t1", weekday: 3, start: "08:00", end: "12:00" },
  { id: "a5", teacherId: "t1", weekday: 3, start: "15:00", end: "19:00" },
  { id: "a6", teacherId: "t1", weekday: 4, start: "10:00", end: "16:00" },
  { id: "a7", teacherId: "t1", weekday: 5, start: "08:00", end: "12:00" },
  { id: "a8", teacherId: "t2", weekday: 1, start: "10:00", end: "15:00" },
  { id: "a9", teacherId: "t2", weekday: 2, start: "10:00", end: "18:00" },
  { id: "a10", teacherId: "t2", weekday: 4, start: "09:00", end: "14:00" },
  { id: "a11", teacherId: "t3", weekday: 2, start: "13:00", end: "19:00" },
  { id: "a12", teacherId: "t3", weekday: 3, start: "13:00", end: "19:00" },
  { id: "a13", teacherId: "t3", weekday: 5, start: "09:00", end: "17:00" },
];

export const revenueByMonth = [
  { month: "Feb", revenue: 6200, students: 34 },
  { month: "Mar", revenue: 6980, students: 37 },
  { month: "Apr", revenue: 7420, students: 39 },
  { month: "May", revenue: 8110, students: 43 },
  { month: "Jun", revenue: 8640, students: 45 },
  { month: "Jul", revenue: 9280, students: 48 },
];

export const lessonsByWeekday = [
  { day: "Mon", lessons: 14 },
  { day: "Tue", lessons: 18 },
  { day: "Wed", lessons: 16 },
  { day: "Thu", lessons: 21 },
  { day: "Fri", lessons: 12 },
  { day: "Sat", lessons: 7 },
];

export const getStudent = (id: string) => students.find((s) => s.id === id);
export const getTeacher = (id: string) => teachers.find((t) => t.id === id);
export const getPlan = (id: string | null) => (id ? plans.find((p) => p.id === id) : undefined);
export const studentName = (id: string) => getStudent(id)?.name ?? "Unknown student";
export const teacherName = (id: string) => getTeacher(id)?.name ?? "Unassigned";

export const statusColor: Record<LessonStatus, string> = {
  scheduled: "var(--color-primary)",
  completed: "var(--color-success)",
  canceled: "var(--color-destructive)",
  absent: "var(--color-warning)",
  trial: "var(--color-chart-5)",
};

export const nextLessonFor = (studentId: string) => {
  const now = Date.now();
  return lessons
    .filter((l) => l.studentId === studentId && new Date(l.start).getTime() > now && l.status !== "canceled")
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))[0];
};

/** Trial booking slot generation from teacher availability + booked lessons. */
export function availableSlots(date: Date, durationMin = 30, breakMin = 15) {
  const weekday = date.getDay();
  const blocks = availability.filter((b) => b.weekday === weekday);
  const dayLessons = lessons.filter(
    (l) => new Date(l.start).toDateString() === date.toDateString() && l.status !== "canceled",
  );

  const slots: { time: string; teacherId: string }[] = [];
  for (const block of blocks) {
    const [sh, sm] = block.start.split(":").map(Number);
    const [eh, em] = block.end.split(":").map(Number);
    const cursor = new Date(date);
    cursor.setHours(sh, sm, 0, 0);
    const end = new Date(date);
    end.setHours(eh, em, 0, 0);

    while (cursor.getTime() + durationMin * 60_000 <= end.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor.getTime() + durationMin * 60_000);
      const busy = dayLessons.some(
        (l) =>
          l.teacherId === block.teacherId &&
          new Date(l.start).getTime() - breakMin * 60_000 < slotEnd.getTime() &&
          new Date(l.end).getTime() + breakMin * 60_000 > slotStart.getTime(),
      );
      const inPast = slotStart.getTime() < Date.now();
      if (!busy && !inPast) {
        const time = slotStart.toTimeString().slice(0, 5);
        if (!slots.some((s) => s.time === time)) slots.push({ time, teacherId: block.teacherId });
      }
      cursor.setTime(cursor.getTime() + (durationMin + breakMin) * 60_000);
    }
  }
  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

export const lessonEvents = () =>
  lessons.map((l) => ({
    id: l.id,
    title: `${studentName(l.studentId)} · ${l.type}`,
    start: l.start,
    end: l.end,
    backgroundColor: statusColor[l.status],
    borderColor: statusColor[l.status],
    extendedProps: { lesson: l },
  }));

export const addMinutesTo = addMinutes;
