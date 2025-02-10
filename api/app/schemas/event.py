from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import HTTPException

# Base event schema that defines common fields and validations
class EventBase(BaseModel):
    name: str
    start_time: datetime
    duration: int = Field(..., gt=0, le=1440)  # Duration in minutes, max 24 hours
    is_recurring: bool = False
    recurring_days: List[int] = []  # Days of week (0-6) where event repeats

    @field_validator('recurring_days')
    def validate_recurring_days(cls, v, info):
        # Ensure recurring events have at least one day selected
        if info.data.get('is_recurring', False) and not v:
            raise ValueError('Recurring events must have at least one day selected')
        # Validate days are within valid range (Monday=0 to Sunday=6)
        if not all(0 <= day <= 6 for day in v):
            raise ValueError('Days must be between 0 and 6')
        return v

# Schema for creating new events
class EventCreate(EventBase):
    name: str = Field(
        min_length=1, 
        max_length=100, 
        pattern=r'^[a-zA-Z0-9\s\-_]+'  # Alphanumeric with spaces, hyphens, underscores
    )
    start_time: datetime = Field(...)
    duration: int = Field(
        ...,
        gt=0,
        le=1440,
        description="Event duration in minutes, maximum 24 hours (1440 minutes)"
    )
    is_recurring: bool = Field(
        default=False,
        description="Whether the event repeats on specific days"
    )
    recurring_days: List[int] = Field(
        default_factory=list,
        description="List of days (0-6) when event repeats, where 0 is Monday"
    )

    @field_validator('start_time')
    def validate_start_time(cls, v:str):
        # Prevent creating events in the past
        if v and v < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail='Start time cannot be in the past')
        return v

    @field_validator('name')
    def validate_name(cls, v:str):
        # Ensure name is not empty or just whitespace
        if not v.strip():
            raise HTTPException(status_code=400, detail='Name cannot be empty or just whitespace')
        return v.strip()

# Schema for updating existing events with optional fields
class EventUpdate(EventBase):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
        pattern=r'^[a-zA-Z0-9\s\-_]+'
    )
    start_time: datetime | None = Field(default=None)
    duration: int | None = Field(
        default=None,
        gt=0,
        le=1440,
        description="Event duration in minutes, maximum 24 hours (1440 minutes)"
    )
    is_recurring: bool | None = Field(
        default=None,
        description="Whether the event repeats on specific days"
    )
    recurring_days: List[int] | None = Field(
        default=None,
        description="List of days (0-6) when event repeats, where 0 is Monday"
    )

    @field_validator('start_time')
    def validate_start_time(cls, v:str):
        # Prevent creating events in the past
        if v and v < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail='Start time cannot be in the past')
        return v

    @field_validator('name')
    def validate_name(cls, v:str):
        # Ensure name is not empty or just whitespace
        if not v.strip():
            raise HTTPException(status_code=400, detail='Name cannot be empty or just whitespace')
        return v.strip()

# Schema for returning event data with system fields
class Event(EventBase):
    id: str
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True  # Enables ORM mode for Pydantic


class EventResponse(EventBase):
    id: str
