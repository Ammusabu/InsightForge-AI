from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration.
    Values can be loaded from environment variables.
    """

    app_name: str = "InsightForge AI"
    app_version: str = "0.1.0"
    app_description: str = "AI-Powered Business Intelligence & Analytics Platform"
    environment: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()