# Portfolio Website - Backend

[![CI](https://github.com/Kotyarya/Portfolio-Server/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Kotyarya/Portfolio-Server/actions/workflows/ci.yml)
[![Render](https://img.shields.io/badge/Render-live-46E3B7)](https://portfolio-server-0e3k.onrender.com)

NestJS API behind [aksamitny.com](https://aksamitny.com). It provides portfolio content, project filters, skill data, media responses and the contact email flow used by the Next.js frontend.

## Related links

- [Live portfolio](https://aksamitny.com)
- [Full-stack case study](https://aksamitny.com/projects?projectId=13)
- [Frontend repository](https://github.com/Kotyarya/Portfolio)

## Architecture

```text
Next.js server components
  -> x-api-key protected NestJS REST API
      -> service layer
          -> Prisma -> PostgreSQL
          -> media allowlist/path validation -> project media
          -> validated + rate-limited contact request -> private mailbox
```

The API binds to `0.0.0.0` and uses Render's `PORT`. Environment validation fails closed when required production configuration is missing.

## API surface

| Route | Purpose |
| --- | --- |
| `GET /projects` | Projects with optional category, status, skills and search filters |
| `GET /projects/:id` | Project details |
| `GET /projects/skills` | Project skill filters |
| `GET /projects/statuses` | Project status filters |
| `GET /projects/categories` | Project category filters |
| `GET /skills`, `GET /skills/:id` | Skills and skill details |
| `GET /blocks/:page` | Structured page content blocks |
| `GET /media/:filename` | Allowlisted media files with path traversal protection |
| `POST /contact` | Validated, rate-limited email delivery |
| `GET /health` | Public readiness response used by Render health checks |

All application routes require `x-api-key` unless explicitly marked public.

## Data model

Prisma models cover content blocks, projects, project images, categories, statuses and skills. The legacy `contacts` model remains in the schema for historical compatibility, but new contact submissions are intentionally not persisted to PostgreSQL.

## Security and privacy

- The API guard rejects requests when the configured key is missing, empty or wrong.
- A global strict validation pipe rejects unknown properties and enforces DTO limits.
- Media filenames are decoded, allowlisted and contained inside the media directory.
- Contact requests are limited to five attempts per 15 minutes per client address on the current single Render instance.
- SMTP failures are converted to a generic error so logs do not expose submitted names, emails or message bodies.
- Security headers deny framing and MIME sniffing and define a restrictive resource policy.

## Local setup

Requirements: Node.js 22, npm and PostgreSQL.

```bash
git clone https://github.com/Kotyarya/Portfolio-Server.git
cd Portfolio-Server
npm ci
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `API_KEY` | Shared key expected in the `x-api-key` header |
| `MAILER_USER` | Private mailbox receiving contact enquiries |
| `MAILER_PASS` | App-specific SMTP password |
| `PORT` | Optional local port; Render supplies it in production |

Never commit real values. `.env.example` contains placeholders only.

## Quality commands

```bash
npm run lint:check
npm test -- --runInBand
npm run test:cov -- --runInBand
npm run build
```

The automated suite covers the API key guard, DTO limits, rate limiting, media path traversal, environment validation and mocked integration flows for projects, skills, blocks and contact. Tests do not use production PostgreSQL or SMTP.

## Render deployment

The `main` branch auto-deploys to the Render web service. The service uses `npm ci && npm run build`, starts `dist/main`, and probes `/health` before moving traffic to a new instance. Production secrets are managed in the Render workspace and are not stored in GitHub.
