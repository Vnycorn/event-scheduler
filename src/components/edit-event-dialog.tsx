"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { EventFormData, ScheduledEvent } from "@/types/event";
import { DayPicker } from "@/components/day-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { eventFormSchema } from "@/types/event";
import { useEditEvent } from "@/hooks/use-event";
import { compareData } from "@/lib/compare-data";
import { Loader2Icon } from "lucide-react";

interface EditEventDialogProps {
  event: ScheduledEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEventDialog({
  event,
  open,
  onOpenChange,
}: EditEventDialogProps) {
  const [is_recurring, setIsRecurring] = useState(event.is_recurring);
  const { toast } = useToast();
  const {
    mutate: editEvent,
    isSuccess: eventHasBeenUpdated,
    isPending: isUpdatingEvent,
    isError: updateEventError,
    error: updateEventErrorData,
  } = useEditEvent();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event.name,
      start_time: event.start_time,
      duration: event.duration,
      is_recurring: event.is_recurring,
      recurring_days: event.recurring_days,
    },
  });

  useEffect(() => {
    if (eventHasBeenUpdated) {
      toast({
        description: "Event updated successfully",
      });
      form.reset();
      onOpenChange(false);
    }
  }, [eventHasBeenUpdated, onOpenChange, toast]);

  useEffect(() => {
    if (updateEventError) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          updateEventErrorData instanceof Error
            ? updateEventErrorData.message
            : String(updateEventErrorData),
      });
    }
  }, [updateEventError, toast]);

  function onSubmit(data: EventFormData) {
    try {
      const changedFields = data as Partial<EventFormData>;

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof EventFormData;
        if (compareData(event[typedKey], data[typedKey])) {
          delete changedFields[typedKey];
        }
      });

      if (Object.keys(changedFields).length > 0) {
        editEvent({
          eventId: event.id,
          updatedEvent: changedFields,
        });
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.log("💥", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event. Please try again.",
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {isUpdatingEvent ? (
                <Button
                  type="submit"
                  className="cursor-not-allowed flex gap-2 w-full"
                  disabled
                >
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                  <span>Updating Event...</span>
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Update Event
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
