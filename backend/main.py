from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agent import app as agent_app
from database import SessionLocal
from model import Interaction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str

class UpdateRequest(BaseModel):
    data: dict

# -------------------
# CHAT API (LangGraph)
# -------------------
@app.post("/chat")
def chat(req: ChatRequest):
    result = agent_app.invoke({
        "message": req.message
    })

    return {
        "structured_data": result.get("structured_data", {}),
        "summary": result.get("summary", {}),
        "suggestion": result.get("suggestion", {})
    }

# -------------------
# DASHBOARD API
# -------------------
@app.get("/dashboard")
def dashboard():
    db = SessionLocal()
    data = db.query(Interaction).all()
    db.close()

    return {
        "total": len(data),
        "positive": len([x for x in data if "positive" in (x.sentiment or "").lower()]),
        "neutral":  len([x for x in data if "neutral"  in (x.sentiment or "").lower()]),
        "negative": len([x for x in data if "negative" in (x.sentiment or "").lower()]),
    }

# -------------------
# UPDATE INTERACTION
# -------------------
@app.put("/interaction/{id}")
def update_interaction(id: int, req: UpdateRequest):
    db = SessionLocal()

    record = db.query(Interaction).filter(Interaction.id == id).first()

    if not record:
        db.close()
        raise HTTPException(status_code=404, detail="Interaction not found")

    for key, value in req.data.items():  # ✅ was `data.items()`, must be `req.data.items()`
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    db.close()

    return {"status": "updated", "data": req.data}  # ✅ was `data`, must be `req.data`

# -------------------
# GET ALL INTERACTIONS
# -------------------
@app.get("/interactions")
def get_interactions():
    db = SessionLocal()
    data = db.query(Interaction).all()
    db.close()

    return data