# ai-service

Python/FastAPI microservice for `snippets_app`. Sits alongside `backend/` (RoR) and
`frontend/` (Next.js) as an independent service — see the monorepo README for how it
plugs into Kafka/Redis at the infra level.

## Modules (interview-prep roadmap)

| Route | Status | Covers |
|---|---|---|
| `POST /agents/social-support` | ✅ working | AI Agents (module 3) |
| `POST /rag/query` | 🚧 stub, TODO | RAG + Vector DBs (module 4) |
| `POST /scoring/interview` | 🚧 stub, TODO | AI Scoring Pipelines (module 6) |
| `POST /recommend/products` | 🚧 stub, TODO | Recommendation engine (module 7) |

Each stub route has a docstring with the implementation steps — build them out one at
a time as you work through the roadmap. Don't skip ahead; each one is meant to be a
standalone interview story.

## Run locally

```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and add your real OPENAI_API_KEY

uvicorn app.main:app --reload
```

Visit `http://localhost:8000/docs` for the auto-generated Swagger UI — this is FastAPI's
built-in interactive API explorer, useful for testing endpoints without Postman.

## Try the working endpoint

```bash
curl -X POST http://localhost:8000/agents/social-support \
  -H "Content-Type: application/json" \
  -d '{"message": "What time does the event start on Saturday?", "session_id": "test-1"}'
```

Send a second message with the same `session_id` and the agent will remember the
conversation (in-memory for now — swap for Redis once you build that out).

## Run with Docker

```bash
docker build -t ai-service .
docker run -p 8000:8000 --env-file .env ai-service
```

Or via the shared `infra/docker-compose.yml` once you set that up (see monorepo README) —
that will also start Redis/Kafka alongside this service.

## Run tests

```bash
pytest
```

## Next steps

1. Get `/agents/social-support` running and comfortable — it's already real
2. Build out `/rag/query` (module 4) — add `chromadb` to requirements.txt, uncomment it
3. Build out `/scoring/interview` (module 6)
4. Build out `/recommend/products` (module 7)
5. Only then: add Redis caching to the OpenAI calls, then Kafka consumers/producers

See `app/services/redis_cache.py` for the caching pattern — it's already scaffolded,
just not wired into any route yet.
