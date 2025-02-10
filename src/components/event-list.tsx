"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Repeat, Pencil, Loader2Icon } from "lucide-react";
import { EditEventDialog } from "@/components/edit-event-dialog";
import { useToast } from "@/hooks/use-toast";
import type { ScheduledEvent } from "@/types/event";
import { useDeleteEvent, useGetEventsInfinite } from "@/hooks/use-event";
import { useTotalCount } from "@/store/total-count";
import { Skeleton } from "./ui/skeleton";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventList() {
  const { toast } = useToast();
  const [editingEvent, setEditingEvent] = useState<ScheduledEvent | null>(null);
  const { total } = useTotalCount();

  const LIMIT = 3;

  const {
    data: eventsData,
    fetchNextPage,
    isFetching,
    isLoading,
  } = useGetEventsInfinite(LIMIT);
  const {
    mutate: deleteEvent,
    isSuccess: eventHasBeenDeleted,
    isPending: isDeletingEvent,
    isError: deleteEventError,
  } = useDeleteEvent();

  useEffect(() => {
    if (eventHasBeenDeleted) {
      toast({
        title: "Event deleted",
        description: "Your event has been deleted.",
      });
    }
  }, [eventHasBeenDeleted]);

  useEffect(() => {
    if (deleteEventError) {
      toast({
        title: "Error",
        description: "There was an error deleting your event.",
      });
    }
  }, [deleteEventError]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[300px]" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const events = eventsData?.pages.flatMap((page) => page) || [];

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No events scheduled</h3>
        <p className="text-muted-foreground">
          Create your first event to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {eventsData?.pages.map((page) => {
          return page.map((event) => {
            return (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.start_time), "PPp")}
                      </span>
                      {event.is_recurring && (
                        <span className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          Repeats:{" "}
                          {event.recurring_days
                            .map((day) => DAYS[day])
                            .join(", ")}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingEvent(event)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {isDeletingEvent ? (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 cursor-not-allowed"
                        disabled
                      >
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteEvent(event.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Duration: {event.duration} minutes
                  </p>
                </CardContent>
              </Card>
            );
          });
        })}
      </div>

      {(eventsData?.pages.flat().length ?? 0) < total ? (
        isFetching ? (
          <div>Loading...</div>
        ) : (
          <div className="flex justify-between items-center">
            <span>
              Showing {eventsData?.pages.flat().length} of {total} results
            </span>
            <Button
              variant="outline"
              onClick={() => {
                fetchNextPage();
              }}
            >
              Show More
            </Button>
          </div>
        )
      ) : (
        <div>
          Showing {eventsData?.pages.flat().length} of {total} results
        </div>
      )}
      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
        />
      )}
    </>
  );
}
