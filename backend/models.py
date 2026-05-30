from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class TraceStep(BaseModel):
    id: str
    icon: str
    label: str
    detail: str | None = None
    duration_ms: float | None = None
    status: str = "done"


class ImageRef(BaseModel):
    doc: str
    idx: int


class AgentSettings(BaseModel):
    tone: str = "neutral"
    responseStyle: str = "balanced"
    useEmojis: bool = False
    endWithHelp: bool = False
    useNumberedSteps: bool = True
    highlightKeyTerms: bool = True


class ChatRequest(BaseModel):
    question: str
    history: list[Message] = []
    settings: AgentSettings = AgentSettings()


class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = []
    trace: list[TraceStep] = []
    images: list[ImageRef] = []
