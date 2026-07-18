import pandas as pd

from app.analytics.column_mapper import detect_schema
from app.analytics.aggregations import (
    get_max,
    get_min,
    get_average,
    get_total,
    get_count,
)


def answer_from_dataframe(df: pd.DataFrame, question: str):
    """
    Answers common analytical questions directly from the dataframe
    without using the LLM.
    """

    schema = detect_schema(df)
    question = question.lower().strip()

    # ---------------------------
    # Highest Visitors
    # ---------------------------
    if "highest" in question and "visitor" in question:

        if not schema.visitors or not schema.country:
            return "Visitors or Country column not found."

        result = get_max(df, schema.visitors, schema.country)

        return (
            f"{result['label']} has the highest visitors "
            f"with {result['value']:,.0f} visitors."
        )

    # ---------------------------
    # Lowest Visitors
    # ---------------------------
    if "lowest" in question and "visitor" in question:

        if not schema.visitors or not schema.country:
            return "Visitors or Country column not found."

        result = get_min(df, schema.visitors, schema.country)

        return (
            f"{result['label']} has the lowest visitors "
            f"with {result['value']:,.0f} visitors."
        )

    # ---------------------------
    # Highest Revenue
    # ---------------------------
    if "highest" in question and "revenue" in question:

        if not schema.revenue or not schema.country:
            return "Revenue or Country column not found."

        result = get_max(df, schema.revenue, schema.country)

        return (
            f"{result['label']} generated the highest revenue "
            f"of ${result['value']:,.2f}."
        )

    # ---------------------------
    # Lowest Revenue
    # ---------------------------
    if "lowest" in question and "revenue" in question:

        if not schema.revenue or not schema.country:
            return "Revenue or Country column not found."

        result = get_min(df, schema.revenue, schema.country)

        return (
            f"{result['label']} generated the lowest revenue "
            f"of ${result['value']:,.2f}."
        )

    # ---------------------------
    # Average Rating
    # ---------------------------
    if "average" in question and "rating" in question:

        if not schema.rating:
            return "Rating column not found."

        avg = get_average(df, schema.rating)

        return f"The average rating is {avg:.2f}."

    # ---------------------------
    # Highest Rating
    # ---------------------------
    if "highest" in question and "rating" in question:

        if not schema.rating or not schema.country:
            return "Rating or Country column not found."

        result = get_max(df, schema.rating, schema.country)

        return (
            f"{result['label']} has the highest rating "
            f"of {result['value']:.2f}."
        )

    # ---------------------------
    # Lowest Rating
    # ---------------------------
    if "lowest" in question and "rating" in question:

        if not schema.rating or not schema.country:
            return "Rating or Country column not found."

        result = get_min(df, schema.rating, schema.country)

        return (
            f"{result['label']} has the lowest rating "
            f"of {result['value']:.2f}."
        )

    # ---------------------------
    # Total Revenue
    # ---------------------------
    if "total" in question and "revenue" in question:

        if not schema.revenue:
            return "Revenue column not found."

        total = get_total(df, schema.revenue)

        return f"Total revenue is ${total:,.2f}."

    # ---------------------------
    # Total Visitors
    # ---------------------------
    if "total" in question and "visitor" in question:

        if not schema.visitors:
            return "Visitors column not found."

        total = get_total(df, schema.visitors)

        return f"Total visitors are {total:,.0f}."

    # ---------------------------
    # Average Revenue
    # ---------------------------
    if "average" in question and "revenue" in question:

        if not schema.revenue:
            return "Revenue column not found."

        avg = get_average(df, schema.revenue)

        return f"Average revenue is ${avg:,.2f}."

    # ---------------------------
    # Average Visitors
    # ---------------------------
    if "average" in question and "visitor" in question:

        if not schema.visitors:
            return "Visitors column not found."

        avg = get_average(df, schema.visitors)

        return f"Average visitors are {avg:,.0f}."

    # ---------------------------
    # Number of Countries
    # ---------------------------
    if "how many countries" in question or "number of countries" in question:

        if not schema.country:
            return "Country column not found."

        count = get_count(df, schema.country)

        return f"There are {count} countries."

    # ---------------------------
    # Number of Destinations
    # ---------------------------
    if (
        "how many destinations" in question
        or "number of destinations" in question
    ):

        if not schema.destination:
            return "Destination column not found."

        count = get_count(df, schema.destination)

        return f"There are {count} destinations."

    # ---------------------------
    # Unsupported
    # ---------------------------
    return None