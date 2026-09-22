from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from foundry_agent import ask_agent, create_conversation

app = FastAPI()


# Allow React frontend to communuicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None

@app.get("/")
def home():
    return {
        "message": "FastAPI server is running"
    }

@app.post("/chat")
def chat(request: ChatRequest):

    conversation_id = request.conversation_id

    # Create a new conversation if this is the first message
    if conversation_id is None:
        conversation_id = create_conversation()

    answer = ask_agent(
        request.message,
        conversation_id
    )

    return {
        "response": answer,
        "conversation_id": conversation_id
    }