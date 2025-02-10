"""create_tables

Revision ID: 1fdbe2edda0c
Revises: 7fecbf857c26
Create Date: 2025-02-10 09:57:21.676795

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1fdbe2edda0c'
down_revision: Union[str, None] = '7fecbf857c26'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
