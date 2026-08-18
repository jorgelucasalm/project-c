"use client";

import { format } from "date-fns";
import { ArrowLeft, Mail, MessageCircle, Pencil } from "lucide-react";
import { use } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { AppPageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  getPlan,
  getStudent,
  lessons,
  payments,
  teacherName,
} from "@/lib/mock-data";

export default function StudentProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const student = getStudent(id);
  if (!student) {
    return (
      <>
        <AppPageHeader
          title="Student not found"
          description={`No student was found with ID ${id}.`}
          actions={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/students" />}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> All students
            </Button>
          }
        />
        <div className="card-surface p-5 text-sm text-muted-foreground">
          Check the URL or return to the students list.
        </div>
      </>
    );
  }

  const plan = getPlan(student.planId);
  const history = lessons
    .filter((l) => l.studentId === student.id)
    .sort((a, b) => +new Date(b.start) - +new Date(a.start));
  const paid = payments.filter((p) => p.studentId === student.id);
  const attendance = history.filter((l) =>
    ["completed", "absent"].includes(l.status),
  );

  return (
    <>
      <AppPageHeader
        title={student.name}
        description={`${student.level} · joined ${format(new Date(student.joinedAt), "MMM yyyy")}`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/students" />}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> All students
            </Button>
            <Button onClick={() => toast.success("Student saved")}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="card-surface p-5">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarFallback className="bg-primary-soft text-primary">
                {student.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{student.name}</p>
              <StatusBadge status={student.status} className="mt-1" />
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">{student.whatsapp}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="font-medium">{plan?.name ?? "No plan"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Monthly price</dt>
              <dd className="font-medium">
                {plan ? `$${plan.monthlyPrice}` : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Teacher</dt>
              <dd className="font-medium">{teacherName(student.teacherId)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Level</dt>
              <dd className="font-medium">{student.level}</dd>
            </div>
          </dl>
        </div>
        <div className="card-surface p-5">
          <Tabs defaultValue="lessons">
            <TabsList className="flex-wrap">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        {format(new Date(l.start), "d MMM yyyy · HH:mm")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {teacherName(l.teacherId)}
                      </TableCell>
                      <TableCell>{l.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={l.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        {format(new Date(l.start), "d MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            l.status === "completed" ? "completed" : "absent"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="payments" className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paid.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {format(new Date(p.date), "d MMM yyyy")}
                      </TableCell>
                      <TableCell>${p.amount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.method}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-3">
              <Textarea defaultValue={student.notes} rows={6} />
              <Button size="sm" onClick={() => toast.success("Notes saved")}>
                Save notes
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
