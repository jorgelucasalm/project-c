import { createClient } from "@/lib/supabase/server";
import type { Teacher, TeacherAvailability } from "@/types/domain";
import type { TeacherInput, AvailabilitySlotInput } from "@/schemas/teacher.schema";

export async function listTeachers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Teacher[];
}

export async function getTeacherById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Teacher;
}

export async function createTeacher(input: TeacherInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("teachers").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data as Teacher;
}

export async function updateTeacher(id: string, input: TeacherInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Teacher;
}

export async function deleteTeacher(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listAvailability(teacherId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teacher_availability")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return data as TeacherAvailability[];
}

export async function addAvailabilitySlot(teacherId: string, input: AvailabilitySlotInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("teacher_availability").insert({
    teacher_id: teacherId,
    weekday: input.weekday,
    start_time: `${input.start_time}:00`,
    end_time: `${input.end_time}:00`,
  });
  if (error) throw new Error(error.message);
}

export async function removeAvailabilitySlot(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("teacher_availability").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
