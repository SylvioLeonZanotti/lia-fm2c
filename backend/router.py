from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import Response

from models import ChatRequest, ChatResponse, ImageRef

api_router = APIRouter()


def _detect_mime_type(image_bytes: bytes) -> str:
    if image_bytes[:2] == b"\xff\xd8":
        return "image/jpeg"
    if image_bytes[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if image_bytes[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    return "image/png"


@api_router.get("/health")
def health_check():
    return {"status": "ok"}


@api_router.get("/document")
def get_document(request: Request, name: str = Query(...)):
    docs_store: dict = request.app.state.docs_store
    if name not in docs_store:
        raise HTTPException(status_code=404, detail=f"Documento '{name}' não encontrado")
    return {"name": name, "content": docs_store[name]}


@api_router.get("/image")
def get_document_image(request: Request, doc: str = Query(...), idx: int = Query(0)):
    images_store: dict = request.app.state.images_store
    if doc not in images_store or idx >= len(images_store[doc]):
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    image_bytes = images_store[doc][idx]
    return Response(content=image_bytes, media_type=_detect_mime_type(image_bytes))


@api_router.post("/chat", response_model=ChatResponse)
def send_message(request: Request, req: ChatRequest):
    agent = request.app.state.gemini
    if agent is None:
        raise HTTPException(status_code=503, detail="Serviço não inicializado")

    try:
        result = agent.generate_response(
            question=req.question,
            history=[m.model_dump() for m in req.history],
            settings=req.settings.model_dump(),
        )
        sources: list[str] = result.get("sources", [])
        images_store: dict = request.app.state.images_store
        images: list[ImageRef] = [
            ImageRef(doc=src, idx=i)
            for src in sources
            if src in images_store
            for i in range(len(images_store[src]))
        ]
        return ChatResponse(
            answer=result["answer"],
            sources=sources,
            trace=result.get("trace", []),
            images=images,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
