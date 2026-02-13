from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str

class SummaryRequest(BaseModel):
    style: str | None = None

class VideoRequest(BaseModel):
    url: str
