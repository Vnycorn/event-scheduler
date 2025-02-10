"""create_tables

Revision ID: 7fecbf857c26
Revises: bc0ba7f06112
Create Date: 2025-02-10 09:56:59.012400

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7fecbf857c26'
down_revision: Union[str, None] = 'bc0ba7f06112'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
