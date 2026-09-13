# Laboratorio 1 – Plan de Trabajo

> **Spec:** [`docs/spec.md`](./spec.md) — este plan desarrolla ese documento.

**Meta:** Entregar `team-notes-api` (Bun + Express + PostgreSQL) funcionando
en Docker Compose, con flujo GitHub completo (ramas, PRs, revisión cruzada,
conflicto resuelto) y documento de evidencias.

**Stack:** Bun 1.4.2, Express, PostgreSQL, Docker Compose.

**Roles:**
- **Estudiante A** — Joseph Daniel Rhomandt Bermudez (`Josephqaz`) — responsable inicial del repo, lectura de notas.
- **Estudiante B** — Brayan Yesid Jurado Gutierrez (`BiJ3y`) — escritura de notas, resolución de conflicto.

---

## Checkpoint 0 — Andamiaje del proyecto (A)

- [x] Extraer especificación del PDF a `docs/spec.md`.
- [x] Escribir este plan (`docs/plan.md`).
- [x] `bun init` para scaffolding (package.json, tsconfig, src/index.ts).
- [x] Instalar `express`, `pg`, `dotenv`; dev deps `@types/express`, `@types/pg`.
- [ ] Crear repo GitHub público `lab1-Rhomandt-Jurado`, agregar `BiJ3y` colaborador.
- [ ] Ramas `main` + `develop`, protección en `main` (requiere PR, sin push directo).
- [x] `README.md`, `.gitignore`, `.dockerignore`, `.env.example`.
- [ ] Commit inicial y push a `main`; crear `develop` desde `main`.

**Verificación:** `git log --oneline`, repo visible en GitHub, `develop` existe, `main` protegida.

---

## Checkpoint 1 — Configuración de entorno (A + B, individual)

- [ ] Cada integrante copia `.env.example` → `.env`.
- [ ] Cada integrante cambia al menos una variable localmente (ej. `DB_PASSWORD`).
- [ ] Confirmar `.env` ignorado por git (`git check-ignore .env`).

**Verificación:** `git status` no muestra `.env`.

---

## Checkpoint 2 — Dockerfile + Docker Compose (A)

- [x] `Dockerfile`: imagen oficial `oven/bun`, workdir, copiar `package.json`/`bun.lock` antes del código, `bun install`, copiar código, exponer puerto, `CMD bun start`.
- [x] `compose.yaml`: servicio `api` (build, env_file, ports, depends_on db), servicio `db` (postgres, environment, volume), volumen nombrado.
- [x] `docker compose up --build` levanta ambos servicios sin error.

**Verificación:** `docker compose ps` muestra `api` y `db` en estado `running`. Confirmado — tabla `notes` creada correctamente vía `db/init.sql`.

---

## Checkpoint 3 — Esquema de base de datos (A)

- [x] Script SQL de inicialización (`db/init.sql`, montado en `docker-entrypoint-initdb.d`): tabla `notes` con id PK autogenerado, title/content/author NOT NULL, created_at NOT NULL.
- [x] Estrategia elegida: script SQL de inicialización vía `docker-entrypoint-initdb.d`.
- [ ] Verificar tabla creada al levantar `db` (`docker compose exec db psql -U $DB_USER -d $DB_NAME -c '\d notes'`).

**Verificación:** tabla `notes` visible con columnas correctas.

---

## Checkpoint 4 — Rama `feature/read-notes` (Estudiante A)

- [ ] Crear rama desde `develop`: `git checkout -b feature/read-notes`.
- [ ] Implementar `GET /health` → `{ "status": "ok", "environment": "..." }`.
- [ ] Implementar `GET /notes` → lista JSON (vacía si no hay notas).
- [ ] Implementar `GET /notes/{id}` → 200 + nota, o 404 si no existe.
- [ ] ≥2 commits descriptivos en inglés (ej. `feat: add GET /health endpoint`).
- [ ] Push: `git push -u origin feature/read-notes`.
- [ ] Abrir PR hacia `develop`, pedir revisión a B.
- [ ] Atender comentario de revisión (corregir o justificar).
- [ ] Fusionar PR a `develop`.

**Verificación:** `curl` a los 3 endpoints en `develop` responde según spec.

---

## Checkpoint 5 — Rama `feature/write-notes` (Estudiante B)

- [ ] Crear rama desde `develop`: `git checkout -b feature/write-notes`.
- [ ] Implementar `POST /notes` → valida obligatorios, genera `id`+`created_at`, guarda en BD, 201; 400 si inválido.
- [ ] Implementar `PUT /notes/{id}` → actualiza si existe (200) o define comportamiento si no existe (404 o upsert 201, documentar elección).
- [ ] Implementar `DELETE /notes/{id}` → elimina si existe (200/204), 404 si no existe.
- [ ] ≥2 commits descriptivos en inglés.
- [ ] Push: `git push -u origin feature/write-notes`.
- [ ] Abrir PR hacia `develop`, pedir revisión a A.
- [ ] Atender comentario de revisión.
- [ ] Fusionar PR a `develop`.

**Verificación:** `curl` POST/PUT/DELETE en `develop` responde según spec.

---

## Checkpoint 6 — Conflicto de merge obligatorio (A + B)

- [ ] Si ya surgió conflicto orgánico en checkpoints 4-5, documentarlo y saltar a Checkpoint 7.
- [ ] Si no: A crea `feature/conflict-student-a`, B crea `feature/conflict-student-b`.
- [ ] Ambos editan la misma sección de `README.md` con contenido distinto.
- [ ] Cada uno hace commit + push de su rama.
- [ ] Ambos abren PR hacia `develop`.
- [ ] Fusionar primero el PR de A.
- [ ] Intentar fusionar el PR de B → GitHub debe marcar conflicto.

**Verificación:** GitHub muestra "This branch has conflicts that must be resolved" en el PR de B.

---

## Checkpoint 7 — Resolución del conflicto (Estudiante B)

- [ ] Actualizar rama con `develop` (`git fetch origin && git merge origin/develop`, o resolver el conflicto directo en el PR).
- [ ] Identificar marcas `<<<<<<<`, `=======`, `>>>>>>>`.
- [ ] Editar conservando contenido válido de ambas versiones.
- [ ] Eliminar marcas de conflicto.
- [ ] Commit: `fix: solved conflict on README.md`.
- [ ] Push de la rama actualizada.
- [ ] Verificar que el PR ya es mergeable.
- [ ] Fusionar hacia `develop`.

**Verificación:** PR de B se fusiona sin conflictos pendientes.

---

## Checkpoint 8 — Pruebas e integración final (A + B)

- [ ] Probar los 10 escenarios de la tabla de pruebas (`docs/spec.md`) con curl/Postman.
- [ ] Prueba de persistencia: crear nota → `docker compose down` (sin `-v`) → `docker compose up` → confirmar que la nota sigue.
- [ ] Documentar resultados de pruebas (para el PDF de entrega).
- [ ] Abrir PR `develop` → `main`.
- [ ] Fusionar PR a `main`.
- [ ] Tag de versión:
  ```bash
  git checkout main
  git pull origin main
  git tag -a v1.0.0 -m "Laboratorio 1 finalizado"
  git push origin v1.0.0
  ```

**Verificación:** tag `v1.0.0` visible en GitHub, todos los tests de la tabla pasan.

---

## Checkpoint 9 — Documento de entrega (A + B)

- [ ] Documento PDF con: capturas de pantalla, resultados de pruebas, dificultades, aprendizajes individuales, link al repo.
- [ ] Subir a OneDrive del equipo o enviar a `jpbustamantem@itc.edu.co`.

**Verificación:** documento listo antes de 2026-09-16.

---

## Autorreview de cobertura

Cada sección de `docs/spec.md` mapea a un checkpoint:
Objetivos → 0-8 combinados · Endpoints/validaciones → 4-5 · Arquitectura/Docker → 2 ·
BD → 3 · Flujo de ramas/PR/revisión → 4-5 · Conflicto → 6-7 · Pruebas/persistencia → 8 ·
Entrega/criterios → 9. Sin huecos identificados.
