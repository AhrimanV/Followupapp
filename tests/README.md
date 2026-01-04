# Followupapp fixture checks

This folder contains mock audit/task data fixtures and a minimal validation script to
confirm core flows are represented:

- Audit creation
- Task assignment
- Proof submission
- Notifications

## Fixtures

- `fixtures/audits.json`: Audit records with nested tasks and submissions.
- `fixtures/task-assignments.json`: Task assignment events with assignee details.
- `fixtures/submissions.json`: Proof submissions tied to audit tasks.
- `fixtures/notifications.json`: Notification events for key workflow changes.

## Run the checks

From the repo root:

```bash
node tests/validate-fixtures.mjs
```

The script validates that:

- Each audit includes required fields and at least one task.
- Assignments reference existing audit tasks and assignees.
- Submissions reference existing tasks and include proof photos.
- Notifications reference existing audits/tasks and include messages.

## Manual QA checklist (optional)

1. Open `admin.html`.
2. Create a new audit in **Create Audit** and confirm it appears in the **Task List**.
3. Assign at least one task and confirm the assignee is listed on the task detail screen.
4. Switch to the **Store Manager** view, submit proof for the assigned task, and confirm it
   appears in the **Reviewer Queue**.
5. Check the notification log to confirm audit creation and proof submission messages.

## Dev harness (manual only)

For local QA, open `tests/dev-harness.html` in a browser. It loads `admin.html` and
`store-manager.html` in iframes and reports runtime errors (PASS/FAIL). This file is
for development use only and is not part of production builds.
