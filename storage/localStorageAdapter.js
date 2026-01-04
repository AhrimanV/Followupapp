import { TaskStatus } from "../models/domainModel.js";
import { createId } from "../utils/id.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createLocalStorageAdapter({ namespace = "followupapp", seed = {} } = {}) {
  const keys = {
    audits: `${namespace}:audits`,
    auditTypes: `${namespace}:auditTypes`,
    auditEmailSends: `${namespace}:auditEmailSends`,
    auditNotifications: `${namespace}:auditNotifications`,
  };

  const readCollection = (key, fallback) => {
    if (typeof localStorage === "undefined") {
      return clone(fallback || []);
    }
    const stored = localStorage.getItem(key);
    if (!stored) return clone(fallback || []);
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn(`Unable to parse localStorage key ${key}.`, error);
      return clone(fallback || []);
    }
  };

  const data = {
    audits: readCollection(keys.audits, seed.audits || []),
    auditTypes: readCollection(keys.auditTypes, seed.auditTypes || []),
    auditEmailSends: readCollection(keys.auditEmailSends, seed.auditEmailSends || []),
    auditNotifications: readCollection(keys.auditNotifications, seed.auditNotifications || []),
  };

  const persist = (key, value) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  const persistAudits = () => persist(keys.audits, data.audits);
  const persistAuditTypes = () => persist(keys.auditTypes, data.auditTypes);
  const persistEmailSends = () => persist(keys.auditEmailSends, data.auditEmailSends);
  const persistNotifications = () => persist(keys.auditNotifications, data.auditNotifications);

  const getAuditById = (auditId) => data.audits.find((audit) => audit.id === auditId) || null;

  const getTaskById = (auditId, taskId) => {
    const audit = getAuditById(auditId);
    if (!audit) return null;
    const task = audit.tasks.find((entry) => entry.id === taskId) || null;
    return task ? { audit, task } : null;
  };

  return {
    getStore() {
      return data;
    },
    listAudits() {
      return data.audits;
    },
    getAudit(auditId) {
      return getAuditById(auditId);
    },
    createAudit(audit) {
      const entry = {
        tasks: [],
        ...clone(audit || {}),
      };
      if (!entry.id) {
        entry.id = createId("AUD");
      }
      if (!entry.createdAt) {
        entry.createdAt = new Date().toISOString().split("T")[0];
      }
      data.audits.push(entry);
      persistAudits();
      return entry;
    },
    updateAudit(auditId, updates = {}) {
      const audit = getAuditById(auditId);
      if (!audit) return null;
      Object.assign(audit, clone(updates));
      persistAudits();
      return audit;
    },
    listTasks(auditId) {
      const audit = getAuditById(auditId);
      return audit?.tasks || [];
    },
    createTask(auditId, task) {
      const audit = getAuditById(auditId);
      if (!audit) return null;
      const entry = {
        submissions: [],
        pendingProof: { notes: "", photos: [] },
        reviewerNotes: "",
        decisions: [],
        ...clone(task || {}),
      };
      if (!entry.id) {
        entry.id = createId("AT");
      }
      audit.tasks.push(entry);
      persistAudits();
      return entry;
    },
    updateTask(auditId, taskId, updates = {}) {
      const taskEntry = getTaskById(auditId, taskId);
      if (!taskEntry) return null;
      Object.assign(taskEntry.task, clone(updates));
      persistAudits();
      return taskEntry.task;
    },
    reorderTasks(auditId, orderedTaskIds) {
      const audit = getAuditById(auditId);
      if (!audit) return [];
      const lookup = new Map(audit.tasks.map((task) => [task.id, task]));
      const reordered = [];
      orderedTaskIds.forEach((id) => {
        const task = lookup.get(id);
        if (task) reordered.push(task);
      });
      audit.tasks.forEach((task) => {
        if (!orderedTaskIds.includes(task.id)) reordered.push(task);
      });
      reordered.forEach((task, index) => {
        const order = index + 1;
        task.sortOrder = order;
        task.SortOrder = order;
      });
      audit.tasks = reordered;
      persistAudits();
      return audit.tasks;
    },
    listSubmissions(auditId, taskId) {
      const taskEntry = getTaskById(auditId, taskId);
      return taskEntry?.task?.submissions || [];
    },
    createSubmission(auditId, taskId, submission) {
      const taskEntry = getTaskById(auditId, taskId);
      if (!taskEntry) return null;
      const entry = {
        ...clone(submission || {}),
      };
      if (!entry.id) {
        entry.id = createId("SUB");
      }
      if (!entry.submittedAt) {
        entry.submittedAt = new Date().toISOString();
      }
      taskEntry.task.submissions.push(entry);
      if (entry.status) {
        taskEntry.task.status = entry.status;
      }
      persistAudits();
      return entry;
    },
    createDecision(auditId, taskId, decision) {
      const taskEntry = getTaskById(auditId, taskId);
      if (!taskEntry) return null;
      const { submissionId, status, reviewerNotes } = decision || {};
      const submissions = taskEntry.task.submissions || [];
      const submission = submissionId
        ? submissions.find((entry) => entry.id === submissionId)
        : submissions[submissions.length - 1];
      if (!submission) return null;
      const decisionStatus =
        status === TaskStatus.Approved || status === TaskStatus.Rejected ? status : null;
      if (decisionStatus) {
        submission.status = decisionStatus;
        taskEntry.task.status = decisionStatus;
      }
      if (reviewerNotes !== undefined) {
        submission.reviewerNotes = reviewerNotes;
        taskEntry.task.reviewerNotes = reviewerNotes;
      }
      if (decisionStatus) {
        const decisionRecord = {
          id: createId("DEC"),
          status: decisionStatus,
          reviewerNotes: reviewerNotes ?? "",
          submissionId: submission.id,
          decidedAt: new Date().toISOString(),
        };
        if (!Array.isArray(taskEntry.task.decisions)) {
          taskEntry.task.decisions = [];
        }
        taskEntry.task.decisions.push(decisionRecord);
      }
      persistAudits();
      return taskEntry.task;
    },
    appendNotificationLog(auditId, entry) {
      if (!auditId) return null;
      const notification = {
        ...clone(entry || {}),
        id: entry?.id || createId("NTF"),
        auditId,
        sentAt: entry?.sentAt || new Date().toISOString(),
      };
      data.auditNotifications.unshift(notification);
      persistNotifications();
      return notification;
    },
    listAuditTypes() {
      return data.auditTypes;
    },
    getAuditType(auditTypeId) {
      return data.auditTypes.find((type) => type.id === auditTypeId) || null;
    },
    createAuditType(auditType) {
      const entry = { ...clone(auditType || {}) };
      if (!entry.id) {
        entry.id = createId("ATY");
      }
      entry.categories = entry.categories || [];
      data.auditTypes.push(entry);
      persistAuditTypes();
      return entry;
    },
    updateAuditType(auditTypeId, updates = {}) {
      const auditType = data.auditTypes.find((type) => type.id === auditTypeId);
      if (!auditType) return null;
      Object.assign(auditType, clone(updates));
      persistAuditTypes();
      return auditType;
    },
    replaceAuditType(auditTypeId, auditType) {
      const index = data.auditTypes.findIndex((type) => type.id === auditTypeId);
      if (index === -1) return null;
      data.auditTypes[index] = clone(auditType);
      persistAuditTypes();
      return data.auditTypes[index];
    },
    deleteAuditType(auditTypeId) {
      data.auditTypes = data.auditTypes.filter((type) => type.id !== auditTypeId);
      persistAuditTypes();
      return data.auditTypes;
    },
    listAuditEmailSends() {
      return data.auditEmailSends;
    },
    appendAuditEmailSend(entry) {
      const sendEvent = {
        ...clone(entry || {}),
        id: entry?.id || createId("EMAIL"),
        sentAt: entry?.sentAt || new Date().toISOString(),
      };
      data.auditEmailSends.unshift(sendEvent);
      persistEmailSends();
      return sendEvent;
    },
  };
}
