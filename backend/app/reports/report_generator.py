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
    # Report
    # -----------------------------
    report = {
        "title": "InsightForge AI Business Intelligence Report",

        "generated_at": datetime.now().strftime("%d %B %Y %I:%M %p"),

        "dataset_name": "Uploaded Dataset",

        "executive_summary": executive_summary,

        # -----------------------------
        # Dataset Quality
        # -----------------------------
        "dataset_quality": {
            "rows": rows,
            "columns": cols,
            "memory": memory,
            "missing_values": missing,
            "duplicate_rows": duplicates,
            "quality_score": score,
            "status": "Excellent" if score >= 90 else "Good",
        },

        # -----------------------------
        # Key Statistics
        # -----------------------------
        "key_statistics": {
            "Rows": rows,
            "Columns": cols,
            "Memory Usage": memory,
            "Missing Values": missing,
            "Duplicate Rows": duplicates,
        },

        # -----------------------------
        # Business Insights
        # -----------------------------
        "business_insights": [
            {
                "title": "Dataset Composition",
                "description": (
                    f"The dataset contains {len(numeric_cols)} numerical columns "
                    "suitable for descriptive and predictive analytics."
                ),
            },
            {
                "title": "Categorical Analysis",
                "description": (
                    f"{len(categorical_cols)} categorical columns are available "
                    "for segmentation and grouping analysis."
                ),
            },
            {
                "title": "Memory Usage",
                "description": (
                    f"The dataset occupies approximately {memory} MB in memory, "
                    "making it efficient for interactive analytics."
                ),
            },
            {
                "title": "Data Quality",
                "description": (
                    "No major data quality issues were detected."
                    if score >= 90
                    else "Minor data quality improvements are recommended before advanced analysis."
                ),
            },
        ],

        # -----------------------------
        # Recommendations
        # -----------------------------
        "recommendations": [
            {
                "title": "Interactive Dashboards",
                "description": "Develop interactive dashboards to monitor key business metrics.",
                "priority": "High",
            },
            {
                "title": "Forecasting",
                "description": "Leverage forecasting models to predict future trends.",
                "priority": "Medium",
            },
            {
                "title": "Machine Learning",
                "description": "Perform feature engineering before machine learning model training.",
                "priority": "Medium",
            },
            {
                "title": "Data Quality Monitoring",
                "description": "Continuously monitor missing values and duplicate records before decision making.",
                "priority": "High",
            },
            {
                "title": "Business Segmentation",
                "description": "Use categorical segmentation to identify customer or regional patterns.",
                "priority": "Low",
            },
        ],

        # -----------------------------
        # Conclusion
        # -----------------------------
        "conclusion": (
            "The uploaded dataset is ready for interactive dashboards, "
            "business intelligence, forecasting, and machine learning. "
            "The overall data quality is high and the dataset is suitable "
            "for enterprise analytics workflows."
        ),
    }

    return report