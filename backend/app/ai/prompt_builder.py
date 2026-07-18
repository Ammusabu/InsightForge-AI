import pandas as pd

from app.analytics.column_mapper import detect_schema


def build_prompt(
    df: pd.DataFrame,
    question: str,
) -> str:
    """
    Build a prompt for the LLM using only the most relevant
    information from the uploaded tourism dataset.
    """

    schema = detect_schema(df)

    question_lower = question.lower()

    # -------------------------
    # Select Relevant Context
    # -------------------------

    context = df.head(10)

    if schema.revenue and (
        "revenue" in question_lower
        or "income" in question_lower
        or "earnings" in question_lower
        or "sales" in question_lower
    ):
        context = df.nlargest(10, schema.revenue)

    elif schema.visitors and (
        "visitor" in question_lower
        or "tourist" in question_lower
        or "traveller" in question_lower
        or "traveler" in question_lower
        or "footfall" in question_lower
    ):
        context = df.nlargest(10, schema.visitors)

    elif schema.rating and (
        "rating" in question_lower
        or "review" in question_lower
        or "score" in question_lower
        or "stars" in question_lower
    ):
        context = df.nlargest(10, schema.rating)

    # -------------------------
    # Build Prompt
    # -------------------------

    return f"""
You are InsightForge AI.

You are an expert Tourism Business Intelligence Analyst.

Your job is to answer ONLY from the uploaded tourism dataset.

Rules:

- Never invent numbers.
- Never assume missing information.
- If the dataset cannot answer the question, clearly say so.
- Give concise and professional business insights.
- Use plain English.
- Keep answers below 150 words.
- Do NOT use Markdown.
- Do NOT use headings.
- Do NOT use bullet points.
- Do NOT create tables.
- Mention important values whenever possible.

==================================================

DATASET SUMMARY

Total Rows:
{len(df):,}

Total Columns:
{len(df.columns)}

Columns:
{", ".join(df.columns)}

Missing Values:
{df.isnull().sum().to_string()}

==================================================

MOST RELEVANT DATA

{context.to_markdown(index=False)}

==================================================

USER QUESTION

{question}

==================================================

ANSWER
"""