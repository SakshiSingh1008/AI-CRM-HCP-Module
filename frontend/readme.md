AI-First CRM HCP Module

 Overview
This project is an AI-powered CRM system for logging Healthcare Professional (HCP) interactions using both chat and structured form.

 Features
1) Chat-based interaction logging (AI-powered)
2) Structured form input
3) AI extraction of data
4) AI-generated summary
5) AI follow-up suggestions
6) Edit interaction support
7) SQLite database storage

Tech Stack
1) Frontend: React + Redux
2) Backend: FastAPI
3) AI: LangGraph + Groq (gemma2-9b-it)
4) Database: SQLite

 LangGraph Tools
1. Extract Tool → Extract structured data
2. Log Tool → Store interaction
3. Summary Tool → Generate summary
4. Suggestion Tool → Generate follow-up
5. Edit Tool → Modify existing interaction

 Flow
User → Chat → LangGraph → Tools → DB → UI Update

 Run Locally
Create .env file:
GROQ_API_KEY=your_api_key


 Backend
 venv\Scripts\activate
 uvicorn main:app --reload
 pip install -r requirements.txt

 Frontend
 npm install
npm run dev

https://canva.link/ccr5ffuy64yw8nk-QMS Task 2 canva link

demo video https://www.loom.com/share/9e99def014d543bcbd33a0338be24699
demo video task 2 https://www.loom.com/share/6616a6e4edc04af597c9698954275a31
