import enum

import dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


class EmbeddingSource(str, enum.Enum):
    OPENAI = "openai"
    TRANSFORMER = "transformer"


class _Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    GEMINI_API_KEY: str
    OPENAI_API_KEY: str


dotenv.load_dotenv()
Settings = _Settings()
