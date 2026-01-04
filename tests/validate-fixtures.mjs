import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function readJson(fileName) {
  const filePath = path.join(__dirname, "fixtures", fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function indexAudits(audits) {
  const auditMap = new Map();
  const taskMap = new Map();
  audits.forEach((audit) => {
    auditMap.set(audit.id, audit);
    audit.tasks.forEach((task) => {
      taskMap.set(`${audit.id}:${task.id}`, task);
    });
  });
  return { auditMap, taskMap };
}

function validateAuditCreation(audits) {
  assert(audits.length > 0, "Expected at least one audit fixture.");
  audits.forEach((audit) => {
    assert(audit.id, "Audit requires an id.");
    assert(audit.storeCode, `Audit ${audit.id} requires a storeCode.`);
    assert(audit.storeName, `Audit ${audit.id} requires a storeName.`);
    assert(Array.isArray(audit.tasks), `Audit ${audit.id} requires tasks.`);
  });
}

function validateTaskAssignments(assignments, taskMap) {
  assert(assignments.length > 0, "Expected at least one task assignment.");
  assignments.forEach((assignment) => {
    const key = `${assignment.auditId}:${assignment.taskId}`;
    assert(taskMap.has(key), `Assignment references missing task ${key}.`);
    assert(assignment.assignee?.email, `Assignment ${key} requires assignee email.`);
  });
}

function validateSubmissions(submissions, taskMap) {
  assert(submissions.length > 0, "Expected at least one proof submission.");
  submissions.forEach((submission) => {
    const key = `${submission.auditId}:${submission.taskId}`;
    const task = taskMap.get(key);
    assert(task, `Submission references missing task ${key}.`);
    assert(submission.proofLinks?.length, `Submission ${submission.id} needs proof links.`);
    assert(
      task.submissions.some((entry) => entry.id === submission.id),
      `Audit task ${key} should include submission ${submission.id}.`
    );
  });
}

function validateNotifications(notifications, auditMap, taskMap) {
  assert(notifications.length > 0, "Expected at least one notification.");
  notifications.forEach((notification) => {
    assert(auditMap.has(notification.auditId), `Notification ${notification.id} audit missing.`);
    if (notification.taskId) {
      const key = `${notification.auditId}:${notification.taskId}`;
      assert(taskMap.has(key), `Notification ${notification.id} task missing.`);
    }
    assert(notification.message, `Notification ${notification.id} needs message.`);
  });
}

function run() {
  const auditsData = readJson("audits.json");
  const assignmentsData = readJson("task-assignments.json");
  const submissionsData = readJson("submissions.json");
  const notificationsData = readJson("notifications.json");

  const audits = auditsData.audits ?? [];
  validateAuditCreation(audits);

  const { auditMap, taskMap } = indexAudits(audits);

  validateTaskAssignments(assignmentsData.assignments ?? [], taskMap);
  validateSubmissions(submissionsData.submissions ?? [], taskMap);
  validateNotifications(notificationsData.notifications ?? [], auditMap, taskMap);

  console.log("Fixture checks passed.");
}

run();
