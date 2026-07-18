from app.analytics.aggregations import (
    get_max,
    get_min,
    get_average,
    get_total,
    get_count,
    top_n,
    bottom_n,
)


def execute_query(df, schema, intent):
    """
    Execute analytical queries based on detected intent.
    """

    if intent.metric is None:
        return None

    metric = getattr(schema, intent.metric, None)

    if metric is None:
        return None

    label = (
        schema.country
        or schema.destination
        or schema.category
    )

    # MAX
    if intent.operation == "MAX":

        if label is None:
            return None

        return get_max(df, metric, label)

    # MIN
    if intent.operation == "MIN":

        if label is None:
            return None

        return get_min(df, metric, label)

    # AVERAGE
    if intent.operation == "AVG":
        return get_average(df, metric)

    # TOTAL
    if intent.operation == "SUM":
        return get_total(df, metric)

    # COUNT
    if intent.operation == "COUNT":
        return get_count(df, metric)

    # TOP N
    if intent.operation == "TOP":
        return top_n(
            df,
            metric,
            intent.limit,
        )

    # BOTTOM N
    if intent.operation == "BOTTOM":
        return bottom_n(
            df,
            metric,
            intent.limit,
        )

    return None