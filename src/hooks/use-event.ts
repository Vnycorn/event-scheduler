"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ScheduledEvent, EventFormData } from "@/types/event";
import AxiosInstance from "@/lib/axios-instance";
import { useTotalCount } from "@/store/total-count";

export const useGetEventsInfinite = (limit = 10) => {
  const { setTotal } = useTotalCount();

  return useInfiniteQuery<ScheduledEvent[]>({
    queryKey: ["events"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await AxiosInstance.get("/api/events", {
        params: {
          page: pageParam,
          limit: limit,
        },
      });
      setTotal(res.data.total);
      return res.data.events;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });
};

export const useNewEvent = () => {
  const queryClient = useQueryClient();
  const { total, increaseTotal } = useTotalCount();

  return useMutation({
    mutationFn: async (event: EventFormData) => {
      const res = await AxiosInstance.post("/api/events", {
        ...event,
      });
      return res.data;
    },
    onSuccess: (data) => {
      increaseTotal();
      queryClient.setQueryData<InfiniteData<ScheduledEvent[]>>(
        ["events"],
        (prevData) => {
          const pages = prevData?.pages.map((page) => [...page]) ?? [];
          if (pages.flat().length < total) pages[0].pop();
          pages[0].unshift({
            ...data,
          });
          return { ...prevData!, pages };
        },
      );
    },
  });
};
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { total, decreaseTotal } = useTotalCount();
  const showCount = queryClient
    .getQueryData<InfiniteData<ScheduledEvent[]>>(["events"])
    ?.pages.flat().length;
  const patchIndex = showCount === total ? 0 : showCount;

  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await AxiosInstance.delete(`/api/events/${eventId}`, {
        params: {
          patch_index: patchIndex,
        },
      });
      return res.data;
    },

    onSuccess: (data) => {
      decreaseTotal();
      queryClient.setQueryData<InfiniteData<ScheduledEvent[]>>(
        ["events"],
        (prevData) => {
          if (prevData) {
            // Flatten all pages, remove deleted item, and add patch data if exists
            const allEvents = prevData.pages
              .flat()
              .filter((event) => event.id !== data.eventId);

            if (data.patchEvent) {
              allEvents.push(data.patchEvent);
            }

            // Regroup into pages of the original size
            const pageSize = prevData.pages[0].length;
            const regroupedPages = [];
            for (let i = 0; i < allEvents.length; i += pageSize) {
              regroupedPages.push(allEvents.slice(i, i + pageSize));
            }

            return {
              ...prevData,
              pages: regroupedPages,
            };
          }
          return prevData;
        },
      );
    },
  });
};

export const useEditEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
      updatedEvent: Partial<EventFormData>;
    }) => {
      const res = await AxiosInstance.put(`/api/events/${data.eventId}`, {
        ...data.updatedEvent,
      });

      return res.data;
    },
    onSuccess: (data, variables) => {
      // Update event in query
      queryClient.setQueryData<InfiniteData<ScheduledEvent[]>>(
        ["events"],
        (prevData) => {
          if (prevData) {
            const updatedPages = prevData.pages.map((page) =>
              page.map((event) => {
                if (event.id === data.eventId) {
                  return {
                    ...event,
                    ...variables.updatedEvent,
                  };
                }
                return event;
              }),
            );
            return {
              ...prevData,
              pages: updatedPages,
            };
          }
          return prevData;
        },
      );
    },
  });
};
