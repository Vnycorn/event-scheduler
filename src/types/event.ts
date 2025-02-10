import { z } from "zod";

// Schema for form validation
export const eventFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    start_time: z.string().refine((value) => {
      try {
        const date = new Date(value);
        return !isNaN(date.getTime());
      } catch {
        return false;
      }
    }, "Invalid date and time"),
    duration: z
      .number()
      .int("Duration must be a whole number")
      .min(1, "Duration must be at least 1 minute")
      .max(1440, "Duration cannot exceed 24 hours"),
    is_recurring: z.boolean(),
    recurring_days: z
      .array(z.number().min(0).max(6))
      .refine(
        (days) => !days.length || days.every((d) => d >= 0 && d <= 6),
        "Invalid days selected",
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (data.is_recurring && data.recurring_days.length === 0) {
        return false;
      }
      return true;
    },
    {
      message: "Please select at least one day for recurring events",
      path: ["recurring_days"],
    },
  );

// Types inferred from the schema
export type EventFormData = z.infer<typeof eventFormSchema>;

export interface ScheduledEvent extends EventFormData {
  id: string;
}
