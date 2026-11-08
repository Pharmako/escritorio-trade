import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


class Settings:
    """Configurações centralizadas do microserviço Gerente de IA."""

    # Conexão com o Funcionário (Freqtrade API - padrão na porta 8081 conforme arquitetura)
    FREQTRADE_API_URL: str = os.getenv("FREQTRADE_API_URL", "http://127.0.0.1:8081").rstrip("/")
    FREQTRADE_USERNAME: str = os.getenv("FREQTRADE_USERNAME", "chefe")
    FREQTRADE_PASSWORD: str = os.getenv("FREQTRADE_PASSWORD", "123")

    # Parâmetros de Risco e Castigo
    CASTIGO_DURATION_MINUTES: int = int(os.getenv("CASTIGO_DURATION_MINUTES", "60"))

    # LLM On-Demand (Gemini / OpenAI / Anthropic)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini").lower()
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-flash")

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID: str = os.getenv("TELEGRAM_CHAT_ID", "")

    # Servidor FastAPI
    PORT: int = int(os.getenv("PORT", "8090"))
    SKILL_PATH: Path = BASE_DIR / "SKILL.md"

    def load_skill_guidelines(self) -> str:
        if self.SKILL_PATH.exists():
            return self.SKILL_PATH.read_text(encoding="utf-8")
        return "Você é o Gerente de Risco e Psicologia de Trade supervisionando o Funcionário NFI X8."


settings = Settings()

