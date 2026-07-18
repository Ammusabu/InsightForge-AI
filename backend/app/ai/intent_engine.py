from dataclasses import dataclass


@dataclass
class Intent:
    operation: str | None = None
    metric: str | None = None
    group_by: str | None = None
    limit: int = 5


OPERATIONS = {
    "highest": "MAX",
    "maximum": "MAX",
    "largest": "MAX",
    "biggest": "MAX",
    "top": "TOP",

    "lowest": "MIN",
    "minimum": "MIN",
    "smallest": "MIN",
    "least": "MIN",
    "bottom": "BOTTOM",

    "average": "AVG",
    "avg": "AVG",
    "mean": "AVG",

    "total": "SUM",
    "sum": "SUM",

    "count": "COUNT",
    "how many": "COUNT",
    "number of": "COUNT",
}


METRICS = {
    # Visitors
    "visitor": "visitors",
    "visitors": "visitors",
    "tourist": "visitors",
    "tourists": "visitors",
    "traveller": "visitors",
    "travellers": "visitors",
    "traveler": "visitors",
    "travelers": "visitors",
    "footfall": "visitors",

    # Revenue
    "revenue": "revenue",
    "income": "revenue",
    "earnings": "revenue",
    "sales": "revenue",

    # Rating
    "rating": "rating",
    "ratings": "rating",
    "score": "rating",
    "scores": "rating",
    "review": "rating",
    "reviews": "rating",
    "star": "rating",
    "stars": "rating",
}


DIMENSIONS = {
    "country": "country",
    "countries": "country",
    "nation": "country",
    "nations": "country",

    "destination": "destination",
    "destinations": "destination",
    "place": "destination",
    "places": "destination",

    "category": "category",
    "categories": "category",

    "state": "state",
    "states": "state",
}


def detect_intent(question: str) -> Intent:

    question = question.lower().strip()

    # Split into individual words
    question_words = question.split()

    intent = Intent()

    # Detect operation
    for word, op in OPERATIONS.items():
        if word in question or word in question_words:
            intent.operation = op
            break

    # Detect metric
    for word, metric in METRICS.items():
        if word in question or word in question_words:
            intent.metric = metric
            break

    # Detect grouping
    for word, group in DIMENSIONS.items():
        if word in question or word in question_words:
            intent.group_by = group
            break

    # Detect Top N / Bottom N limit
    for i in range(2, 21):
        if str(i) in question_words:
            intent.limit = i
            break

    return intent