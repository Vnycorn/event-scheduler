from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Project settings
    PROJECT_NAME: str = "Event Scheduler"
    VERSION: str = "1.0.0"
    API_STR: str
    NEXT_PUBLIC_API_URL : str
    
    # Database settings
    DB_HOST : str
    DB_PORT : str
    DB_NAME : str
    DB_USER : str
    DB_PASSWORD : str

    class Config:
        env_file = "../.env"

settings = Settings() 