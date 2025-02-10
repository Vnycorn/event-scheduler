import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Union, Dict

from app.utils import get_async_conn
from app.models import Event as EventModel
from app.schemas import EventCreate, EventUpdate, Event as EventSchema
from app.validation import has_conflict
from app.schemas import EventBase


router = APIRouter()


@router.post("/", response_model=EventSchema)
async def create_event(event: EventCreate, db: AsyncSession = Depends(get_async_conn)):
    """
    Create a new event.

    Args:
        event: Event data from request body
        db: Database session dependency

    Returns:
        Created event object

    Raises:
        HTTPException: If event conflicts with existing events
    """
    existing_events = (await db.execute(select(EventModel))).scalars().all()

    # Now check for conflicts with properly formatted events
    if has_conflict(event, existing_events, exclude_id=None):
        raise HTTPException(
            status_code=400, detail="Event overlaps with existing events"
        )

    db_event = EventModel(id=str(uuid.uuid4()), **event.model_dump())
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event


@router.get("/", response_model=Dict[str, Union[List[EventSchema], int]])
async def get_events(
    page: int = Query(1, gt=0),
    limit: int = Query(10, gt=0),
    db: AsyncSession = Depends(get_async_conn),
):
    """
    Get a list of events with pagination.

    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session dependency

    Returns:
        List of events
    """
    skip = (page - 1) * limit
    count_result = await db.execute(select(func.count()).select_from(EventModel))
    total = count_result.scalar()
    result = await db.execute(
        select(EventModel)
        .order_by(
            func.coalesce(EventModel.created_at).desc()
        )
        .offset(skip)
        .limit(limit)
    )
    events = result.scalars().all()
    return {"events": events, "total": total}


@router.put("/{event_id}")
async def update_event(
    event_id: str, event_update: EventUpdate, db: AsyncSession = Depends(get_async_conn)
):
    """
    Update an existing event by ID.

    Args:
        event_id: UUID of the event to update
        event_update: Updated event data
        db: Database session dependency

    Returns:
        Updated event object

    Raises:
        HTTPException: If event not found or conflicts with existing events
    """
    result = await db.execute(select(EventModel).filter(EventModel.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Only update the fields that are actually provided in the request
    update_data = event_update.model_dump(exclude_unset=True)

    # Create complete update data for conflict checking
    complete_update = EventBase(
        name=update_data.get("name", db_event.name),
        start_time=update_data.get("start_time", db_event.start_time),
        duration=update_data.get("duration", db_event.duration),
        is_recurring=update_data.get("is_recurring", db_event.is_recurring),
        recurring_days=update_data.get("recurring_days", db_event.recurring_days),
    )

    existing_events = (await db.execute(select(EventModel))).scalars().all()

    if has_conflict(complete_update, existing_events, exclude_id=event_id):
        raise HTTPException(
            status_code=400, detail="Event overlaps with existing events"
        )

    # Update only the provided fields
    for field, value in update_data.items():
        setattr(db_event, field, value)

    await db.commit()
    await db.refresh(db_event)
    return {"eventId": event_id}


@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    patch_index: int = Query(..., description="Index of event to return after deletion"),
    db: AsyncSession = Depends(get_async_conn)):
    """
    Delete an event by ID.

    Args:
        event_id: UUID of the event to delete
        db: Database session dependency

    Returns:
        Success message

    Raises:
        HTTPException: If event not found
    """

    print(patch_index, not patch_index, patch_index != 0)

    return_data = {}

    if patch_index != 0:
        patch_result = await db.execute(
            select(EventModel)
            .order_by(func.coalesce(EventModel.created_at).desc())
            .offset(patch_index)
            .limit(1)
        )
        patch_event = patch_result.scalar_one_or_none()
        return_data["patchEvent"] = patch_event
        

    result = await db.execute(select(EventModel).filter(EventModel.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    await db.delete(db_event)
    await db.commit()

    return_data["eventId"] = event_id

    return return_data