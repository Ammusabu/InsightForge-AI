from fastapi import APIRouter, HTTPException

from app.analytics.analytics_engine import (
    load_dataset,
    dataset_overview,
)
from app.common.dataset_reader import get_dataset
from app.core.responses import success_response
from app.analytics.chart_engine import (
    generate_line_chart,
    generate_bar_chart,
)
from app.analytics.insight_engine import generate_insights

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)

from app.analytics.correlation_engine import generate_correlation


@router.get("/{dataset_id}/overview")
def analytics_overview(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(
        dataset["filename"]
    )

    overview = dataset_overview(dataframe)

    return success_response(
        message="Analytics overview generated successfully.",
        data=overview,
    )


@router.get("/{dataset_id}/line-chart")
def line_chart(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(dataset["filename"])

    return success_response(
        message="Line chart generated.",
        data=generate_line_chart(dataframe),
    )


@router.get("/{dataset_id}/bar-chart")
def bar_chart(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(dataset["filename"])

    return success_response(
        message="Bar chart generated.",
        data=generate_bar_chart(dataframe),
    )

@router.get("/{dataset_id}/insights")
def dataset_insights(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(
        dataset["filename"]
    )

    return success_response(
        message="Insights generated.",
        data=generate_insights(dataframe),
    )

@router.get("/{dataset_id}/correlation")
def correlation(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(dataset["filename"])

    return success_response(
        message="Correlation generated successfully.",
        data=generate_correlation(dataframe),
    )