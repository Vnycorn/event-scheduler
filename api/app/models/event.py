from sqlalchemy import Column, Integer, String, Boolean, ARRAY, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

class Event(Base):
    """
    Event model representing calendar events in the system.
    
    This model stores both one-time and recurring events with their associated
    properties like timing, duration, and recurrence patterns.
    """
    __tablename__ = "events"

    # Unique identifier for the event
    id = Column(String, primary_key=True, index=True)
    
    # Name/title of the event
    name = Column(String, nullable=False)
    
    # Start date and time of the event
    start_time = Column(DateTime(timezone=True), nullable=False)
    
    # Duration of the event in minutes
    duration = Column(Integer, nullable=False)
    
    # Flag indicating if this is a recurring event
    is_recurring = Column(Boolean, default=False)
    
    # Array of days (0-6, where 0 is Monday) when event recurs
    recurring_days = Column(ARRAY(Integer), default=[])
    
    # Automatically managed timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
