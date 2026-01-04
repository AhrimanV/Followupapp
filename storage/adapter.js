/**
 * @typedef {Object} StorageAdapter
 * @property {() => Array} listAudits
 * @property {(auditId: string) => Object | null} getAudit
 * @property {(audit: Object) => Object} createAudit
 * @property {(auditId: string, updates: Object) => Object | null} updateAudit
 * @property {(auditId: string) => Array} listTasks
 * @property {(auditId: string, task: Object) => Object | null} createTask
 * @property {(auditId: string, taskId: string, updates: Object) => Object | null} updateTask
 * @property {(auditId: string, orderedTaskIds: string[]) => Array} reorderTasks
 * @property {(auditId: string, taskId: string) => Array} listSubmissions
 * @property {(auditId: string, taskId: string, submission: Object) => Object | null} createSubmission
 * @property {(auditId: string, taskId: string, decision: Object) => Object | null} createDecision
 * @property {(auditId: string, entry: Object) => Object | null} appendNotificationLog
 * @property {() => Object} getStore
 * @property {(seed?: Object) => Object} resetStore
 * @property {() => Array} listAuditTypes
 * @property {(auditTypeId: string) => Object | null} getAuditType
 * @property {(auditType: Object) => Object} createAuditType
 * @property {(auditTypeId: string, updates: Object) => Object | null} updateAuditType
 * @property {(auditTypeId: string, auditType: Object) => Object | null} replaceAuditType
 * @property {(auditTypeId: string) => Array} deleteAuditType
 * @property {() => Array} listAuditEmailSends
 * @property {(entry: Object) => Object} appendAuditEmailSend
 */

export const storageAdapter = {
  listAudits() {
    throw new Error("Storage adapter not configured.");
  },
  getAudit() {
    throw new Error("Storage adapter not configured.");
  },
  createAudit() {
    throw new Error("Storage adapter not configured.");
  },
  updateAudit() {
    throw new Error("Storage adapter not configured.");
  },
  listTasks() {
    throw new Error("Storage adapter not configured.");
  },
  createTask() {
    throw new Error("Storage adapter not configured.");
  },
  updateTask() {
    throw new Error("Storage adapter not configured.");
  },
  reorderTasks() {
    throw new Error("Storage adapter not configured.");
  },
  listSubmissions() {
    throw new Error("Storage adapter not configured.");
  },
  createSubmission() {
    throw new Error("Storage adapter not configured.");
  },
  createDecision() {
    throw new Error("Storage adapter not configured.");
  },
  appendNotificationLog() {
    throw new Error("Storage adapter not configured.");
  },
  getStore() {
    throw new Error("Storage adapter not configured.");
  },
  listAuditTypes() {
    throw new Error("Storage adapter not configured.");
  },
  getAuditType() {
    throw new Error("Storage adapter not configured.");
  },
  createAuditType() {
    throw new Error("Storage adapter not configured.");
  },
  updateAuditType() {
    throw new Error("Storage adapter not configured.");
  },
  replaceAuditType() {
    throw new Error("Storage adapter not configured.");
  },
  deleteAuditType() {
    throw new Error("Storage adapter not configured.");
  },
  listAuditEmailSends() {
    throw new Error("Storage adapter not configured.");
  },
  appendAuditEmailSend() {
    throw new Error("Storage adapter not configured.");
  },
};
