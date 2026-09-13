# Laboratorio 1 — GitHub, Docker y API REST

## Integrantes

- Joseph Daniel Rhomandt Bermudez — [Josephqaz](https://github.com/Josephqaz)
- Brayan Yesid Jurado Gutierrez — [BiJ3y](https://github.com/BiJ3y)

## Descripción

API REST sencilla para gestionar notas de trabajo de un equipo (`team-notes-api`).

## Tecnologías

- Bun 1.4.2
- Express 5
- PostgreSQL
- Docker Compose

## Documentación

- [`docs/spec.md`](docs/spec.md) — especificación del laboratorio.
- [`docs/plan.md`](docs/plan.md) — plan de trabajo con puntos de control.

## Ejecución local con Docker

```bash
cp .env.example .env
docker compose up --build
```

API disponible en `http://localhost:$APP_PORT`.
