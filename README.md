AI-First CRM HCP Module

Overview This project is an AI-powered CRM system for logging Healthcare Professional (HCP) interactions using both chat and structured form.

Features

Chat-based interaction logging (AI-powered)
Structured form input
AI extraction of data
AI-generated summary
AI follow-up suggestions
Edit interaction support
SQLite database storage
Tech Stack

Frontend: React + Redux
Backend: FastAPI
AI: LangGraph + Groq (gemma2-9b-it)
Database: SQLite
LangGraph Tools

Extract Tool → Extract structured data
Log Tool → Store interaction
Summary Tool → Generate summary
Suggestion Tool → Generate follow-up
Edit Tool → Modify existing interaction
Flow User → Chat → LangGraph → Tools → DB → UI Update

Run Locally 

Create .env file: GROQ_API_KEY=your_api_key

Backend venv\Scripts\activate 
uvicorn main:app --reload 
pip install -r requirements.txt

Frontend 
npm install 
npm run dev



demo video

https://www.loom.com/share/9e99def014d543bcbd33a0338be24699

