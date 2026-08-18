"use client";

import { format } from "date-fns";
import { Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppPageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlan, nextLessonFor, plans, students } from "@/lib/mock-data";
import Link from "next/link";

function StudentDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New student
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
          <DialogDescription>
            Create a student profile and assign a plan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="s-name">Full name</Label>
            <Input id="s-name" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-email">Email</Label>
            <Input id="s-email" type="email" placeholder="jane@mail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-wa">WhatsApp</Label>
            <Input id="s-wa" placeholder="+1 415 555 0100" />
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ${p.monthlyPrice}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Student created");
            }}
          >
            Save student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");

  const rows = students.filter((s) => {
    const matchesQuery = [s.name, s.email, s.whatsapp]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "all" || s.status === status;
    const matchesPlan = plan === "all" || s.planId === plan;
    return matchesQuery && matchesStatus && matchesPlan;
  });

  return (
    <>
      <AppPageHeader
        title="Students"
        description={`${students.length} students in your school`}
        actions={<StudentDialog />}
      />
      <div className="card-surface p-4 sm:p-5">
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="trial">Trial</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students…"
                className="w-full pl-9 sm:w-56"
              />
            </div>
            <Select
              value={plan}
              onValueChange={(value) => setPlan(value ?? "all")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {rows.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students found"
              description="Try adjusting your filters or search."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monthly price</TableHead>
                  <TableHead>Next lesson</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => {
                  const p = getPlan(s.planId);
                  const next = nextLessonFor(s.id);
                  return (
                    <TableRow key={s.id} className="cursor-pointer">
                      <TableCell className="font-medium">
                        <Link
                          href={`/students/${s.id}`}
                          className="hover:text-primary"
                        >
                          {s.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.whatsapp}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.email}
                      </TableCell>
                      <TableCell>{p?.name ?? "—"}</TableCell>
                      <TableCell>{p ? `$${p.monthlyPrice}` : "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {next
                          ? format(new Date(next.start), "d MMM · HH:mm")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
