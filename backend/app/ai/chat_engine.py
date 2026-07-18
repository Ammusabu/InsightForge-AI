import pandas as pd

from app.ai.groq_client import ask_groq
from app.ai.prompt_builder import build_prompt
from app.ai.intent_engine import detect_intent

from app.analytics.column_mapper import detect_schema
from app.analytics.query_engine import execute_query


def ask_dataset(
    df: pd.DataFrame,
    question: str,
):
    """
    Try answering using the Analytics Engine first.
    Fall back to the LLM only if required.
    """

    # Detect dataset schema
    schema = detect_schema(df)

    # Detect user intent
    intent = detect_intent(question)
    metric_column = getattr(schema, intent.metric) if intent.metric else None

    print("=" * 50)
    print("Question :", question)
    print("Intent   :", intent)
    print("Schema   :", schema)
    print("Metric   :", metric_column)
    print("Operation:", intent.operation)
    print("=" * 50)
    # Execute analytical query
    result = execute_query(df, schema, intent)

    # If analytics engine answered, return it
    if result is not None:

        # Top N / Bottom N results
        if isinstance(result, list):

            lines = []

            for row in result:
                lines.append(str(row))

            return "\n".join(lines)

        # MAX / MIN results
        elif isinstance(result, dict):

            return (
                f"{result['label']} : {result['value']}"
            )

        # AVG / SUM / COUNT
        else:
            return str(result)

    # Fallback to LLM
    prompt = build_prompt(
        df,
        question,
    )

    return ask_groq(prompt)