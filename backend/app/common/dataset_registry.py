from uuid import uuid4


def generate_dataset_id() -> str:
    """
    Generate a unique dataset identifier.
    """

    return f"ds_{uuid4().hex[:8]}"