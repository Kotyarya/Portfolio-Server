# Portfolio Website Agent Workflow

## Scope

- This repository contains the NestJS backend for the Portfolio Website project.
- The sibling frontend repository is `/Users/kotyarya/Dev/portfol`.
- Notion project `Portfolio Website` and its task database are the source of truth for priorities and status.

## Task workflow

1. Select the highest-priority unblocked task: Critical, High, Normal, then Low. Prefer security, production blockers, SEO, and dependency-unblocking work.
2. Before editing, tell the user which task was selected, why, the implementation idea, risks, and verification plan.
3. Move the Notion task to `В работе` and add a short progress note.
4. Use one branch per task named `codex/TASK-ID-short-description`.
5. Keep the change focused. Preserve unrelated user edits and never stage them silently.
6. Run the relevant checks. For backend changes, normally run `npm test -- --runInBand`, `npm run build`, and `npm run lint -- --no-fix`.
7. Self-review the final diff for correctness, security, regressions, and missing tests.
8. Commit with the Task ID, push the branch, and open a draft pull request.
9. Add the pull request URL and verification summary to Notion, then move the task to `Code Review`.
10. Mark `Definition of Done` only after all acceptance criteria are verified.

## Safety boundaries

- Do not merge pull requests or deploy production without explicit user approval.
- Ask before adding production dependencies, changing secrets, running migrations, or performing destructive operations.
- Never commit credentials, `.env` contents, generated build output, or unrelated IDE files.
- If blocked, record the reason in Notion, set `Заблокировано`, and continue with another unblocked task when appropriate.

## Code expectations

- Add regression tests for bug fixes and security changes.
- Prefer explicit validation at public boundaries and fail closed.
- Use NestJS exceptions for intentional HTTP errors.
- Keep TypeScript types explicit at external boundaries and follow the existing formatter and linter configuration.
