def format_max(metric, result):
    return (
        f"📈 Highest {metric.title()}\n\n"
        f"{result['label']} recorded "
        f"{result['value']:,} {metric}."
    )


def format_min(metric, result):
    return (
        f"📉 Lowest {metric.title()}\n\n"
        f"{result['label']} recorded "
        f"{result['value']:,} {metric}."
    )


def format_average(metric, value):
    if metric == "rating":
        return f"⭐ Average Rating\n\n{value:.2f} / 5"

    return (
        f"📊 Average {metric.title()}\n\n"
        f"{value:,.2f}"
    )


def format_total(metric, value):
    if metric == "revenue":
        return (
            f"💰 Total Revenue\n\n"
            f"${value:,.2f}"
        )

    return (
        f"👥 Total {metric.title()}\n\n"
        f"{value:,.0f}"
    )


def format_count(metric, value):
    return (
        f"📋 Total {metric.title()}\n\n"
        f"{int(value)}"
    )