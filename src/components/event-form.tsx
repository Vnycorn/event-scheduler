"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { EventFormData } from "@/types/event";
import { useToast } from "@/hooks/use-toast";
import { DayPicker } from "@/components/day-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { eventFormSchema } from "@/types/event";
import { useNewEvent } from "@/hooks/use-event";
import { Loader2Icon } from "lucide-react";

export function EventForm() {
  const [is_recurring, setIsRecurring] = useState(false);
  const { toast } = useToast();
  const {
    mutate: addEvent,
    isSuccess: eventHasBeenAdded,
    isPending: isAddingEvent,
    isError: addEventError,
    error: addEventErrorData,
  } = useNewEvent();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      start_time: "",
      duration: 30,
      is_recurring: false,
      recurring_days: [],
    },
  });

  useEffect(() => {
    if (eventHasBeenAdded) {
      toast({
        title: "Event scheduled",
        description: "Your event has been scheduled.",
      });
      form.reset();
      setIsRecurring(false);
    }
  }, [eventHasBeenAdded]);

  useEffect(() => {
    if (addEventError) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          addEventErrorData instanceof Error
            ? addEventErrorData.message
            : String(addEventErrorData),
      });
    }
  }, [addEventError]);

  function onSubmit(data: EventFormData) {
    try {
      const startDate = new Date(data.start_time);
      if (isNaN(startDate.getTime())) {
        toast({
          variant: "destructive",
          title: "Invalid Date",
          description: "Please select a valid date and time",
        });
        return;
      }

      const newEvent = {
        ...data,
        recurring_days: data.is_recurring ? data.recurring_days.sort() : [],
      };

      addEvent(newEvent);
    } catch (error) {
      console.log("💥", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule event. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Team Meeting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="30"
                  min="1"
                  className="w-full"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setIsRecurring(!!checked);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Recurring Event</FormLabel>
                <p className="text-sm text-muted-foreground">
                  This event repeats weekly
                </p>
              </div>
            </FormItem>
          )}
        />

        {is_recurring && (
          <FormField
            control={form.control}
            name="recurring_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat on</FormLabel>
                <DayPicker
                  value={field.value}
                  onChange={field.onChange}
                  className="mt-2"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isAddingEvent ? (
          <Button
            type="submit"
            className="cursor-not-allowed flex gap-2"
            disabled
          >
            <Loader2Icon className="h-6 w-6 animate-spin" />
            <span>Creating Event...</span>
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Schedule Event
          </Button>
        )}
      </form>
    </Form>
  );
}
