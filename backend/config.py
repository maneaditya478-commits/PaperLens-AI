import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseModel):
    APP_NAME: str = "PaperLens AI"
    APP_VERSION: str = "1.0.0"
    TAGLINE: str = "Understand Every Document. Know Your Rights. Make Informed Decisions."
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1")
    
    # Storage & DB
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/paperlens.db")
    UPLOAD_DIR: Path = BASE_DIR / "data" / "uploads"
    SAMPLES_DIR: Path = BASE_DIR / "data" / "samples"
    KNOWLEDGE_BASE_DIR: Path = BASE_DIR / "knowledge_base"
    
    # AI Engine & Demo Mode
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "True").lower() in ("true", "1")
    ENABLE_REAL_AI: bool = os.getenv("ENABLE_REAL_AI", "True").lower() in ("true", "1")
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    
    # API Keys (Optional - never mandatory)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    # File limits
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_EXTENSIONS: list[str] = [".pdf", ".png", ".jpg", ".jpeg", ".docx"]
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
        "*"
    ]

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
