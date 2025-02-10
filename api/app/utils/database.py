from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.config import settings

DB_HOST = settings.DB_HOST
DB_PORT = settings.DB_PORT
DB_USER = settings.DB_USER
DB_PASSWORD = settings.DB_PASSWORD
DB_NAME = settings.DB_NAME

async def get_async_conn():
    # Async database URL and engine
    async_db_url = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    async_engine = create_async_engine(async_db_url)
    async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)
    
    async with async_session() as db:
        yield db
