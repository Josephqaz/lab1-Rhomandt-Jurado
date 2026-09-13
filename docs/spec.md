# Laboratorio 1 – IS1: Especificación

> Extraído de `Laboratorio 1 – IS1.pdf`. Fuente de verdad del taller.

**Curso:** Ingeniería de Software I
**Título:** Flujo colaborativo con GitHub y Docker para implementar una API REST
**Fecha de entrega:** miércoles 16 de septiembre de 2026
**Docente:** Juan Pablo Bustamante Moreno
**Institución:** Escuela Tecnológica Instituto Técnico Central (ETITC)

## Contexto

Taller en parejas. Construir API REST sencilla (GET/POST/PUT/DELETE) conectada
a base de datos vía Docker. Énfasis en flujo colaborativo: GitHub, ramas, Pull
Requests, revisión entre pares, resolución de conflictos, ejecución
reproducible con Docker. Complejidad funcional baja a propósito.

## Objetivos

- Trabajar colaborativamente sobre repositorio GitHub.
- Crear ramas de funcionalidad y Pull Requests.
- Realizar revisiones cruzadas de cambios.
- Generar y resolver un conflicto obligatorio de Git.
- Construir API REST mínima con GET, POST, PUT, DELETE.
- Conectar la aplicación a una base de datos.
- Ejecutar API y base de datos mediante Docker Compose.
- Usar variables de entorno para configurar la conexión.
- Mantener datos con volumen Docker.
- Registrar proceso técnico, decisiones y evidencias en PDF.

## Integrantes y roles

| Rol | Nombre completo | Usuario GitHub |
|---|---|---|
| Estudiante A (responsable inicial repo) | Joseph Daniel Rhomandt Bermudez | Josephqaz |
| Estudiante B (responsable resolver conflicto) | Brayan Yesid Jurado Gutierrez | BiJ3y |

## Caso: `team-notes-api`

Entidad `notes` — anotación corta de un integrante del equipo.

| Campo | Tipo sugerido | Descripción |
|---|---|---|
| id | Entero/autogenerado | Identificador único |
| title | Texto corto | Título de la nota |
| content | Texto | Contenido de la nota |
| author | Texto corto | Autor de la nota |
| created_at | Fecha y hora | Fecha de creación |

## Endpoints requeridos

| Operación | Método | Ruta | Descripción |
|---|---|---|---|
| Estado del servicio | GET | `/health` | Informa que la API está activa |
| Listar notas | GET | `/notes` | Devuelve todas las notas |
| Consultar nota | GET | `/notes/{id}` | Devuelve una nota por id |
| Crear nota | POST | `/notes` | Registra una nueva nota |
| Actualizar nota | PUT | `/notes/{id}` | Actualiza una nota existente |
| Eliminar nota | DELETE | `/notes/{id}` | Elimina una nota existente |

Respuestas en JSON.

### Validaciones mínimas

- `title`, `content`, `author` obligatorios, no vacíos.
- `id` generado por BD o por app de forma consistente.
- `created_at` se registra al crear.
- Nota inexistente → 404.
- Datos inválidos al crear/actualizar → 400.
- Errores claros, sin exponer datos internos.

### Códigos HTTP esperados

| Situación | Código |
|---|---|
| Consulta exitosa | 200 OK |
| Creación exitosa | 201 Created |
| Actualización exitosa | 200 OK |
| Eliminación exitosa | 200 OK ó 204 No Content |
| Datos inválidos | 400 Bad Request |
| Nota inexistente | 404 Not Found |
| Error interno | 500 Internal Server Error |

## Arquitectura mínima

```
Cliente HTTP (curl/Postman) → API REST (Bun + Express) → PostgreSQL
```

Dos servicios en Docker Compose: `api` y `db`. API se conecta a BD vía
variables de entorno.

**Stack elegido:** Bun + Express + PostgreSQL.

## Flujo de trabajo (resumen paso a paso)

1. **Definir tecnología** — Bun + Express + PostgreSQL (decidido).
2. **Crear repositorio GitHub** (Estudiante A):
   - Repo público `lab1-Rhomandt-Jurado`.
   - Agregar Estudiante B como colaborador.
   - Ramas `main` y `develop`.
   - Proteger `main`: requiere PR, sin push directo.
   - README con integrantes, descripción, tecnologías.
   - `.gitignore`, `.dockerignore`, `.env.example`.
   - Verificar `.env` en `.gitignore`.
   - Subir estructura inicial a `main`; crear `develop` desde `main`.
3. **Configuración de entorno** — `.env.example` con `APP_ENV`, `APP_PORT`,
   `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Cada integrante
   crea su `.env` local cambiando al menos una variable.
4. **Dockerfile + `compose.yaml`** — imagen oficial, workdir, deps antes de
   código, exponer puerto. Compose define `api`, `db`, `.env`, mapeo puerto,
   variables BD, volumen persistente, `depends_on`.
5. **Base de datos** — tabla `notes` (id PK autogenerado, title/content/author
   obligatorios, created_at obligatorio). Estrategia de creación (script SQL,
   migración, ORM) documentada en el PDF de entrega.
6. **Implementar API por ramas** — prohibido implementar directo en `main`/`develop`.
   - **Estudiante A** — rama `feature/read-notes`: `GET /health`, `GET /notes`,
     `GET /notes/{id}`. ≥2 commits descriptivos en inglés → push → PR a
     `develop` → revisión de B → corrección → merge.
   - **Estudiante B** — rama `feature/write-notes`: `POST /notes`,
     `PUT /notes/{id}`, `DELETE /notes/{id}`. Mismo flujo, revisión de A.
7. **Conflicto de merge obligatorio** (si no surge orgánicamente):
   - A: `feature/conflict-student-a`, B: `feature/conflict-student-b`.
   - Ambos editan misma sección (ej. README.md), commit+push, PR a `develop`.
   - Merge primero PR de A, luego intentar merge PR de B → GitHub detecta conflicto.
8. **Resolver conflicto** (Estudiante B): actualizar rama con `develop`,
   identificar marcas de conflicto, editar conservando cambios de ambas
   versiones, eliminar marcas, commit `fix: solved conflict on README.md`,
   push, verificar mergeable, merge a `develop`.

## Pruebas e integración final

Probar cada endpoint (Postman/Insomnia/Thunder Client/curl):

| Prueba | Resultado esperado |
|---|---|
| GET /health | Estado de API activo |
| GET /notes sin registros | Lista vacía |
| POST /notes válido | 201 y nota creada |
| POST /notes inválido | 400 |
| GET /notes/{id} existente | 200 y nota encontrada |
| GET /notes/{id} inexistente | 404 |
| PUT /notes/{id} válido | 200 y nota actualizada |
| PUT /notes/{id} inexistente | 404, o 201 si se decide insertar |
| DELETE /notes/{id} existente | 200 ó 204 |
| DELETE /notes/{id} inexistente | 404 |

**Prueba de persistencia:** crear nota → `docker compose down` (sin `-v`) →
`docker compose up` → consultar notas → verificar que persiste.

Al confirmar todo correcto: PR `develop` → `main`, luego tag:

```bash
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Laboratorio 1 finalizado"
git push origin v1.0.0
```

## Entrega

Documento por pareja (PDF) con: capturas de pantalla, resultados de pruebas,
dificultades, aprendizajes individuales, link al repositorio GitHub. Enviar a
carpeta OneDrive del equipo o a `jpbustamantem@itc.edu.co`.

## Criterios de evaluación

| Criterio | Evidencia esperada | Peso |
|---|---|---|
| Trabajo colaborativo con GitHub | Commits de ambos, ramas, PRs, revisión cruzada | 25% |
| Conflicto e integración | Conflicto obligatorio, solución correcta, evidencia completa | 15% |
| API y operaciones CRUD | Endpoints funcionales, validaciones, respuestas HTTP adecuadas | 25% |
| Uso de Docker | API y BD en contenedores, variables de entorno, volumen persistente | 20% |
| Evidencias de desarrollo en el documento | Capturas, explicaciones, contribuciones, aprendizajes | 15% |
