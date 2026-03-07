import pytest
import os
from alembic.config import Config
from alembic.script import ScriptDirectory

def test_alembic_configuration():
    """Verify that Alembic is configured properly and migrations exist."""
    
    alembic_ini_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    alembic_dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "alembic"))
    
    # Check that paths are valid
    assert os.path.exists(alembic_ini_path), "alembic.ini must exist"
    assert os.path.exists(alembic_dir_path), "alembic directory must exist"
    
    config = Config(alembic_ini_path)
    config.set_main_option("script_location", alembic_dir_path)
    
    script = ScriptDirectory.from_config(config)
    
    # Ensure there's at least one revision
    head = script.get_current_head()
    assert head is not None, "There should be at least one migration revision"
