# Snippets App

A personal code-snippet manager — and my ongoing reference project for full-stack architecture and DevOps practices I use professionally. Unlike my client work, this one isn't scoped by anyone else, so I use it to demonstrate exactly how I structure a real production-style system end to end.

## Why this project exists

Most of my production work lives behind client NDAs. This is the project I extend on my own time to show, concretely, how I'd architect a system rather than just describe it: monorepo structure, containerization, CI/CD, and — as it grows — event-driven microservices.

## Current Architecture

- **Monorepo** — frontend and backend versioned together, shared tooling/config at the root
- **Frontend** — React + TypeScript
- **Backend** — Ruby on Rails API
- **Containerization** — Docker & Docker Compose, so local dev matches how it'd run in production
- **CI/CD** — GitHub Actions: lint, test, and build run on every pull request before merge
- **Testing** — RSpec (backend), Jest (frontend)

## Features

- Save, tag, and organize reusable code snippets
- Syntax highlighting per language
- Search/filter by tag or language
- *(update this list to match exactly what's shipped — happy to tighten it once you confirm the current feature set)*

## Roadmap — Microservices Expansion

This project is actively growing into a small microservices reference architecture:

- **Python AI service** — a separate service for AI-assisted features (e.g. auto-tagging snippets by language/purpose, or semantic search over saved snippets) — the first place I'll apply RAG/embedding work outside client projects
- **Redis** — caching layer for frequent snippet searches and tag lookups, and likely session/rate-limit handling once the AI service is added
- **Kafka** — event bus decoupling the core app from the AI service, e.g. publishing a `snippet.created` event that the Python service consumes to generate tags/embeddings asynchronously, instead of blocking the save request

The goal is a small, concrete example of how a monolith-to-microservices step actually looks in practice — not just tools bolted on for the sake of a skills list.

## Tech Stack

React · TypeScript · Ruby on Rails · Docker · GitHub Actions · RSpec · Jest
*(planned: Python, Redis, Kafka)*

## Getting Started

```bash
git clone https://github.com/khuramdogar/snippets_app.git
cd snippets_app
docker-compose up --build
```

*(adjust commands/ports to match your actual setup)*

## License

MIT
