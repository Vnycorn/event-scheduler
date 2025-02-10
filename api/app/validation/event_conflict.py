from datetime import datetime, timedelta
from typing import List, Optional
from app.schemas import EventBase, EventResponse

def has_conflict(new_event: EventBase, existing_events: List[EventResponse], exclude_id: Optional[str]) -> bool:
    start_time = new_event.start_time
    end_time = start_time + timedelta(minutes=new_event.duration)

    for event in existing_events:
        if exclude_id and event.id == exclude_id:
            continue

        event_start = event.start_time
        event_end = event_start + timedelta(minutes=event.duration)

        # Check if events overlap in time
        time_overlap = (
            (start_time >= event_start and start_time < event_end) or
            (end_time > event_start and end_time <= event_end) or
            (start_time <= event_start and end_time >= event_end)
        )

        # If neither event is recurring, check time overlap and same date
        if not event.is_recurring and not new_event.is_recurring:
            if (time_overlap and 
                event_start.date() == start_time.date()):
                return True

        # If both events are recurring, check shared days
        elif event.is_recurring and new_event.is_recurring:
            shared_days = any(day in new_event.recurring_days 
                            for day in event.recurring_days)
            if time_overlap and shared_days:
                return True

        # If only one event is recurring
        elif event.is_recurring:
            if (time_overlap and 
                start_time.weekday() in event.recurring_days):
                return True

        elif new_event.is_recurring:
            if (time_overlap and 
                event_start.weekday() in new_event.recurring_days):
                return True

    return False
