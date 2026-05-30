import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.document_loader import load_documents, load_images, format_as_context
from services.gemini_service import GeminiService
from router import api_router

load_dotenv(Path(__file__).parent.parent / ".env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    api_key   = os.getenv("GEMINI_API_KEY", "")
    model     = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    docs_path = os.getenv("DOCS_PATH", "../docs")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY não configurada no .env")

    docs_store = load_documents(docs_path)
    if not docs_store:
        raise RuntimeError(f"Nenhum documento encontrado em: {docs_path}")

    images_store = load_images(docs_path)

    app.state.docs_store   = docs_store
    app.state.images_store = images_store
    app.state.gemini       = GeminiService(
        api_key=api_key,
        docs_context=format_as_context(docs_store),
        model_name=model,
        doc_names=list(docs_store.keys()),
    )

    print(f"[OK] Modelo: {model}")
    yield


app = FastAPI(title="FM2C Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
