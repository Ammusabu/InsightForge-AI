from datetime import datetime

from app.analytics.analytics_engine import dataset_overview


def generate_report(dataframe):
    overview = dataset_overview(dataframe)

    rows = overview["rows"]
    cols = overview["columns"]
    missing = overview["missing_values"]
    duplicates = overview["duplicate_rows"]
    memory = overview["memory_mb"]

    numeric_cols = overview["numeric_columns"]
    categorical_cols = overview["categorical_columns"]
    datetime_cols = overview["datetime_columns"]

    # -----------------------------
    # Data Quality Score
    # -----------------------------
    score = 100

    if missing > 0:
        score -= min(20, missing)

    if duplicates > 0:
        score -= min(15, duplicates)

    score = max(score, 0)

    # -----------------------------
    # Executive Summary
    # -----------------------------
    executive_summary = (
        f"This dataset contains {rows:,} records and {cols} attributes. "
        f"The uploaded data passed the initial profiling stage successfully. "
        f"A total of {len(numeric_cols)} numeric, "
        f"{len(categorical_cols)} categorical, and "
        f"{len(datetime_cols)} datetime columns were identified. "
        f"The dataset shows {'excellent' if score >= 90 else 'good'} data quality "
        f"and is suitable for business analytics, dashboard creation, forecasting, "
        f"and machine learning workflows."
    )

    # -----------------------------
    # Key Findings
    # -----------------------------
    key_findings = [
        f"Dataset contains {rows:,} rows and {cols} columns.",
        f"{len(numeric_cols)} numerical columns available for statistical analysis.",
        f"{len(categorical_cols)} categorical columns available for segmentation.",
        f"{len(datetime_cols)} datetime columns detected.",
        f"Missing values detected: {missing}.",
        f"Duplicate records detected: {duplicates}.",
    ]

    # -----------------------------
    # Business Recommendations
    # -----------------------------
    recommendations = [
        "Develop interactive dashboards to monitor key business metrics.",
        "Leverage forecasting models to predict future trends.",
        "Perform feature engineering before machine learning model training.",
        "Continuously monitor data quality before decision making.",
        "Use categorical segmentation to identify customer or regional patterns.",
    ]

    # -----------------------------
    # Readiness Scores
    # -----------------------------
    ml_readiness = (
        "Excellent"
        if missing == 0 and duplicates == 0
        else "Good"
    )

    visualization_readiness = (
        "Excellent"
        if len(numeric_cols) > 0
        else "Moderate"
    )

    analytics_readiness = (
        "Excellent"
        if cols >= 5
        else "Moderate"
    )

    # -----------------------------
    # Report
    # -----------------------------
    report = {
        "title": "InsightForge AI Business Intelligence Report",

        "generated_at": datetime.now().strftime("%d %B %Y %I:%M %p"),

        "dataset_name": "Uploaded Dataset",

        "executive_summary": executive_summary,

        "statistics": {
            "Rows": rows,
            "Columns": cols,
            "Missing Values": missing,
            "Duplicate Rows": duplicates,
            "Memory (MB)": memory,
        },

        "data_quality": {
            "Overall Score": score,
            "Missing Values": missing,
            "Duplicate Rows": duplicates,
            "Quality": "Excellent" if score >= 90 else "Good",
        },

        "column_summary": {
            "Numeric Columns": numeric_cols,
            "Categorical Columns": categorical_cols,
            "Datetime Columns": datetime_cols,
        },

        "key_findings": key_findings,

        "insights": [
            f"The dataset contains {len(numeric_cols)} numerical attributes suitable for descriptive and predictive analytics.",
            f"{len(categorical_cols)} categorical attributes can be used for segmentation and grouping analysis.",
            f"The dataset occupies approximately {memory} MB in memory, making it efficient for interactive analytics.",
            "No critical data quality issues were detected."
            if score >= 90
            else "Minor data quality improvements are recommended before advanced analysis.",
        ],

        "recommendations": recommendations,

        "readiness": {
            "Machine Learning": ml_readiness,
            "Visualization": visualization_readiness,
            "Analytics": analytics_readiness,
        },

        "overall_score": score,
    }

    return report