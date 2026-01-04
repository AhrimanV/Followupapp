import { TaskStatus } from "../models/domainModel.js";
import { formatDate, generateAuditEmailTemplate, getAuditLanguage, storage } from "../shared.js";

const buildDefaultAuditLink = (auditId) => {
  const baseUrl = window.location?.origin || "https://followup.contoso.com";
  return `${baseUrl}/app/audits/${auditId}`;
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatBodyHtml = (bodyText) => escapeHtml(bodyText).replace(/\n/g, "<br>");

const uniqueEmails = (emails) => {
  const seen = new Set();
  const result = [];
  emails.forEach((email) => {
    const trimmed = (email || "").trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(trimmed);
  });
  return result;
};

const buildAssigneeFromAudit = (audit, tasks) => {
  const fallbackTask = tasks.find((task) => task.assignedTo || task.assignedEmail);
  return {
    name: audit?.storeManagerName || fallbackTask?.assignedTo || "",
    email:
      audit?.storeManagerEmail ||
      audit?.backupAssigneeEmail ||
      fallbackTask?.assignedEmail ||
      "",
  };
};

const buildRecipientLists = (audit, tasks) => {
  const assignee = buildAssigneeFromAudit(audit, tasks);
  const to = uniqueEmails([assignee.email]);
  const cc = uniqueEmails([
    audit?.regionalManagerEmail,
    audit?.directorEmail,
  ]).filter((email) => !to.includes(email));
  return { to, cc, assignee };
};

const buildReminderCopy = ({ audit, tasks, mode }) => {
  const locale = getAuditLanguage(audit);
  const isFrench = locale === "fr";
  const dueDate = audit?.deadline ? formatDate(audit.deadline, locale === "fr" ? "fr-CA" : "en-US") : "";
  const formattedDue = dueDate || (isFrench ? "À confirmer" : "TBD");
  const openTasks = tasks.filter((task) =>
    task.status !== TaskStatus.Approved && task.status !== TaskStatus.Rejected,
  );
  const subject = mode === "deadline"
    ? isFrench
      ? `Échéance d'audit atteinte : ${audit.storeName} (${audit.storeCode || audit.id})`
      : `Audit follow-up deadline: ${audit.storeName} (${audit.storeCode || audit.id})`
    : isFrench
      ? `Rappel de suivi d'audit : ${audit.storeName} (${audit.storeCode || audit.id})`
      : `Audit follow-up reminder: ${audit.storeName} (${audit.storeCode || audit.id})`;
  const bodyLines = [
    isFrench
      ? "Voici un rappel pour le suivi d'audit."
      : "This is a reminder for the audit follow-up.",
    "",
    `${isFrench ? "Audit" : "Audit"}: ${audit.storeName} (${audit.storeCode || audit.id})`,
    `${isFrench ? "ID" : "ID"}: ${audit.id}`,
    `${isFrench ? "Échéance" : "Due"}: ${formattedDue}`,
    `${isFrench ? "Tâches ouvertes" : "Open tasks"}: ${openTasks.length}`,
    `${isFrench ? "Ouvrir l'audit" : "Open audit"}: ${buildDefaultAuditLink(audit.id)}`,
  ];
  return { subject, bodyHtml: formatBodyHtml(bodyLines.join("\n")) };
};

const findTaskEntry = (taskId) => {
  if (!taskId) return null;
  const audits = storage.listAudits();
  for (const audit of audits) {
    const task = audit.tasks.find((entry) => entry.id === taskId);
    if (task) return { audit, task };
  }
  return null;
};

export function buildLaunchEmailPayload(auditId) {
  const audit = storage.getAudit(auditId);
  if (!audit) return null;
  const tasks = storage.listTasks(audit.id);
  const { to, cc, assignee } = buildRecipientLists(audit, tasks);
  const language = getAuditLanguage(audit);
  const template = generateAuditEmailTemplate({
    audit,
    assignee,
    language,
    deadline: audit.deadline || "",
    appLink: buildDefaultAuditLink(audit.id),
  });
  return {
    to,
    cc,
    subject: template.subject,
    bodyHtml: formatBodyHtml(template.body),
    auditId: audit.id,
    taskIds: tasks.map((task) => task.id),
  };
}

export function buildReminderPayload(auditId, mode = "reminder") {
  const audit = storage.getAudit(auditId);
  if (!audit) return null;
  const tasks = storage.listTasks(audit.id);
  const { to, cc } = buildRecipientLists(audit, tasks);
  const { subject, bodyHtml } = buildReminderCopy({ audit, tasks, mode });
  return {
    to,
    cc,
    subject,
    bodyHtml,
    auditId: audit.id,
    taskIds: tasks.map((task) => task.id),
  };
}

export function buildDecisionPayload(taskId, decision) {
  const entry = findTaskEntry(taskId);
  if (!entry) return null;
  const { audit, task } = entry;
  const tasks = storage.listTasks(audit.id);
  const { to, cc } = buildRecipientLists(audit, tasks);
  const locale = getAuditLanguage(audit);
  const isFrench = locale === "fr";
  const subject = isFrench
    ? `Décision sur la tâche ${task.title || task.id}`
    : `Task decision: ${task.title || task.id}`;
  const bodyLines = [
    isFrench
      ? "Une décision a été enregistrée pour la tâche d'audit."
      : "A decision has been recorded for the audit task.",
    "",
    `${isFrench ? "Audit" : "Audit"}: ${audit.storeName} (${audit.storeCode || audit.id})`,
    `${isFrench ? "Tâche" : "Task"}: ${task.title || task.id}`,
    `${isFrench ? "ID de tâche" : "Task ID"}: ${task.id}`,
    `${isFrench ? "Décision" : "Decision"}: ${decision}`,
    `${isFrench ? "Ouvrir l'audit" : "Open audit"}: ${buildDefaultAuditLink(audit.id)}`,
  ];
  return {
    to,
    cc,
    subject,
    bodyHtml: formatBodyHtml(bodyLines.join("\n")),
    auditId: audit.id,
    taskIds: tasks.map((entryTask) => entryTask.id),
    taskId: task.id,
    decision,
  };
}
