# Three Portfolio Projects for Junior-to-Mid-Level Software Engineering Roles

## Part 1: What the job market is asking for

**Research caveat:** Direct LinkedIn and Wellfound listing pages were not reachable from this session, so this section relies on a few job-board postings and career-blog summaries. Treat it as directional. Before you commit to a project, search those sites yourself for your target city and title and tally the skills you see.

### Sources consulted
- [Junior Software Engineer Job Description: Roles & Responsibilities in 2026](https://interviewkickstart.com/job-description/junior-software-engineer)
- [9 Junior Software Engineer Skills Every Employer Wants in 2026](https://interviewkickstart.com/skills/junior-software-engineer)
- [10 Skills That Actually Make Junior Developers Valuable in 2026 (DEV Community)](https://dev.to/talaamm/10-skills-that-actually-make-junior-developers-valuable-in-2026-45i1)
- [Junior LLM Engineer posting (Qureos)](https://app.qureos.com/jobs/junior-llm-engineer-1774104463237)
- [Strong Junior Applied AI Engineer (LLM/RAG) (Djinni)](https://djinni.co/jobs/840894-strong-junior-applied-ai-engineer-llm-rag/)
- [Junior Software Engineer, AI/LLM Systems (Epiq)](https://www.tryapplynow.com/jobs/epiq-junior-software-engineer-ai-llm-systems-aa44478b-de7c-462c-bf74-0f6e0209e1bd)
- [How to hire RAG engineers in 2026 (KORE1)](https://www.kore1.com/hire-rag-engineers-2026/)
- [InstantDB: Founding TypeScript Engineer](https://www.instantdb.com/hiring/typescript-engineer)

### Skills that recur across these sources

| Skill cluster | What postings ask for | Where it shows up in the projects below |
|---|---|---|
| Core language proficiency | TypeScript/JavaScript or Python, plus one backend language | All three |
| Relational databases | Postgres, schema design, indexes, transactions | All three |
| Git, testing, debugging | Listed as "foundational" by nearly every source | All three |
| Production operations | Deploying apps, debugging production, automation | Projects 2 and 3 |
| LLM APIs, RAG, embeddings, vector search | Junior AI roles ask for these explicitly | Project 1 |
| Real-time systems | Founding and startup roles on TypeScript/Postgres stacks | Project 3 |
| Communication and learning agility | Hiring teams weigh these highly | Write-ups in every repo |

### What this means for portfolio choice
- Sources agree that **debugging, deploying, and automating** matter more than framework knowledge alone. Projects should show a system running, not just a UI.
- AI-era junior roles are asking for **RAG and evaluation**, not just "I called an API." A project that measures answer quality will stand out.
- Startup roles prefer **TypeScript end-to-end with Postgres**, plus at least one real-time or background-job component.

---

## Part 2: Three project ideas

### Project 1: Support Copilot — multi-tenant RAG assistant with citations and an eval harness

**One-sentence description:** A multi-tenant support assistant that answers customer questions from a company's own help docs and past tickets, always cites its sources, and hands off to a human inbox when it isn't confident.

**Real-world use case:** Small SaaS teams (5–50 people) answer the same questions repeatedly and can't afford a dedicated support tier. They upload their docs and Zendesk/Intercom exports, embed the assistant on their site, and review what it got wrong each week.

**Full tech stack**
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui
- **Backend API:** Node.js with Fastify, TypeScript, Zod for validation
- **Database:** PostgreSQL with `pgvector` for embeddings and `tsvector` for full-text search
- **Background jobs:** BullMQ on Redis for ingestion, chunking, and embedding
- **AI:** Anthropic or OpenAI API for generation, an embeddings model for vectors, streaming via server-sent events
- **Realtime:** WebSockets for the live human-handoff inbox
- **Auth and tenancy:** Postgres row-level security keyed on `tenant_id`, JWT sessions
- **Observability:** OpenTelemetry traces, structured logs, a simple cost-per-conversation dashboard
- **Testing and deploy:** Vitest, Playwright for end-to-end, Docker Compose locally, deploy to Render or Fly.io

**Advanced features that show technical depth**
1. **Hybrid retrieval:** Combine vector similarity and BM25-style full-text search, then merge the rankings with reciprocal rank fusion. Make the weighting configurable and show the effect in a comparison table.
2. **Citation-grounded answers:** Require each claim to reference a chunk ID. Reject and retry any answer that cites nothing or cites a chunk it wasn't given.
3. **Eval harness:** Keep a golden set of 100+ question/answer pairs per tenant. Run it in CI on every prompt or retrieval change, scoring retrieval recall@k, groundedness (LLM-as-judge with a rubric), and refusal accuracy. Fail the build on regression.
4. **Confidence-based handoff:** When retrieval scores fall below a threshold, route the conversation to a WebSocket-powered human inbox with the transcript and the retrieved context attached.
5. **Incremental re-indexing:** Hash each document section, so only changed sections are re-embedded. Show the cost saving in the README.
6. **Tenant isolation test suite:** Automated tests that prove tenant A can never retrieve tenant B's chunks, even with a crafted query.

**Resume pitch**
> *Built a multi-tenant RAG support assistant (Next.js, Fastify, Postgres + pgvector, BullMQ) with hybrid retrieval, citation-enforced answers, and a CI-gated eval harness scoring groundedness and recall. Reduced [X]% of simulated tier-1 tickets in testing; tenant isolation enforced at the database layer via row-level security.*

Fill the bracketed number with a real measurement from your own eval run. Don't publish a figure you didn't produce.

---

### Project 2: Receipt-to-Ledger — document extraction and reconciliation pipeline for freelancers and small agencies

**One-sentence description:** An automated pipeline that takes receipt photos and bank statement CSVs, extracts and categorizes every line item, matches receipts to bank transactions, and flags the leftovers for a human to review before tax season.

**Real-world use case:** Freelancers and two-to-ten-person agencies spend days each quarter matching receipts to bank lines for their accountant. Most of the time goes into the mismatches. This tool does the matching and surfaces only the exceptions.

**Full tech stack**
- **Frontend:** React with TypeScript (Vite), TanStack Query, Recharts for spend dashboards, a review queue UI
- **Backend API:** Python with FastAPI and Pydantic for typed request and response models
- **Database:** PostgreSQL with SQLAlchemy and Alembic migrations
- **Workflow engine:** Celery with Redis as the broker, or Temporal if you want durable multi-step workflows with retries
- **Document processing:** OCR (Tesseract locally, or a cloud vision API), an LLM for structured field extraction with a JSON schema, `rapidfuzz` for fuzzy matching, pandas for CSV normalization
- **Storage:** S3-compatible bucket (MinIO locally) for uploaded files
- **Testing and deploy:** pytest with fixture receipts, Docker Compose, deploy to Railway or Render

**Advanced features that show technical depth**
1. **Multi-step workflow with explicit states:** Each upload moves through `received → ocr_done → extracted → matched → needs_review → approved`. Store state transitions in an audit table so every decision is traceable.
2. **Probabilistic matching:** Score candidate receipt-to-transaction pairs on amount, date window, and merchant-name similarity. Auto-approve above a threshold, and send the rest to review. Make the thresholds configurable per client.
3. **Schema-constrained LLM extraction with validation:** Enforce a JSON schema on extracted fields (vendor, date, currency, tax, total). Re-prompt on schema failure, and compute a cross-check: do the line items sum to the total?
4. **Currency and date edge cases:** Handle multi-currency receipts, timezone-shifted bank dates, and refunds as negative matches. Write unit tests for each.
5. **Spend dashboard:** Category breakdowns over time, monthly trend lines, and a "what's unreconciled" card that links back to the review queue.
6. **Idempotent ingestion:** Re-uploading the same CSV or receipt never creates duplicate rows. Prove it with a test.

**Resume pitch**
> *Designed a document-processing pipeline (FastAPI, Celery, PostgreSQL, OCR + schema-validated LLM extraction) that matches receipts to bank transactions using probabilistic scoring and routes exceptions to a human review queue with a full audit trail. Auto-matched [X]% of lines on a test set of [N] transactions; idempotent ingestion verified by automated tests.*

---

### Project 3: Crew Dispatch — real-time field-service scheduler with conflict-free booking and live technician tracking

**One-sentence description:** A dispatch board where office staff assign jobs to field technicians, technicians see updates on their phones in real time, and the system prevents double-booking even when two people edit the schedule at once.

**Real-world use case:** Small HVAC, plumbing, cleaning, and pest-control companies run their schedules on whiteboards, spreadsheets, and group texts. Double-bookings and missed reschedules cost them jobs. This replaces that with one live board that works on a phone in the truck.

**Full tech stack**
- **Frontend:** React with TypeScript, a PWA for technicians (installable, works with spotty signal), a Map view with Leaflet or MapLibre
- **Backend API:** Node.js with NestJS or Fastify, TypeScript end-to-end, shared types in a monorepo
- **Database:** PostgreSQL with PostGIS for locations, time-range exclusion constraints to prevent overlaps
- **Realtime:** WebSockets (Socket.IO or raw `ws`), Redis pub/sub to fan out events across server instances
- **Routing:** OSRM (open-source) or a routing API for drive-time estimates
- **Auth:** Role-based access (dispatcher, technician, admin)
- **Testing and deploy:** Vitest, Playwright for the dispatch board, load test with k6, Docker Compose, deploy to Fly.io or Render

**Advanced features that show technical depth**
1. **Conflict-free scheduling:** Enforce no overlapping jobs for a technician with a Postgres exclusion constraint on a `tstzrange`, so the database rejects conflicts even if the app has a bug.
2. **Optimistic concurrency with conflict resolution:** Each job carries a version number. If two dispatchers edit the same job, the second save gets a conflict response that shows both versions and lets the user pick.
3. **Live state sync:** Broadcast job changes over WebSockets, with Redis pub/sub so it works across multiple server instances. On reconnect, the client replays missed events from a sequence number, so no update is lost.
4. **Offline-first technician app:** The PWA queues status updates (started, completed, parts used) in IndexedDB and syncs them when the connection returns. Show the sync queue in the UI.
5. **Drive-time-aware suggestions:** Rank available technicians for a new job by estimated drive time from their last known location, using PostGIS for distance pre-filtering and a routing call for the top candidates.
6. **Load test:** Use k6 to simulate 50 dispatchers and 200 technicians updating concurrently, and publish the latency numbers and the bottleneck you found.

**Resume pitch**
> *Built a real-time field-service dispatch platform (React PWA, NestJS, PostgreSQL + PostGIS, WebSockets, Redis pub/sub) with database-enforced conflict-free scheduling, optimistic concurrency with conflict resolution, and offline-first technician updates. Load-tested at [N] concurrent users with p95 update latency of [X] ms.*

---

## Part 3: Choosing between them

| | Support Copilot | Receipt-to-Ledger | Crew Dispatch |
|---|---|---|---|
| Primary language | TypeScript | Python (+ TS frontend) | TypeScript |
| Hardest technical problem | Retrieval quality and evals | Matching and extraction accuracy | Real-time consistency under concurrent edits |
| Best fits roles | AI product, applied AI, full-stack | Backend, data/automation, fintech | Startup full-stack, realtime, product engineering |
| Time to a demo-able MVP | 4–6 weeks | 3–5 weeks | 6–8 weeks |

**Recommendation:** If you are targeting AI-adjacent junior roles, build **Project 1** first. If you want backend or data roles, build **Project 2**. If you are aiming at startup full-stack roles, build **Project 3**. Two projects in different categories cover more of the market than three of the same kind.

**Before you build any of these:**
- Talk to two or three people who would actually use it (a freelancer, a small-company owner, a support lead). A short list of their real problems will make your README and demo far stronger than any feature list.
- Measure something real and report it honestly: eval scores, match rates, latency. Recruiters and interviewers ask follow-up questions about numbers, and invented figures will not survive them.
