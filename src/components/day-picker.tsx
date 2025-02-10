"use client";

import { FormControl, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const DAYS = [
  { label: "Sun", fullLabel: "Sunday", value: 0 },
  { label: "Mon", fullLabel: "Monday", value: 1 },
  { label: "Tue", fullLabel: "Tuesday", value: 2 },
  { label: "Wed", fullLabel: "Wednesday", value: 3 },
  { label: "Thu", fullLabel: "Thursday", value: 4 },
  { label: "Fri", fullLabel: "Friday", value: 5 },
  { label: "Sat", fullLabel: "Saturday", value: 6 },
] as const;

interface DayPickerProps {
  value?: number[];
  onChange?: (days: number[]) => void;
  className?: string;
}

export function DayPicker({ value = [], onChange, className }: DayPickerProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2",
        className,
      )}
    >
      {DAYS.map((day) => (
        <FormItem key={day.value} className="relative">
          <FormControl>
            <div className="relative">
              <Checkbox
                checked={value?.includes(day.value)}
                onCheckedChange={(checked) => {
                  const updatedDays = checked
                    ? [...value, day.value]
                    : value?.filter((v) => v !== day.value);
                  onChange?.(updatedDays);
                }}
                className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="min-h-[2.5rem] w-full rounded-lg flex items-center justify-center border-2 px-3 transition-colors peer-hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">
                <span className="lg:hidden">{day.fullLabel}</span>
                <span className="hidden lg:inline">{day.label}</span>
              </div>
            </div>
          </FormControl>
        </FormItem>
      ))}
    </div>
  );
}
