alembic revision -m "create_tables"
alembic upgrade head
alembic revision --autogenerate -m "create_events_table"
alembic upgrade head
