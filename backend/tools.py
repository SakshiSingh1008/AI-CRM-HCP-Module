import os
import json
from dotenv import load_dotenv
from groq import Groq
from database import SessionLocal
from model import Interaction

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# -------------------
# EXTRACT TOOL (FIXED)
# -------------------
def extract_tool(message: str):
    prompt = f"""
You are a medical CRM extraction system for a pharmaceutical sales rep.

Extract ALL fields from the interaction note below.
Use smart inference for missing fields — do NOT leave fields blank if you can reasonably infer them.

Rules:
- doctor_name: Extract full name. If only title given (e.g. "the doctor"), use "Unknown Doctor"
- date: Use YYYY-MM-DD format. If missing, use today: 2026-04-16
- time: Use HH:MM format. If missing, use "00:00"
- interaction_type: One of: Meeting / Call / Visit / Email. Infer from context.
- attendees: Who was present. If only doctor mentioned, use doctor name. If unknown use "Sales Rep"
- topics_discussed: Summarize what was discussed. Never leave blank.
- outcome: Result of the meeting (e.g. "Positive response", "Needs follow-up"). Infer from sentiment/context.
- sentiment: One of: Positive / Neutral / Negative. Infer from tone and outcome.
- follow_up: Next action step. Infer from context (e.g. "Follow-up in 10 days")

Return ONLY a valid JSON object with exactly these 9 keys. No explanation, no markdown.

Interaction note:
{message}
"""

    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a JSON extraction engine. Return ONLY valid JSON. No markdown, no explanation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        content = res.choices[0].message.content.strip()

        # Strip markdown code fences if LLM adds them anyway
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        return json.loads(content)

    except Exception as e:
        print("❌ Extract error:", e)
        return {
            "doctor_name": "Unknown Doctor",
            "date": "2026-04-16",
            "interaction_type": "Meeting",
            "time": "00:00",
            "attendees": "Sales Rep",
            "topics_discussed": message,
            "outcome": "Pending review",
            "sentiment": "Neutral",
            "follow_up": "Follow up in 7 days"
        }


# -------------------
# LOG TOOL (FIXED SAFE DB)
# -------------------
def log_tool(data):
    db = SessionLocal()
    try:
        record = Interaction(**data)
        db.add(record)
        db.commit()
        print("✅ SAVED TO DB:", data)
        return {"status": "saved"}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()


# -------------------
# EDIT TOOL
# -------------------
def edit_tool(interaction_id: int, updated_data: dict):
    db = SessionLocal()
    try:
        record = db.query(Interaction).filter(Interaction.id == interaction_id).first()

        if not record:
            return {"error": "not found"}

        for k, v in updated_data.items():
            setattr(record, k, v)

        db.commit()
        return {"status": "updated"}

    finally:
        db.close()


# -------------------
# SUMMARY TOOL (IMPROVED)
# -------------------
def summary_tool(data):
    return {
        "text": f"Interaction with {data.get('doctor_name','')} "
                f"about {data.get('topics_discussed','')}. "
                f"Outcome: {data.get('outcome','')}."
    }


# -------------------
# SUGGESTION TOOL
# -------------------
def suggestion_tool(data):
    outcome = (data.get("outcome") or "").lower()

    if "positive" in outcome:
        return {"text": "Schedule follow-up and share medical brochure"}
    elif "negative" in outcome:
        return {"text": "Re-engage patient with alternative approach"}
    else:
        return {"text": "Follow up in 7 days"}