import { createClient } from "@/lib/supabase/server";
import type { Student, StudentStatus } from "@/types/domain";
import type { StudentInput } from "@/schemas/student.schema";

export interface StudentFilters {
  search?: string;
  status?: StudentStatus | "";
  planId?: string;
  teacherId?: string;
  page?: number;
  pageSize?: number;
}

export interface StudentListItem extends Student {
  active_plan_id: string | null;
  active_plan_name: string | null;
  active_plan_price_cents: number | null;
  active_teacher_id: string | null;
}

export async function listStudents(filters: StudentFilters = {}) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const needsInnerJoin = Boolean(filters.planId || filters.teacherId);

  let query = supabase
    .from("students")
    .select(
      needsInnerJoin
        ? `*, subscriptions!inner(status, plan_id, teacher_id, plans(name, price_cents))`
        : `*, subscriptions!left(status, plan_id, teacher_id, plans(name, price_cents))`,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.planId) {
    query = query.eq("subscriptions.plan_id", filters.planId);
  }
  if (filters.teacherId) {
    query = query.eq("subscriptions.teacher_id", filters.teacherId);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  type Row = Student & {
    subscriptions: {
      status: string;
      plan_id: string;
      teacher_id: string | null;
      plans: { name: string; price_cents: number } | null;
    }[];
  };

  const items: StudentListItem[] = ((data as unknown as Row[]) ?? []).map((row) => {
    const activeSub = row.subscriptions?.find((s) => s.status === "active") ?? row.subscriptions?.[0];
    return {
      ...row,
      active_plan_id: activeSub?.plan_id ?? null,
      active_plan_name: activeSub?.plans?.name ?? null,
      active_plan_price_cents: activeSub?.plans?.price_cents ?? null,
      active_teacher_id: activeSub?.teacher_id ?? null,
    };
  });

  return { items, total: count ?? 0, page, pageSize };
}

export async function getStudentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Student;
}

export async function getStudentLessons(studentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*, teachers(full_name), attendance(status)")
    .eq("student_id", studentId)
    .order("starts_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createStudent(input: StudentInput) {
  const supabase = await createClient();
  const { plan_id, teacher_id, ...studentFields } = input;

  const { data: student, error } = await supabase
    .from("students")
    .insert(studentFields)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  if (plan_id) {
    const { error: subError } = await supabase.from("subscriptions").insert({
      student_id: student.id,
      plan_id,
      teacher_id: teacher_id ?? null,
      status: "active",
    });
    if (subError) throw new Error(subError.message);
  }

  return student as Student;
}

export async function updateStudent(id: string, input: StudentInput) {
  const supabase = await createClient();
  const { plan_id, teacher_id, ...studentFields } = input;

  const { data, error } = await supabase
    .from("students")
    .update(studentFields)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  if (plan_id) {
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("student_id", id)
      .eq("status", "active")
      .maybeSingle();

    if (existing) {
      await supabase
        .from("subscriptions")
        .update({ plan_id, teacher_id: teacher_id ?? null })
        .eq("id", existing.id);
    } else {
      await supabase.from("subscriptions").insert({
        student_id: id,
        plan_id,
        teacher_id: teacher_id ?? null,
        status: "active",
      });
    }
  }

  return data as Student;
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
