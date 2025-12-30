import {
  TaskStatus,
  m365Directory,
  users,
  store,
  state,
  api,
  ensureSelectedAudit,
  emailTemplateSettings,
  formatDate,
  formatDateRange,
  generateAuditTaskId,
  generateAuditCategoryId,
  generateAuditTypeId,
  generateTemplateId,
  generateAuditEmailTemplate,
  getAccessibleAudits,
  getAuditCompletionStatus,
  isTaskOverdue,
  getActiveUser,
  getAuditLanguage,
  getAuditTypeById,
  getAuditTypeCategoryNames,
  getAuditTypeLabel,
  getAuditTypeTemplateEntry,
  getAuditTypeTemplates,
  getLatestPendingSubmission,
  getRoleBadgeClass,
  getRoleLabel,
  getSidebarMetrics,
  getSelectedAudit,
  getStoreContactByCode,
  getStatusBadgeClass,
  getTaskEntry,
  getTasksForAudit,
  getUnassignedTemplates,
  getUserById,
  getVisibleTasksForAudit,
  getLocalizedValue,
  isAdmin,
  logAuditEmailSend,
  renderStoreManagerView,
  syncStoreManagerLocaleFromAudit,
} from "./shared.js";

const navButtons = Array.from(document.querySelectorAll(".nav-item"));
const screens = document.querySelectorAll(".content");
const screenTitle = document.getElementById("screen-title");
const screenSubtitle = document.getElementById("screen-subtitle");

const screenMeta = {
  home: {
    title: "Home",
    subtitle: "Search and start a new audit follow-up.",
  },
  "audit-list": {
    title: "Audit List",
    subtitle: "Find audits by status, auditor, or store.",
  },
  "create-audit": {
    title: "Create Audit",
    subtitle: "Capture audit details and summary notes.",
  },
  "create-tasks": {
    title: "Create Templates",
    subtitle: "Maintain a reusable library of audit tasks.",
  },
  "task-list": {
    title: "Task List",
    subtitle: "Track progress across tasks for the selected audit.",
  },
  "task-detail": {
    title: "Task Detail",
    subtitle: "Review task submissions and proof.",
  },
  "reviewer-queue": {
    title: "Reviewer Queue",
    subtitle: "Approve or reject incoming submissions.",
  },
  "store-manager": {
    title: "Store Manager",
    subtitle: "Submit proof for tasks assigned to you.",
  },
  admin: {
    title: "Admin Panel",
    subtitle: "Manage audit access and review regional performance.",
  },
};

const elements = {
  rosAdminApp: document.querySelector(".app--ros-admin"),
  storeManagerApp: document.querySelector(".app--store-manager"),
  taskListRows: document.getElementById("task-list-rows"),
  taskListAuditorFilter: document.getElementById("task-list-auditor-filter"),
  taskTitle: document.getElementById("detail-task-title"),
  taskCategory: document.getElementById("detail-task-category"),
  taskAudit: document.getElementById("detail-task-audit"),
  taskDue: document.getElementById("detail-task-due"),
  taskStatus: document.getElementById("detail-task-status"),
  taskSubmission: document.getElementById("detail-task-submission"),
  reviewerNotes: document.getElementById("detail-reviewer-notes"),
  rejectButton: document.getElementById("reject-task"),
  approveButton: document.getElementById("approve-task"),
  reviewerQueueList: document.getElementById("reviewer-queue-list"),
  queueAlert: document.getElementById("queue-alert"),
  queueAlertText: document.getElementById("queue-alert-text"),
  queueAlertAction: document.getElementById("queue-alert-action"),
  managerAuditHeader: document.getElementById("manager-audit-header"),
  managerTaskList: document.getElementById("manager-task-list"),
  existingTaskCategory: document.getElementById("existing-task-category"),
  existingTaskList: document.getElementById("existing-task-list"),
  auditTaskSummary: document.getElementById("audit-task-summary"),
  auditTaskCount: document.getElementById("audit-task-count"),
  taskTitleInputEn: document.getElementById("task-title-input-en"),
  taskTitleInputFr: document.getElementById("task-title-input-fr"),
  taskCategorySelect: document.getElementById("task-category-select"),
  taskNotesInputEn: document.getElementById("task-notes-input-en"),
  taskNotesInputFr: document.getElementById("task-notes-input-fr"),
  taskProofRequiredInput: document.getElementById("task-proof-required-input"),
  addTaskButton: document.getElementById("add-task-button"),
  bulkAddButton: document.getElementById("bulk-add-button"),
  taskPoolList: document.getElementById("task-pool-list"),
  auditTypeLibrarySelect: document.getElementById("audit-type-library-select"),
  auditTypeNameInputEn: document.getElementById("audit-type-name-en"),
  auditTypeNameInputFr: document.getElementById("audit-type-name-fr"),
  saveAuditTypeButton: document.getElementById("save-audit-type-button"),
  addAuditTypeButton: document.getElementById("add-audit-type-button"),
  auditTypeReadonlyNote: document.getElementById("audit-type-readonly-note"),
  categoryNameInputEn: document.getElementById("category-name-input-en"),
  categoryNameInputFr: document.getElementById("category-name-input-fr"),
  saveCategoryButton: document.getElementById("save-category-button"),
  categoryList: document.getElementById("category-list"),
  taskAssignee: document.getElementById("detail-task-assignee"),
  taskAssigneeEmail: document.getElementById("detail-task-email"),
  taskProofRequired: document.getElementById("detail-task-proof"),
  taskDetailDueInput: document.getElementById("detail-task-due-input"),
  taskDetailCategoryInput: document.getElementById("detail-task-category-input"),
  taskDetailAssigneeInput: document.getElementById("detail-task-assignee-input"),
  taskDetailProofInput: document.getElementById("detail-task-proof-input"),
  removeTaskButton: document.getElementById("remove-task-from-audit"),
  generateReportButton: document.getElementById("generate-report-button"),
  storeManagerTitle: document.getElementById("store-manager-title"),
  storeManagerSubtitle: document.getElementById("store-manager-subtitle"),
  storeManagerLocaleSelect: document.getElementById("store-manager-locale"),
  storeManagerLanguageLabel: document.getElementById("store-manager-language-label"),
  adminFilterAuditor: document.getElementById("admin-filter-auditor"),
  adminFilterStore: document.getElementById("admin-filter-store"),
  adminFilterStatus: document.getElementById("admin-filter-status"),
  adminFilterStart: document.getElementById("admin-filter-start"),
  adminFilterEnd: document.getElementById("admin-filter-end"),
  adminAuditRows: document.getElementById("admin-audit-rows"),
  homeOpenAudits: document.getElementById("home-open-audits"),
  homeOverdueAudits: document.getElementById("home-overdue-audits"),
  homeAwaitingApproval: document.getElementById("home-awaiting-approval"),
  auditListFilterStatus: document.getElementById("audit-list-filter-status"),
  auditListFilterAuditor: document.getElementById("audit-list-filter-auditor"),
  auditListFilterStore: document.getElementById("audit-list-filter-store"),
  auditListFilterStart: document.getElementById("audit-list-filter-start"),
  auditListFilterEnd: document.getElementById("audit-list-filter-end"),
  auditListRows: document.getElementById("audit-list-rows"),
  profileList: document.getElementById("profile-list"),
  assigneeList: document.getElementById("assignee-list"),
  sidebarMetrics: document.getElementById("sidebar-metrics"),
  sidebarFooter: document.getElementById("sidebar-footer"),
  sidebarStoreCode: document.getElementById("sidebar-store-code"),
  sidebarAuditStatus: document.getElementById("sidebar-audit-status"),
  saveContinueButton: document.getElementById("save-continue-button"),
  auditIdInput: document.getElementById("audit-id-input"),
  auditDateInput: document.getElementById("audit-date-input"),
  auditOwnerInput: document.getElementById("audit-owner-input"),
  auditTypeSelect: document.getElementById("audit-type-select"),
  auditStoreCodeInput: document.getElementById("audit-store-code-input"),
  auditStoreInput: document.getElementById("audit-store-input"),
  auditStoreManagerInput: document.getElementById("audit-store-manager-input"),
  auditStoreManagerEmailInput: document.getElementById("audit-store-manager-email-input"),
  auditRegionalManagerInput: document.getElementById("audit-regional-manager-input"),
  auditRegionalManagerEmailInput: document.getElementById("audit-regional-manager-email-input"),
  auditDirectorInput: document.getElementById("audit-director-input"),
  auditDirectorEmailInput: document.getElementById("audit-director-email-input"),
  auditAssigneeInput: document.getElementById("audit-assignee-input"),
  auditBackupAssigneeEmailInput: document.getElementById("audit-backup-assignee-email-input"),
  auditDeadlineInput: document.getElementById("audit-deadline-input"),
  auditReminderInput: document.getElementById("audit-reminder-input"),
  auditLanguageSelect: document.getElementById("audit-language-select"),
  auditSummaryInput: document.getElementById("audit-summary-input"),
  auditPhotosInput: document.getElementById("audit-photos-input"),
  auditReminderStoreManager: document.getElementById("audit-reminder-sm"),
  auditReminderRegionalManager: document.getElementById("audit-reminder-rm"),
  auditReminderDirector: document.getElementById("audit-reminder-director"),
  auditDeadlineStoreManager: document.getElementById("audit-deadline-sm"),
  auditDeadlineRegionalManager: document.getElementById("audit-deadline-rm"),
  auditDeadlineDirector: document.getElementById("audit-deadline-director"),
  auditEmailPreview: document.getElementById("audit-email-preview"),
  auditEmailSubjectTemplate: document.getElementById("audit-email-subject-template"),
  auditEmailGreetingTemplate: document.getElementById("audit-email-greeting-template"),
  auditEmailIntroTemplate: document.getElementById("audit-email-intro-template"),
  auditEmailClosingTemplate: document.getElementById("audit-email-closing-template"),
  auditEmailDetailsLabel: document.getElementById("audit-email-details-label"),
  auditEmailSummaryLabel: document.getElementById("audit-email-summary-label"),
  auditEmailTypeLabel: document.getElementById("audit-email-type-label"),
  auditEmailTasksLabel: document.getElementById("audit-email-tasks-label"),
  auditEmailDueLabel: document.getElementById("audit-email-due-label"),
  auditEmailLinkLabel: document.getElementById("audit-email-link-label"),
  auditEmailAuditorLabel: document.getElementById("audit-email-auditor-label"),
  auditEmailSettingsSource: document.getElementById("audit-email-settings-source"),
  auditEmailSendLog: document.getElementById("audit-email-send-log"),
  auditNotificationLog: document.getElementById("audit-notification-log"),
  homeContinueButton: document.getElementById("home-continue-button"),
  homeFindAuditsButton: document.getElementById("home-find-audits-button"),
  newAuditButton: document.getElementById("new-audit-button"),
  saveDraftButton: document.getElementById("save-draft-button"),
  auditDraftAlert: document.getElementById("audit-draft-alert"),
  auditDraftMessage: document.getElementById("audit-draft-message"),
  auditDraftTimestamp: document.getElementById("audit-draft-timestamp"),
  adminMessageReviewerButton: document.getElementById("admin-message-reviewer-button"),
};

let selectedTemplateCategory = "";
let selectedAuditTypeId = "";
let editingCategoryId = "";
let editingTemplateRef = null;

const storeManagerElements = {
  storeManagerTitle: elements.storeManagerTitle,
  storeManagerSubtitle: elements.storeManagerSubtitle,
  storeManagerLanguageLabel: elements.storeManagerLanguageLabel,
  storeManagerLocaleSelect: elements.storeManagerLocaleSelect,
  managerAuditHeader: elements.managerAuditHeader,
  managerTaskList: elements.managerTaskList,
};

function renderStoreManager() {
  renderStoreManagerView(storeManagerElements, {
    onTaskUpdated: () => {
      renderTaskList();
      renderReviewerQueue();
      renderTaskDetail();
    },
  });
  renderSidebarFooter();
  renderSidebarMetrics();
}

function getCategoryOptionsForAudit(audit) {
  if (!audit) return [];
  const locale = getAuditLanguage(audit);
  return getAuditTypeCategoryNames(audit.auditType, locale);
}

function formatCsvValue(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
    return `"${text.replaceAll("\"", '""')}"`;
  }
  return text;
}

function buildAuditReportRows() {
  const rows = [
    [
      "Audit",
      "Store",
      "Auditor",
      "Task",
      "Category",
      "Status",
      "Due Date",
      "Assignee",
      "Assignee Email",
    ],
  ];

  store.audits.forEach((audit) => {
    const auditor = getUserById(audit.ownerId);
    audit.tasks.forEach((task) => {
      rows.push([
        audit.id,
        `${audit.storeName} (${audit.storeCode})`,
        auditor?.name || "Unassigned",
        task.title,
        task.category,
        task.status,
        task.dueDate,
        task.assignedTo,
        task.assignedEmail,
      ]);
    });
  });

  return rows.map((row) => row.map(formatCsvValue).join(",")).join("\n");
}

function downloadAuditReport() {
  const csv = buildAuditReportRows();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "audit-follow-up-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderAssigneeDatalist() {
  if (!elements.assigneeList) return;
  elements.assigneeList.innerHTML = "";
  m365Directory.contacts.forEach((contact) => {
    const option = document.createElement("option");
    option.value = contact.displayName;
    option.textContent = `${contact.displayName} (${contact.email})`;
    elements.assigneeList.appendChild(option);
  });
}

function renderSidebarFooter() {
  if (!elements.sidebarFooter) return;
  const audit = getSelectedAudit();
  elements.sidebarFooter.classList.toggle("hidden", !audit);
  if (!audit) return;
  if (elements.sidebarStoreCode) {
    elements.sidebarStoreCode.textContent = audit.storeCode || audit.id || "--";
  }
  if (elements.sidebarAuditStatus) {
    elements.sidebarAuditStatus.textContent = getAuditCompletionStatus(audit);
  }
}

function renderSidebarMetrics() {
  if (!elements.sidebarMetrics) return;
  const metrics = getSidebarMetrics();
  elements.sidebarMetrics.innerHTML = `
    <div class="metric"><span>Open audits</span><strong>${metrics.openAudits}</strong></div>
    <div class="metric"><span>Tasks awaiting approval</span><strong>${metrics.tasksAwaitingApproval}</strong></div>
  `;
}

function populateStoreContactFields(contact) {
  if (!contact) return;
  if (elements.auditStoreInput) elements.auditStoreInput.value = contact.storeName || "";
  if (elements.auditStoreManagerInput) elements.auditStoreManagerInput.value = contact.storeManager || "";
  if (elements.auditStoreManagerEmailInput) {
    elements.auditStoreManagerEmailInput.value = contact.storeManagerEmail || "";
  }
  if (elements.auditRegionalManagerInput) {
    elements.auditRegionalManagerInput.value = contact.regionalManager || "";
  }
  if (elements.auditRegionalManagerEmailInput) {
    elements.auditRegionalManagerEmailInput.value = contact.regionalManagerEmail || "";
  }
  if (elements.auditDirectorInput) elements.auditDirectorInput.value = contact.director || "";
  if (elements.auditDirectorEmailInput) {
    elements.auditDirectorEmailInput.value = contact.directorEmail || "";
  }
}

function getEscalationRulesFromForm(audit) {
  const reminderRecipients = [];
  if (elements.auditReminderStoreManager?.checked) reminderRecipients.push("store-manager");
  if (elements.auditReminderRegionalManager?.checked) reminderRecipients.push("regional-manager");
  if (elements.auditReminderDirector?.checked) reminderRecipients.push("director");

  const deadlineRecipients = [];
  if (elements.auditDeadlineStoreManager?.checked) deadlineRecipients.push("store-manager");
  if (elements.auditDeadlineRegionalManager?.checked) deadlineRecipients.push("regional-manager");
  if (elements.auditDeadlineDirector?.checked) deadlineRecipients.push("director");

  const hasControls =
    elements.auditReminderStoreManager ||
    elements.auditReminderRegionalManager ||
    elements.auditReminderDirector ||
    elements.auditDeadlineStoreManager ||
    elements.auditDeadlineRegionalManager ||
    elements.auditDeadlineDirector;

  return {
    reminderRecipients: hasControls
      ? reminderRecipients
      : audit?.escalationRules?.reminderRecipients || defaultEscalationRules.reminderRecipients,
    deadlineRecipients: hasControls
      ? deadlineRecipients
      : audit?.escalationRules?.deadlineRecipients || defaultEscalationRules.deadlineRecipients,
  };
}

function applyEscalationRulesToForm(escalationRules) {
  const rules = ensureEscalationRules({ escalationRules });
  if (elements.auditReminderStoreManager) {
    elements.auditReminderStoreManager.checked = rules.reminderRecipients.includes("store-manager");
  }
  if (elements.auditReminderRegionalManager) {
    elements.auditReminderRegionalManager.checked = rules.reminderRecipients.includes("regional-manager");
  }
  if (elements.auditReminderDirector) {
    elements.auditReminderDirector.checked = rules.reminderRecipients.includes("director");
  }
  if (elements.auditDeadlineStoreManager) {
    elements.auditDeadlineStoreManager.checked = rules.deadlineRecipients.includes("store-manager");
  }
  if (elements.auditDeadlineRegionalManager) {
    elements.auditDeadlineRegionalManager.checked = rules.deadlineRecipients.includes("regional-manager");
  }
  if (elements.auditDeadlineDirector) {
    elements.auditDeadlineDirector.checked = rules.deadlineRecipients.includes("director");
  }
}

function buildAuditDraftFromForm(audit) {
  const baseAudit = audit || {};
  const ownerLookupValue = elements.auditOwnerInput?.value.trim();
  const ownerMatch = users.find(
    (user) =>
      user.name.toLowerCase() === ownerLookupValue?.toLowerCase() ||
      user.email.toLowerCase() === ownerLookupValue?.toLowerCase(),
  );
  const reminderCadence = getReminderCadenceFromInput(baseAudit);
  const escalationRules = getEscalationRulesFromForm(baseAudit);
  return {
    ...baseAudit,
    id: elements.auditIdInput?.value.trim() || baseAudit.id,
    createdAt: elements.auditDateInput?.value || baseAudit.createdAt,
    auditType: elements.auditTypeSelect?.value || baseAudit.auditType,
    storeCode: elements.auditStoreCodeInput?.value.trim() || baseAudit.storeCode,
    storeName: elements.auditStoreInput?.value.trim() || baseAudit.storeName,
    storeManagerName:
      elements.auditStoreManagerInput?.value.trim() || baseAudit.storeManagerName,
    storeManagerEmail:
      elements.auditStoreManagerEmailInput?.value.trim() || baseAudit.storeManagerEmail,
    regionalManagerName:
      elements.auditRegionalManagerInput?.value.trim() || baseAudit.regionalManagerName,
    regionalManagerEmail:
      elements.auditRegionalManagerEmailInput?.value.trim() || baseAudit.regionalManagerEmail,
    directorName: elements.auditDirectorInput?.value.trim() || baseAudit.directorName,
    directorEmail: elements.auditDirectorEmailInput?.value.trim() || baseAudit.directorEmail,
    ownerId: ownerMatch?.id || baseAudit.ownerId,
    deadline: elements.auditDeadlineInput?.value || baseAudit.deadline,
    reminderCadenceDays: reminderCadence ?? baseAudit.reminderCadenceDays,
    escalationRules,
    summary: elements.auditSummaryInput?.value.trim() || "",
    backupAssigneeEmail:
      elements.auditBackupAssigneeEmailInput?.value.trim() || baseAudit.backupAssigneeEmail,
  };
}

function getAssigneeFromInput() {
  const value = elements.auditAssigneeInput?.value.trim();
  if (!value) return null;
  const match = m365Directory.contacts.find(
    (contact) =>
      contact.displayName.toLowerCase() === value.toLowerCase() ||
      contact.email.toLowerCase() === value.toLowerCase(),
  );
  return {
    name: match?.displayName || value,
    email: match?.email || "",
  };
}

function buildDefaultAuditLink(auditId) {
  const baseUrl = window.location?.origin || "https://followup.contoso.com";
  return `${baseUrl}/app/audits/${auditId}`;
}

function getEmailSettingsLocale() {
  return elements.auditLanguageSelect?.value || "en";
}

function getEmailTemplateForLocale(locale) {
  return emailTemplateSettings.templates[locale] || emailTemplateSettings.templates.en;
}

function renderEmailSettingsForm(locale = getEmailSettingsLocale()) {
  const template = getEmailTemplateForLocale(locale);
  if (elements.auditEmailSubjectTemplate) {
    elements.auditEmailSubjectTemplate.value = template.subject || "";
  }
  if (elements.auditEmailGreetingTemplate) {
    elements.auditEmailGreetingTemplate.value = template.greeting || "";
  }
  if (elements.auditEmailIntroTemplate) {
    elements.auditEmailIntroTemplate.value = template.intro || "";
  }
  if (elements.auditEmailClosingTemplate) {
    elements.auditEmailClosingTemplate.value = template.closing || "";
  }
  if (elements.auditEmailDetailsLabel) {
    elements.auditEmailDetailsLabel.value = template.detailsLabel || "";
  }
  if (elements.auditEmailSummaryLabel) {
    elements.auditEmailSummaryLabel.value = template.summaryLabel || "";
  }
  if (elements.auditEmailTypeLabel) {
    elements.auditEmailTypeLabel.value = template.typeLabel || "";
  }
  if (elements.auditEmailTasksLabel) {
    elements.auditEmailTasksLabel.value = template.tasksLabel || "";
  }
  if (elements.auditEmailDueLabel) {
    elements.auditEmailDueLabel.value = template.dueLabel || "";
  }
  if (elements.auditEmailLinkLabel) {
    elements.auditEmailLinkLabel.value = template.linkLabel || "";
  }
  if (elements.auditEmailAuditorLabel) {
    elements.auditEmailAuditorLabel.value = template.auditorLabel || "";
  }
  if (elements.auditEmailSettingsSource) {
    const powerAppsStatus = emailTemplateSettings.powerApps?.templateId
      ? `PowerApps template ${emailTemplateSettings.powerApps.templateId}`
      : "PowerApps sync placeholder";
    elements.auditEmailSettingsSource.textContent = `Stored locally · ${powerAppsStatus}`;
  }
}

function updateEmailTemplateSetting(key, value) {
  const locale = getEmailSettingsLocale();
  if (!emailTemplateSettings.templates[locale]) {
    emailTemplateSettings.templates[locale] = { ...getEmailTemplateForLocale("en") };
  }
  emailTemplateSettings.templates[locale][key] = value;
  const audit = getSelectedAudit();
  if (!audit) return;
  const draftAudit = buildAuditDraftFromForm(audit);
  const assignee = getAssigneeFromInput();
  const deadline = elements.auditDeadlineInput?.value || audit.deadline || "";
  const appLink = buildDefaultAuditLink(draftAudit.id || audit.id);
  renderAuditEmailPreview({
    audit: draftAudit,
    assignee,
    language: getEmailSettingsLocale(),
    deadline,
    appLink,
  });
}

function renderAuditEmailPreview({ audit, assignee, language, deadline, appLink }) {
  if (!elements.auditEmailPreview) return;
  const template = generateAuditEmailTemplate({ audit, assignee, language, deadline, appLink });
  elements.auditEmailPreview.textContent = `Subject: ${template.subject}\n\n${template.body}`;
}

function renderAuditEmailSendLog(auditId) {
  if (!elements.auditEmailSendLog) return;
  const sends = store.auditEmailSends.filter((entry) => entry.auditId === auditId);
  if (!sends.length) {
    elements.auditEmailSendLog.textContent = "No audit emails sent yet.";
    return;
  }
  elements.auditEmailSendLog.innerHTML = "";
  sends.slice(0, 3).forEach((entry) => {
    const item = document.createElement("div");
    item.className = "audit-email-log-item";
    const sentAt = new Date(entry.sentAt).toLocaleString("en-US");
    item.innerHTML = `
      <strong>${sentAt}</strong>
      <div>${entry.to || "Unknown recipient"} · ${entry.language?.toUpperCase()}</div>
      <div class="muted">${entry.subject}</div>
    `;
    elements.auditEmailSendLog.appendChild(item);
  });
}

function renderAuditNotificationLog(auditId) {
  if (!elements.auditNotificationLog) return;
  const entries = store.auditNotifications.filter((entry) => entry.auditId === auditId);
  if (!entries.length) {
    elements.auditNotificationLog.textContent = "No notifications dispatched yet.";
    return;
  }
  elements.auditNotificationLog.innerHTML = "";
  entries.slice(0, 4).forEach((entry) => {
    const item = document.createElement("div");
    item.className = "audit-email-log-item";
    const sentAt = new Date(entry.sentAt).toLocaleString("en-US");
    const recipientNames = entry.recipients.map((recipient) => recipient.name).join(", ");
    const typeLabel =
      entry.type === "reminder"
        ? `Reminder (D-${entry.cadenceDays ?? "?"})`
        : "Deadline escalation";
    item.innerHTML = `
      <strong>${sentAt}</strong>
      <div>${typeLabel} · ${recipientNames || "No recipients"}</div>
      <div class="muted">${entry.message}</div>
    `;
    elements.auditNotificationLog.appendChild(item);
  });
}

function showDraftAlert(message) {
  if (!elements.auditDraftAlert) return;
  if (elements.auditDraftMessage) {
    elements.auditDraftMessage.textContent = message;
  }
  if (elements.auditDraftTimestamp) {
    elements.auditDraftTimestamp.textContent = new Date().toLocaleString("en-US");
  }
  elements.auditDraftAlert.classList.remove("hidden");
}

function getNextAuditId() {
  const year = new Date().getFullYear();
  const index = String(store.audits.length + 1).padStart(3, "0");
  return `AUD-${year}-${index}`;
}

function resetCreateAuditForm() {
  const today = new Date().toISOString().split("T")[0];
  if (elements.auditIdInput) elements.auditIdInput.value = getNextAuditId();
  if (elements.auditDateInput) elements.auditDateInput.value = today;
  if (elements.auditOwnerInput) elements.auditOwnerInput.value = getActiveUser()?.name || "";
  if (elements.auditTypeSelect) {
    elements.auditTypeSelect.value = store.auditTypes[0]?.id || "";
  }
  if (elements.auditStoreCodeInput) elements.auditStoreCodeInput.value = "";
  if (elements.auditStoreInput) elements.auditStoreInput.value = "";
  if (elements.auditStoreManagerInput) elements.auditStoreManagerInput.value = "";
  if (elements.auditStoreManagerEmailInput) elements.auditStoreManagerEmailInput.value = "";
  if (elements.auditRegionalManagerInput) elements.auditRegionalManagerInput.value = "";
  if (elements.auditRegionalManagerEmailInput) elements.auditRegionalManagerEmailInput.value = "";
  if (elements.auditDirectorInput) elements.auditDirectorInput.value = "";
  if (elements.auditDirectorEmailInput) elements.auditDirectorEmailInput.value = "";
  if (elements.auditAssigneeInput) elements.auditAssigneeInput.value = "";
  if (elements.auditBackupAssigneeEmailInput) {
    elements.auditBackupAssigneeEmailInput.value = "";
  }
  if (elements.auditDeadlineInput) elements.auditDeadlineInput.value = "";
  if (elements.auditReminderInput) elements.auditReminderInput.value = 7;
  if (elements.auditLanguageSelect) elements.auditLanguageSelect.value = "en";
  renderEmailSettingsForm("en");
  if (elements.auditSummaryInput) elements.auditSummaryInput.value = "";
  if (elements.auditPhotosInput) elements.auditPhotosInput.value = "";
  applyEscalationRulesToForm(defaultEscalationRules);
  if (elements.auditEmailPreview) {
    elements.auditEmailPreview.textContent = "Preview will appear here.";
  }
  if (elements.auditEmailSendLog) {
    elements.auditEmailSendLog.textContent = "No audit emails sent yet.";
  }
  if (elements.auditNotificationLog) {
    elements.auditNotificationLog.textContent = "No notifications dispatched yet.";
  }
  if (elements.auditDraftAlert) {
    elements.auditDraftAlert.classList.add("hidden");
  }
}

const defaultEscalationRules = {
  reminderRecipients: ["store-manager", "regional-manager"],
  deadlineRecipients: ["store-manager", "regional-manager", "director"],
};

function ensureEscalationRules(audit) {
  if (!audit?.escalationRules) {
    return { ...defaultEscalationRules };
  }
  return {
    reminderRecipients:
      audit.escalationRules.reminderRecipients || defaultEscalationRules.reminderRecipients,
    deadlineRecipients:
      audit.escalationRules.deadlineRecipients || defaultEscalationRules.deadlineRecipients,
  };
}

function normalizeDirectoryContact(contact) {
  if (!contact) return null;
  return {
    name: contact.displayName,
    email: contact.email,
    role: contact.jobTitle,
  };
}

function buildNotificationRecipients({ audit, assignee }) {
  const fallbackTask = audit?.tasks?.find((task) => task.assignedTo || task.assignedEmail);
  const storeManager = {
    name:
      assignee?.name ||
      audit?.storeManagerName ||
      fallbackTask?.assignedTo ||
      "Store Manager",
    email:
      assignee?.email ||
      audit?.storeManagerEmail ||
      audit?.backupAssigneeEmail ||
      fallbackTask?.assignedEmail ||
      "",
    role: "Store Manager",
  };
  const regionalManager =
    audit?.regionalManagerName || audit?.regionalManagerEmail
      ? {
          name: audit.regionalManagerName || "Regional Manager",
          email: audit.regionalManagerEmail || "",
          role: "Regional Manager",
        }
      : normalizeDirectoryContact(
          m365Directory.contacts.find((contact) => contact.jobTitle === "Regional Manager"),
        );
  const director =
    audit?.directorName || audit?.directorEmail
      ? {
          name: audit.directorName || "Director",
          email: audit.directorEmail || "",
          role: "Director",
        }
      : normalizeDirectoryContact(
          m365Directory.contacts.find((contact) => contact.jobTitle === "Audit Director"),
        );
  return {
    "store-manager": storeManager,
    "regional-manager": regionalManager,
    director,
  };
}

function resolveNotificationRecipients(ruleList, recipientMap) {
  if (!ruleList?.length) return [];
  return ruleList.map((roleKey) => recipientMap[roleKey]).filter(Boolean);
}

function dispatchMockAuditNotifications({ audit, assignee, reminderCadenceDays, deadline }) {
  if (!audit) return;
  const escalationRules = ensureEscalationRules(audit);
  audit.escalationRules = escalationRules;
  const recipients = buildNotificationRecipients({ audit, assignee });
  const reminderRecipients = resolveNotificationRecipients(
    escalationRules.reminderRecipients,
    recipients,
  );
  const deadlineRecipients = resolveNotificationRecipients(
    escalationRules.deadlineRecipients,
    recipients,
  );
  const sentAt = new Date().toISOString();
  const formattedDeadline = deadline ? formatDate(deadline) : "unscheduled deadline";
  const reminderLabel =
    reminderCadenceDays !== null && reminderCadenceDays !== undefined
      ? `D-${reminderCadenceDays}`
      : "Reminder";

  if (reminderRecipients.length) {
    store.auditNotifications.unshift({
      id: `NTF-${store.auditNotifications.length + 1}`,
      auditId: audit.id,
      type: "reminder",
      sentAt,
      cadenceDays: reminderCadenceDays,
      recipients: reminderRecipients,
      message: `Sent ${reminderLabel} reminder for ${formattedDeadline}.`,
    });
  }

  if (deadlineRecipients.length) {
    store.auditNotifications.unshift({
      id: `NTF-${store.auditNotifications.length + 1}`,
      auditId: audit.id,
      type: "deadline",
      sentAt,
      cadenceDays: reminderCadenceDays,
      recipients: deadlineRecipients,
      message: `Escalated at deadline (${formattedDeadline}).`,
    });
  }
}

function getReminderCadenceFromInput(audit) {
  const value = elements.auditReminderInput?.value;
  if (value === undefined || value === null || value === "") {
    return audit?.reminderCadenceDays ?? null;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? audit?.reminderCadenceDays ?? null : parsed;
}

function populateCreateAuditForm(audit) {
  if (!audit) return;
  if (elements.auditIdInput) elements.auditIdInput.value = audit.id;
  if (elements.auditDateInput) elements.auditDateInput.value = audit.createdAt || "";
  if (elements.auditOwnerInput) {
    const owner = getUserById(audit.ownerId);
    elements.auditOwnerInput.value = owner?.name || "";
  }
  if (elements.auditTypeSelect) {
    elements.auditTypeSelect.value = audit.auditType || store.auditTypes[0]?.id || "";
  }
  if (elements.auditStoreCodeInput) {
    elements.auditStoreCodeInput.value = audit.storeCode || "";
  }
  if (elements.auditStoreInput) elements.auditStoreInput.value = audit.storeName || "";
  if (elements.auditStoreManagerInput) {
    elements.auditStoreManagerInput.value = audit.storeManagerName || "";
  }
  if (elements.auditStoreManagerEmailInput) {
    elements.auditStoreManagerEmailInput.value = audit.storeManagerEmail || "";
  }
  if (elements.auditRegionalManagerInput) {
    elements.auditRegionalManagerInput.value = audit.regionalManagerName || "";
  }
  if (elements.auditRegionalManagerEmailInput) {
    elements.auditRegionalManagerEmailInput.value = audit.regionalManagerEmail || "";
  }
  if (elements.auditDirectorInput) {
    elements.auditDirectorInput.value = audit.directorName || "";
  }
  if (elements.auditDirectorEmailInput) {
    elements.auditDirectorEmailInput.value = audit.directorEmail || "";
  }
  if (elements.auditAssigneeInput) {
    const primaryAssignee = audit.tasks.find((task) => task.assignedTo)?.assignedTo;
    elements.auditAssigneeInput.value = primaryAssignee || "";
  }
  if (elements.auditBackupAssigneeEmailInput) {
    elements.auditBackupAssigneeEmailInput.value = audit.backupAssigneeEmail || "";
  }
  if (elements.auditDeadlineInput) {
    elements.auditDeadlineInput.value = audit.deadline || audit.tasks[0]?.dueDate || "";
  }
  if (elements.auditReminderInput) {
    elements.auditReminderInput.value = audit.reminderCadenceDays ?? 7;
  }
  if (elements.auditLanguageSelect) {
    elements.auditLanguageSelect.value = getAuditLanguage(audit);
  }
  renderEmailSettingsForm(getAuditLanguage(audit));
  if (elements.auditSummaryInput) {
    elements.auditSummaryInput.value = audit.summary || elements.auditSummaryInput.value;
  }
  applyEscalationRulesToForm(audit.escalationRules);
}

function renderTaskList() {
  elements.taskListRows.innerHTML = "";
  const audit = getSelectedAudit();
  const tasks = getVisibleTasksForAudit(audit);
  const auditorFilter = elements.taskListAuditorFilter?.value || "all";
  const auditOwner = audit ? getUserById(audit.ownerId) : null;
  const filteredTasks =
    auditorFilter === "all" || (auditOwner && auditOwner.id === auditorFilter) ? tasks : [];

  if (!filteredTasks.length) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "table-row";
    emptyRow.innerHTML = "<span>No tasks assigned.</span>";
    elements.taskListRows.appendChild(emptyRow);
    renderSidebarFooter();
    renderSidebarMetrics();
    renderHomeOverview();
    renderAuditList();
    return;
  }

  filteredTasks.forEach((task) => {
    const row = document.createElement("div");
    row.className = "table-row clickable";
    row.innerHTML = `
      <span>${task.title}</span>
      <span>${task.category}</span>
      <span>${formatDate(task.dueDate)}</span>
      <span>${task.assignedTo || "Unassigned"}</span>
      <span><span class="${getStatusBadgeClass(task.status)}">${task.status}</span></span>
    `;
    row.addEventListener("click", () => {
      state.selectedTaskId = task.id;
      renderTaskDetail();
      switchScreen("task-detail");
    });
    elements.taskListRows.appendChild(row);
  });
  renderSidebarFooter();
  renderSidebarMetrics();
  renderHomeOverview();
  renderAuditList();
}

function renderTaskListAuditorFilter() {
  if (!elements.taskListAuditorFilter) return;
  const currentAuditor = elements.taskListAuditorFilter.value || "all";
  elements.taskListAuditorFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All";
  elements.taskListAuditorFilter.appendChild(allOption);

  const auditorIds = new Set();
  users
    .filter((user) => user.role === "auditor")
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((auditor) => {
      const option = document.createElement("option");
      option.value = auditor.id;
      option.textContent = auditor.name;
      elements.taskListAuditorFilter.appendChild(option);
      auditorIds.add(auditor.id);
    });

  elements.taskListAuditorFilter.value = auditorIds.has(currentAuditor) ? currentAuditor : "all";
}

function clampTaskDueDate(value, auditDeadline) {
  if (!auditDeadline || !value) return value;
  if (value > auditDeadline) {
    return auditDeadline;
  }
  return value;
}

function renderTaskDetail() {
  const taskEntry = getTaskEntry(state.selectedTaskId);
  if (!taskEntry) {
    elements.taskTitle.textContent = "";
    elements.taskCategory.textContent = "";
    elements.taskAudit.textContent = "";
    elements.taskDue.textContent = "";
    elements.taskProofRequired.textContent = "";
    elements.taskStatus.textContent = "";
    elements.taskSubmission.textContent = "";
    elements.taskAssignee.textContent = "";
    elements.taskAssigneeEmail.textContent = "";
    elements.reviewerNotes.value = "";
    elements.rejectButton.disabled = true;
    elements.approveButton.disabled = true;
    if (elements.taskDetailDueInput) {
      elements.taskDetailDueInput.value = "";
      elements.taskDetailDueInput.max = "";
      elements.taskDetailDueInput.disabled = true;
    }
    if (elements.taskDetailCategoryInput) {
      elements.taskDetailCategoryInput.innerHTML = "";
      elements.taskDetailCategoryInput.disabled = true;
    }
    if (elements.taskDetailAssigneeInput) {
      elements.taskDetailAssigneeInput.value = "";
      elements.taskDetailAssigneeInput.disabled = true;
    }
    if (elements.taskDetailProofInput) {
      elements.taskDetailProofInput.checked = false;
      elements.taskDetailProofInput.disabled = true;
    }
    if (elements.removeTaskButton) {
      elements.removeTaskButton.disabled = true;
    }
    renderSidebarFooter();
    renderSidebarMetrics();
    return;
  }
  const { audit, task } = taskEntry;
  elements.rejectButton.disabled = false;
  elements.approveButton.disabled = false;
  elements.taskTitle.textContent = task.title;
  elements.taskCategory.textContent = task.category;
  elements.taskAudit.textContent = `${audit.id} · ${audit.storeName}`;
  elements.taskDue.textContent = formatDate(task.dueDate);
  const requiresProof = task.requiresProof !== false;
  elements.taskProofRequired.textContent = requiresProof ? "Yes" : "No";
  elements.taskStatus.textContent = task.status;
  elements.taskSubmission.textContent = task.submissions.length;
  elements.taskAssignee.textContent = task.assignedTo || "Unassigned";
  elements.taskAssigneeEmail.textContent = task.assignedEmail || "";
  elements.reviewerNotes.value = task.reviewerNotes || "";
  if (elements.taskDetailDueInput) {
    elements.taskDetailDueInput.disabled = false;
    const deadline = elements.auditDeadlineInput?.value || audit.deadline || "";
    elements.taskDetailDueInput.max = deadline;
    elements.taskDetailDueInput.value = task.dueDate || "";
  }
  if (elements.taskDetailCategoryInput) {
    elements.taskDetailCategoryInput.disabled = false;
    const categoryOptions = getCategoryOptionsForAudit(audit);
    elements.taskDetailCategoryInput.innerHTML = categoryOptions
      .map(
        (category) =>
          `<option value="${category}" ${task.category === category ? "selected" : ""}>${category}</option>`,
      )
      .join("");
  }
  if (elements.taskDetailAssigneeInput) {
    elements.taskDetailAssigneeInput.disabled = false;
    elements.taskDetailAssigneeInput.value = task.assignedTo || "";
  }
  if (elements.taskDetailProofInput) {
    elements.taskDetailProofInput.disabled = false;
    elements.taskDetailProofInput.checked = task.requiresProof !== false;
  }
  if (elements.removeTaskButton) {
    elements.removeTaskButton.disabled = false;
  }
  renderSidebarFooter();
  renderSidebarMetrics();
}

function renderReviewerQueue() {
  elements.reviewerQueueList.innerHTML = "";
  const accessibleAudits = getAccessibleAudits();
  const pendingSubmission = getLatestPendingSubmission(accessibleAudits);

  if (pendingSubmission) {
    elements.queueAlert.classList.remove("hidden");
    elements.queueAlertText.textContent = `${pendingSubmission.task.title} · ${pendingSubmission.audit.storeName}`;
    elements.queueAlertAction.onclick = () => {
      state.selectedTaskId = pendingSubmission.task.id;
      renderTaskDetail();
      switchScreen("task-detail");
    };
  } else {
    elements.queueAlert.classList.add("hidden");
  }

  accessibleAudits.forEach((audit) => {
    const tasks = getVisibleTasksForAudit(audit);
    tasks.forEach((task) => {
      if (task.status !== TaskStatus.PROOF_SUBMITTED) return;
      const card = document.createElement("div");
      card.className = "queue-card";
      card.innerHTML = `
        <div>
          <h4>${task.title}</h4>
          <p>${audit.storeName} · ${audit.storeCode}</p>
          <p class="muted">${task.submissions.length} submissions</p>
        </div>
        <button class="secondary">Review</button>
      `;
      card.querySelector("button").addEventListener("click", () => {
        state.selectedTaskId = task.id;
        renderTaskDetail();
        switchScreen("task-detail");
      });
      elements.reviewerQueueList.appendChild(card);
    });
  });

  if (!elements.reviewerQueueList.children.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "muted";
    emptyState.textContent = "No proof submissions ready for review.";
    elements.reviewerQueueList.appendChild(emptyState);
  }
  renderSidebarFooter();
  renderSidebarMetrics();
}

function formatBilingualText(value) {
  const en = getLocalizedValue(value, "en");
  const fr = getLocalizedValue(value, "fr");
  if (en && fr) return `${en} / ${fr}`;
  return en || fr || "";
}

function getSelectedAuditType() {
  if (!selectedAuditTypeId) {
    selectedAuditTypeId = store.auditTypes[0]?.id || "";
  }
  return getAuditTypeById(selectedAuditTypeId);
}

function renderAuditTypeLibrary() {
  if (!elements.auditTypeLibrarySelect) return;
  elements.auditTypeLibrarySelect.innerHTML = "";
  store.auditTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = formatBilingualText(type.name);
    elements.auditTypeLibrarySelect.appendChild(option);
  });
  const fallbackType = store.auditTypes[0]?.id || "";
  if (!store.auditTypes.some((type) => type.id === selectedAuditTypeId)) {
    selectedAuditTypeId = fallbackType;
  }
  elements.auditTypeLibrarySelect.value = selectedAuditTypeId;
  const selectedType = getSelectedAuditType();
  if (elements.auditTypeNameInputEn) {
    elements.auditTypeNameInputEn.value = getLocalizedValue(selectedType?.name, "en");
  }
  if (elements.auditTypeNameInputFr) {
    elements.auditTypeNameInputFr.value = getLocalizedValue(selectedType?.name, "fr");
  }
}

function renderAuditTypeSelectOptions() {
  if (!elements.auditTypeSelect) return;
  elements.auditTypeSelect.innerHTML = "";
  store.auditTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = getAuditTypeLabel(type.id, "en") || type.id;
    elements.auditTypeSelect.appendChild(option);
  });
  if (store.auditTypes.length && !elements.auditTypeSelect.value) {
    elements.auditTypeSelect.value = store.auditTypes[0].id;
  }
}

function renderCategoryOptions() {
  if (!elements.taskCategorySelect) return;
  elements.taskCategorySelect.innerHTML = "";
  const auditType = getSelectedAuditType();
  if (!auditType?.categories?.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Add a category to continue";
    elements.taskCategorySelect.appendChild(option);
    elements.taskCategorySelect.disabled = true;
    return;
  }
  elements.taskCategorySelect.disabled = false;
  auditType.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = formatBilingualText(category.name);
    elements.taskCategorySelect.appendChild(option);
  });
  const selectedCategoryId = editingTemplateRef?.categoryId || auditType.categories[0]?.id;
  if (selectedCategoryId) {
    elements.taskCategorySelect.value = selectedCategoryId;
  }
}

function renderCategoryList() {
  if (!elements.categoryList) return;
  elements.categoryList.innerHTML = "";
  const auditType = getSelectedAuditType();
  const canEdit = isAdmin();
  if (!auditType?.categories?.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No categories yet. Add one to start building templates.";
    elements.categoryList.appendChild(empty);
    return;
  }

  auditType.categories.forEach((category) => {
    const row = document.createElement("div");
    row.className = "task-pool-item";
    row.innerHTML = `
      <div class="task-meta">
        <strong>${formatBilingualText(category.name)}</strong>
        <small>${category.tasks.length} tasks</small>
      </div>
      <button class="secondary">Edit</button>
    `;
    const editButton = row.querySelector("button");
    editButton.disabled = !canEdit;
    editButton.addEventListener("click", () => {
      if (!canEdit) return;
      editingCategoryId = category.id;
      if (elements.categoryNameInputEn) {
        elements.categoryNameInputEn.value = getLocalizedValue(category.name, "en");
      }
      if (elements.categoryNameInputFr) {
        elements.categoryNameInputFr.value = getLocalizedValue(category.name, "fr");
      }
      if (elements.saveCategoryButton) {
        elements.saveCategoryButton.textContent = "Update Category";
      }
    });
    elements.categoryList.appendChild(row);
  });
}

function resetCategoryForm() {
  editingCategoryId = "";
  if (elements.categoryNameInputEn) elements.categoryNameInputEn.value = "";
  if (elements.categoryNameInputFr) elements.categoryNameInputFr.value = "";
  if (elements.saveCategoryButton) elements.saveCategoryButton.textContent = "Add Category";
}

function resetTemplateForm() {
  editingTemplateRef = null;
  if (elements.taskTitleInputEn) elements.taskTitleInputEn.value = "";
  if (elements.taskTitleInputFr) elements.taskTitleInputFr.value = "";
  if (elements.taskNotesInputEn) elements.taskNotesInputEn.value = "";
  if (elements.taskNotesInputFr) elements.taskNotesInputFr.value = "";
  if (elements.taskProofRequiredInput) elements.taskProofRequiredInput.checked = true;
  if (elements.addTaskButton) elements.addTaskButton.textContent = "Add Task";
  renderCategoryOptions();
}

function applyTemplateEditorAccess() {
  const canEdit = isAdmin();
  [
    elements.auditTypeNameInputEn,
    elements.auditTypeNameInputFr,
    elements.saveAuditTypeButton,
    elements.addAuditTypeButton,
    elements.categoryNameInputEn,
    elements.categoryNameInputFr,
    elements.saveCategoryButton,
    elements.taskTitleInputEn,
    elements.taskTitleInputFr,
    elements.taskNotesInputEn,
    elements.taskNotesInputFr,
    elements.taskCategorySelect,
    elements.taskProofRequiredInput,
    elements.addTaskButton,
    elements.bulkAddButton,
  ]
    .filter(Boolean)
    .forEach((element) => {
      element.disabled = !canEdit;
    });

  if (elements.auditTypeReadonlyNote) {
    elements.auditTypeReadonlyNote.classList.toggle("hidden", canEdit);
  }
}

function renderTaskTemplatePicker() {
  if (!elements.existingTaskCategory || !elements.existingTaskList) return;
  elements.existingTaskCategory.innerHTML = "";
  elements.existingTaskList.innerHTML = "";
  const audit = getSelectedAudit();
  const templates = getUnassignedTemplates(audit);

  if (!templates.length) {
    const option = document.createElement("option");
    option.textContent = "No templates available";
    option.value = "";
    elements.existingTaskCategory.appendChild(option);
    elements.existingTaskCategory.disabled = true;
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent =
      audit && getAuditTypeTemplates(audit.auditType, getAuditLanguage(audit)).length
        ? "All templates are already assigned to this audit."
        : "No templates are available for this audit type yet.";
    elements.existingTaskList.appendChild(empty);
    return;
  }

  elements.existingTaskCategory.disabled = false;
  const categories = [...new Set(templates.map((template) => template.category))].sort((a, b) =>
    a.localeCompare(b),
  );
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    elements.existingTaskCategory.appendChild(option);
  });

  if (!categories.includes(selectedTemplateCategory)) {
    selectedTemplateCategory = categories[0];
  }
  elements.existingTaskCategory.value = selectedTemplateCategory;

  templates
    .filter((template) => template.category === selectedTemplateCategory)
    .forEach((template) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "task-template-item";
      item.innerHTML = `
        <div>
          <strong>${template.title}</strong>
          <small>${template.category}</small>
        </div>
        <span class="pill">Add</span>
      `;
      item.addEventListener("click", () => {
        if (!audit || audit.tasks.some((task) => task.templateId === template.id)) return;
        assignTemplateToAudit(template.id, audit);
        renderAuditTaskSummary();
        renderTaskList();
        renderReviewerQueue();
        renderTaskTemplatePicker();
        renderTaskPool();
      });
      elements.existingTaskList.appendChild(item);
    });
}

function renderAuditTaskSummary() {
  elements.auditTaskSummary.innerHTML = "";
  const audit = getSelectedAudit();
  const tasks = getTasksForAudit(audit);
  elements.auditTaskCount.textContent = `${tasks.length} tasks`;
  renderTaskTemplatePicker();

  if (!tasks.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No tasks assigned yet.";
    elements.auditTaskSummary.appendChild(empty);
    renderSidebarMetrics();
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "audit-task-pill";
    item.draggable = true;
    item.innerHTML = `
      <span>${task.title}</span>
      <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
    `;

    item.addEventListener("dragstart", () => {
      state.dragTaskId = task.id;
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      state.dragTaskId = null;
      item.classList.remove("dragging");
      document.querySelectorAll(".audit-task-pill").forEach((card) => card.classList.remove("drag-over"));
    });

    item.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (task.id === state.dragTaskId) return;
      item.classList.add("drag-over");
    });

    item.addEventListener("dragleave", () => {
      item.classList.remove("drag-over");
    });

    item.addEventListener("drop", (event) => {
      event.preventDefault();
      item.classList.remove("drag-over");
      if (!state.dragTaskId || state.dragTaskId === task.id) return;
      reorderAuditTasks(audit, state.dragTaskId, task.id);
      renderAuditTaskSummary();
      renderTaskList();
      renderReviewerQueue();
      renderTaskTemplatePicker();
      renderTaskPool();
    });

    item.addEventListener("click", () => {
      state.selectedTaskId = task.id;
      renderTaskDetail();
      switchScreen("task-detail");
    });

    elements.auditTaskSummary.appendChild(item);
  });
  renderSidebarMetrics();
}

function renderTaskPool() {
  elements.taskPoolList.innerHTML = "";
  const auditType = getSelectedAuditType();
  const canEdit = isAdmin();
  if (!auditType) return;
  if (!auditType.categories.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No templates yet. Add a category and create your first task template.";
    elements.taskPoolList.appendChild(empty);
    return;
  }

  auditType.categories.forEach((category) => {
    const header = document.createElement("div");
    header.className = "task-pool-item";
    header.innerHTML = `
      <div class="task-meta">
        <strong>${formatBilingualText(category.name)}</strong>
        <small>${category.tasks.length} templates</small>
      </div>
      <span class="pill">Category</span>
    `;
    elements.taskPoolList.appendChild(header);

    category.tasks.forEach((template) => {
      const poolItem = document.createElement("div");
      poolItem.className = "task-pool-item";
      poolItem.innerHTML = `
        <div class="task-meta">
          <strong>${formatBilingualText(template.title)}</strong>
          <small>${formatBilingualText(category.name)}</small>
          <small class="muted">${formatBilingualText(template.notes)}</small>
        </div>
        <button class="secondary">Edit</button>
      `;
      const editButton = poolItem.querySelector("button");
      editButton.disabled = !canEdit;
      editButton.addEventListener("click", () => {
        if (!canEdit) return;
        editingTemplateRef = { categoryId: category.id, templateId: template.id };
        if (elements.taskTitleInputEn) elements.taskTitleInputEn.value = getLocalizedValue(template.title, "en");
        if (elements.taskTitleInputFr) elements.taskTitleInputFr.value = getLocalizedValue(template.title, "fr");
        if (elements.taskNotesInputEn) elements.taskNotesInputEn.value = getLocalizedValue(template.notes, "en");
        if (elements.taskNotesInputFr) elements.taskNotesInputFr.value = getLocalizedValue(template.notes, "fr");
        if (elements.taskProofRequiredInput) {
          elements.taskProofRequiredInput.checked = template.requiresProof !== false;
        }
        if (elements.addTaskButton) elements.addTaskButton.textContent = "Update Task";
        renderCategoryOptions();
      });
      elements.taskPoolList.appendChild(poolItem);
    });
  });
}

function isAuditOverdue(audit) {
  if (!audit?.tasks?.length) return false;
  return audit.tasks.some((task) => isTaskOverdue(task));
}

function renderHomeOverview() {
  if (!elements.homeOpenAudits || !elements.homeOverdueAudits || !elements.homeAwaitingApproval) return;
  const accessibleAudits = getAccessibleAudits();
  const openAudits = accessibleAudits.filter((audit) => getAuditCompletionStatus(audit) === "Open").length;
  const overdueAudits = accessibleAudits.filter((audit) => isAuditOverdue(audit)).length;
  const awaitingApproval = accessibleAudits
    .flatMap((audit) => audit.tasks)
    .filter((task) => task.status === TaskStatus.PROOF_SUBMITTED).length;

  elements.homeOpenAudits.textContent = openAudits;
  elements.homeOverdueAudits.textContent = overdueAudits;
  elements.homeAwaitingApproval.textContent = awaitingApproval;
}

function renderAuditListFilters() {
  if (!elements.auditListFilterAuditor || !elements.auditListFilterStore) return;
  const accessibleAudits = getAccessibleAudits();
  const currentAuditor = elements.auditListFilterAuditor.value || "all";
  const currentStore = elements.auditListFilterStore.value || "all";

  elements.auditListFilterAuditor.innerHTML = "";
  const auditorAllOption = document.createElement("option");
  auditorAllOption.value = "all";
  auditorAllOption.textContent = "All";
  elements.auditListFilterAuditor.appendChild(auditorAllOption);

  const auditorMap = new Map();
  accessibleAudits.forEach((audit) => {
    const owner = getUserById(audit.ownerId);
    if (owner) {
      auditorMap.set(owner.id, owner.name);
    }
  });

  [...auditorMap.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .forEach(([id, name]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = name;
      elements.auditListFilterAuditor.appendChild(option);
    });

  elements.auditListFilterAuditor.value = auditorMap.has(currentAuditor) ? currentAuditor : "all";

  elements.auditListFilterStore.innerHTML = "";
  const storeAllOption = document.createElement("option");
  storeAllOption.value = "all";
  storeAllOption.textContent = "All";
  elements.auditListFilterStore.appendChild(storeAllOption);

  const storeMap = new Map();
  accessibleAudits.forEach((audit) => {
    storeMap.set(audit.storeCode, audit.storeName);
  });

  [...storeMap.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${name} (${code})`;
      elements.auditListFilterStore.appendChild(option);
    });

  elements.auditListFilterStore.value = storeMap.has(currentStore) ? currentStore : "all";
}

function filterAuditsForAuditList() {
  const statusFilter = elements.auditListFilterStatus?.value || "all";
  const auditorFilter = elements.auditListFilterAuditor?.value || "all";
  const storeFilter = elements.auditListFilterStore?.value || "all";
  const startDate = elements.auditListFilterStart?.value;
  const endDate = elements.auditListFilterEnd?.value;
  const endDateValue = endDate ? new Date(`${endDate}T23:59:59`) : null;

  return getAccessibleAudits().filter((audit) => {
    const status = getAuditCompletionStatus(audit).toLowerCase();
    const overdue = isAuditOverdue(audit);
    const createdAt = new Date(audit.createdAt);

    if (auditorFilter !== "all" && audit.ownerId !== auditorFilter) {
      return false;
    }
    if (storeFilter !== "all" && audit.storeCode !== storeFilter) {
      return false;
    }
    if (statusFilter === "open" && status !== "open") {
      return false;
    }
    if (statusFilter === "completed" && status !== "complete") {
      return false;
    }
    if (statusFilter === "overdue" && !overdue) {
      return false;
    }
    if (startDate && createdAt < new Date(startDate)) {
      return false;
    }
    if (endDateValue && createdAt > endDateValue) {
      return false;
    }
    return true;
  });
}

function renderAuditRows({ container, audits, emptyMessage }) {
  container.innerHTML = "";

  if (!audits.length) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "table-row";
    emptyRow.innerHTML = `
      <span>${emptyMessage}</span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    `;
    container.appendChild(emptyRow);
    return;
  }

  audits.forEach((audit) => {
    const owner = getUserById(audit.ownerId);
    const status = getAuditCompletionStatus(audit);
    const overdue = isAuditOverdue(audit);
    const row = document.createElement("div");
    row.className = "table-row clickable";
    row.innerHTML = `
      <span>${audit.id}</span>
      <span>${audit.storeName}</span>
      <span>${owner ? owner.name : "Unassigned"}</span>
      <span>${audit.tasks.length}</span>
      <span>
        <span class="badge-group">
          <span class="badge">${status}</span>
          ${overdue ? `<span class="badge warning">Overdue</span>` : ""}
        </span>
      </span>
    `;
    row.addEventListener("click", () => {
      state.selectedAuditId = audit.id;
      renderTaskList();
      renderAuditTaskSummary();
      renderStoreManager();
      switchScreen("task-list");
    });
    container.appendChild(row);
  });
}

function renderAuditList() {
  if (!elements.auditListRows) return;
  const filteredAudits = filterAuditsForAuditList();
  renderAuditRows({
    container: elements.auditListRows,
    audits: filteredAudits,
    emptyMessage: "No audits match the filters.",
  });
}

function renderAdminFilters() {
  elements.adminFilterAuditor.innerHTML = "";
  elements.adminFilterStore.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All";
  elements.adminFilterAuditor.appendChild(allOption);

  users
    .filter((user) => user.role === "auditor")
    .forEach((auditor) => {
      const option = document.createElement("option");
      option.value = auditor.id;
      option.textContent = `${auditor.name} (${auditor.region})`;
      elements.adminFilterAuditor.appendChild(option);
    });

  const storeOption = document.createElement("option");
  storeOption.value = "all";
  storeOption.textContent = "All";
  elements.adminFilterStore.appendChild(storeOption);

  store.audits.forEach((audit) => {
    const option = document.createElement("option");
    option.value = audit.id;
    option.textContent = `${audit.storeName} (${audit.storeCode})`;
    elements.adminFilterStore.appendChild(option);
  });
}

function filterAuditsForAdmin() {
  const auditorFilter = elements.adminFilterAuditor.value;
  const storeFilter = elements.adminFilterStore.value;
  const statusFilter = elements.adminFilterStatus.value;
  const startDate = elements.adminFilterStart.value;
  const endDate = elements.adminFilterEnd.value;
  const endDateValue = endDate ? new Date(`${endDate}T23:59:59`) : null;

  return store.audits.filter((audit) => {
    const status = getAuditCompletionStatus(audit).toLowerCase();
    const createdAt = new Date(audit.createdAt);
    if (auditorFilter !== "all" && audit.ownerId !== auditorFilter) {
      return false;
    }
    if (storeFilter !== "all" && audit.id !== storeFilter) {
      return false;
    }
    if (statusFilter !== "all" && status !== statusFilter) {
      return false;
    }
    if (startDate && createdAt < new Date(startDate)) {
      return false;
    }
    if (endDateValue && createdAt > endDateValue) {
      return false;
    }
    return true;
  });
}

function renderAdminOverview() {
  elements.adminAuditRows.innerHTML = "";
  const filteredAudits = filterAuditsForAdmin();

  if (!filteredAudits.length) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "table-row";
    emptyRow.innerHTML = `
      <span>No audits match the filters.</span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    `;
    elements.adminAuditRows.appendChild(emptyRow);
    return;
  }

  filteredAudits.forEach((audit) => {
    const auditor = getUserById(audit.ownerId);
    const row = document.createElement("div");
    row.className = "table-row clickable";
    row.innerHTML = `
      <span>${audit.id}</span>
      <span>${audit.storeName}</span>
      <span>${auditor ? auditor.name : "Unassigned"}</span>
      <span>${audit.tasks.length}</span>
      <span><span class="badge">${getAuditCompletionStatus(audit)}</span></span>
    `;
    row.addEventListener("click", () => {
      state.selectedAuditId = audit.id;
      renderTaskList();
      renderAuditTaskSummary();
      renderStoreManager();
      switchScreen("task-list");
    });
    elements.adminAuditRows.appendChild(row);
  });
}

function renderProfiles() {
  elements.profileList.innerHTML = "";
  const canEditRoles = isAdmin();

  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <div class="profile-card-header">
        <div>
          <strong>${user.name}</strong>
          <div class="profile-meta">${user.email}</div>
        </div>
        <span class="${getRoleBadgeClass(user.role)}">${getRoleLabel(user.role)}</span>
      </div>
      <div class="profile-meta">Region: ${user.region}</div>
      <label class="field">
        Role
        <select data-profile-role="${user.id}" ${canEditRoles ? "" : "disabled"}>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
          <option value="auditor" ${user.role === "auditor" ? "selected" : ""}>Auditor</option>
          <option value="store-manager" ${user.role === "store-manager" ? "selected" : ""}>Store Manager</option>
        </select>
      </label>
    `;

    card.querySelector("select").addEventListener("change", (event) => {
      user.role = event.target.value;
      renderProfiles();
      updateNavigationVisibility();
      renderRoleLayout();
      renderAuditListFilters();
      renderHomeOverview();
      renderAuditList();
      applyTemplateEditorAccess();
    });

    elements.profileList.appendChild(card);
  });
}

function renderRoleLayout() {
  const user = getActiveUser();
  const showStoreManager = user?.role === "store-manager";
  if (elements.rosAdminApp) {
    elements.rosAdminApp.classList.toggle("hidden", showStoreManager);
  }
  if (elements.storeManagerApp) {
    elements.storeManagerApp.classList.toggle("hidden", !showStoreManager);
  }
}

function updateNavigationVisibility() {
  const user = getActiveUser();
  if (!user) return;
  renderRoleLayout();
  const navMap = {
    home: true,
    "audit-list": user.role !== "store-manager",
    "create-audit": user.role !== "store-manager",
    "create-tasks": user.role !== "store-manager",
    "task-list": user.role !== "store-manager",
    "task-detail": user.role !== "store-manager",
    "reviewer-queue": user.role !== "store-manager",
    "store-manager": user.role === "store-manager",
    admin: user.role === "admin",
  };

  navButtons.forEach((button) => {
    const target = button.dataset.screen;
    const visible = navMap[target];
    button.classList.toggle("hidden", !visible);
  });

  document.querySelectorAll(".admin-only").forEach((node) => {
    node.classList.toggle("hidden", !isAdmin());
  });

  const activeButton = navButtons.find((button) => button.classList.contains("active"));
  const activeScreen = activeButton?.dataset.screen;
  if (!activeScreen || !navMap[activeScreen]) {
    const fallbackScreen = user.role === "store-manager" ? "store-manager" : "home";
    switchScreen(fallbackScreen);
  }
}

function reorderAuditTasks(audit, draggedId, targetId) {
  const tasks = [...audit.tasks];
  const draggedIndex = tasks.findIndex((task) => task.id === draggedId);
  const targetIndex = tasks.findIndex((task) => task.id === targetId);
  if (draggedIndex < 0 || targetIndex < 0) return;
  const [draggedTask] = tasks.splice(draggedIndex, 1);
  tasks.splice(targetIndex, 0, draggedTask);
  audit.tasks = tasks;
}

function findCategoryById(auditType, categoryId) {
  if (!auditType) return null;
  return auditType.categories.find((category) => category.id === categoryId);
}

function ensureCategory(auditType, nameEn, nameFr) {
  if (!auditType) return null;
  const normalizedEn = nameEn.trim().toLowerCase();
  const normalizedFr = nameFr.trim().toLowerCase();
  const existing = auditType.categories.find((category) => {
    const categoryEn = getLocalizedValue(category.name, "en").toLowerCase();
    const categoryFr = getLocalizedValue(category.name, "fr").toLowerCase();
    return (normalizedEn && categoryEn === normalizedEn) || (normalizedFr && categoryFr === normalizedFr);
  });
  if (existing) return existing;
  const category = {
    id: generateAuditCategoryId(),
    name: {
      en: nameEn.trim() || nameFr.trim(),
      fr: nameFr.trim() || nameEn.trim(),
    },
    tasks: [],
  };
  auditType.categories.push(category);
  return category;
}

function createTemplate({ titleEn, titleFr, categoryId, notesEn, notesFr, requiresProof }) {
  const auditType = getSelectedAuditType();
  const category = findCategoryById(auditType, categoryId);
  if (!category) return null;
  const trimmedTitleEn = titleEn.trim();
  const trimmedTitleFr = titleFr.trim();
  if (!trimmedTitleEn && !trimmedTitleFr) return null;
  const template = {
    id: generateTemplateId(),
    title: {
      en: trimmedTitleEn || trimmedTitleFr,
      fr: trimmedTitleFr || trimmedTitleEn,
    },
    notes: {
      en: notesEn.trim(),
      fr: notesFr.trim(),
    },
    requiresProof: requiresProof === undefined ? true : requiresProof,
  };
  category.tasks.push(template);
  return template;
}

function assignTemplateToAudit(templateId, audit) {
  if (!audit) return;
  const entry = getAuditTypeTemplateEntry(audit.auditType, templateId);
  if (!entry) return;
  const locale = getAuditLanguage(audit);
  const templateTitle = getLocalizedValue(entry.template.title, locale);
  const templateNotes = getLocalizedValue(entry.template.notes, locale);
  const categoryLabel = getLocalizedValue(entry.category.name, locale);
  const newTask = {
    id: generateAuditTaskId(),
    templateId: entry.template.id,
    title: templateTitle,
    category: categoryLabel,
    dueDate: "",
    assignedTo: "",
    assignedUserId: null,
    assignedEmail: "",
    managerNotes: templateNotes || "",
    requiresProof: entry.template.requiresProof ?? true,
    status: TaskStatus.NOT_STARTED,
    submissions: [],
    pendingProof: {
      notes: "",
      photos: [],
    },
    reviewerNotes: "",
  };
  audit.tasks.push(newTask);
}

function handleAuditEmailSend() {
  const audit = getSelectedAudit();
  if (!audit) return;
  const language = elements.auditLanguageSelect?.value || getAuditLanguage(audit);
  audit.language = language;
  const deadline = elements.auditDeadlineInput?.value || "";
  audit.deadline = deadline;
  const reminderCadenceDays = getReminderCadenceFromInput(audit);
  if (reminderCadenceDays !== null && reminderCadenceDays !== undefined) {
    audit.reminderCadenceDays = reminderCadenceDays;
  }
  if (elements.auditSummaryInput) {
    audit.summary = elements.auditSummaryInput.value.trim();
  }
  const draftAudit = buildAuditDraftFromForm(audit);
  const assignee = getAssigneeFromInput();
  const appLink = buildDefaultAuditLink(draftAudit.id || audit.id);
  Object.assign(audit, draftAudit);
  const template = generateAuditEmailTemplate({
    audit: draftAudit,
    assignee,
    language,
    deadline,
    appLink,
  });
  renderAuditEmailPreview({ audit: draftAudit, assignee, language, deadline, appLink });
  logAuditEmailSend({
    auditId: draftAudit.id || audit.id,
    to: assignee?.email || assignee?.name || "Unassigned",
    language,
    deadline,
    appLink,
    subject: template.subject,
    body: template.body,
  });
  renderAuditEmailSendLog(draftAudit.id || audit.id);
  dispatchMockAuditNotifications({
    audit: draftAudit,
    assignee,
    reminderCadenceDays: draftAudit.reminderCadenceDays,
    deadline,
  });
  renderAuditNotificationLog(draftAudit.id || audit.id);
}

function switchScreen(target) {
  navButtons.forEach((item) => item.classList.toggle("active", item.dataset.screen === target));
  screens.forEach((screen) => {
    screen.classList.toggle("hidden", screen.id !== `screen-${target}`);
  });
  const meta = screenMeta[target];
  if (meta) {
    screenTitle.textContent = meta.title;
    screenSubtitle.textContent = meta.subtitle;
  }
  if (target === "store-manager") {
    syncStoreManagerLocaleFromAudit(getSelectedAudit(), elements.storeManagerLocaleSelect);
    renderStoreManager();
  }
  if (target === "home") {
    renderHomeOverview();
  }
  if (target === "audit-list") {
    renderAuditListFilters();
    renderAuditList();
  }
  if (target === "admin") {
    renderAdminOverview();
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.screen;
    switchScreen(target);
  });
});

if (elements.homeContinueButton) {
  elements.homeContinueButton.addEventListener("click", () => {
    ensureSelectedAudit();
    const selectedAudit = getSelectedAudit();
    if (selectedAudit) {
      populateCreateAuditForm(selectedAudit);
    }
    switchScreen("create-audit");
  });
}

if (elements.homeFindAuditsButton) {
  elements.homeFindAuditsButton.addEventListener("click", () => {
    switchScreen("audit-list");
  });
}

if (elements.newAuditButton) {
  elements.newAuditButton.addEventListener("click", () => {
    resetCreateAuditForm();
    switchScreen("create-audit");
  });
}

if (elements.saveDraftButton) {
  elements.saveDraftButton.addEventListener("click", () => {
    const audit = getSelectedAudit();
    if (!audit) return;
    const language = elements.auditLanguageSelect?.value || getAuditLanguage(audit);
    audit.language = language;
    const deadline = elements.auditDeadlineInput?.value || "";
    audit.deadline = deadline;
    const reminderCadenceDays = getReminderCadenceFromInput(audit);
    if (reminderCadenceDays !== null && reminderCadenceDays !== undefined) {
      audit.reminderCadenceDays = reminderCadenceDays;
    }
    if (elements.auditSummaryInput) {
      audit.summary = elements.auditSummaryInput.value.trim();
    }
    const draftAudit = buildAuditDraftFromForm(audit);
    const assignee = getAssigneeFromInput();
    const appLink = buildDefaultAuditLink(draftAudit.id || audit.id);
    Object.assign(audit, draftAudit);
    renderAuditEmailPreview({ audit: draftAudit, assignee, language, deadline, appLink });
    showDraftAlert("Draft saved locally.");
  });
}

if (elements.existingTaskCategory) {
  elements.existingTaskCategory.addEventListener("change", (event) => {
    selectedTemplateCategory = event.target.value;
    renderTaskTemplatePicker();
  });
}

if (elements.auditTypeLibrarySelect) {
  elements.auditTypeLibrarySelect.addEventListener("change", (event) => {
    selectedAuditTypeId = event.target.value;
    resetCategoryForm();
    resetTemplateForm();
    renderAuditTypeLibrary();
    renderCategoryOptions();
    renderCategoryList();
    renderTaskPool();
  });
}

if (elements.saveAuditTypeButton) {
  elements.saveAuditTypeButton.addEventListener("click", () => {
    const auditType = getSelectedAuditType();
    if (!auditType) return;
    auditType.name = {
      en: elements.auditTypeNameInputEn?.value.trim() || elements.auditTypeNameInputFr?.value.trim() || "",
      fr: elements.auditTypeNameInputFr?.value.trim() || elements.auditTypeNameInputEn?.value.trim() || "",
    };
    renderAuditTypeLibrary();
    renderAuditTypeSelectOptions();
  });
}

if (elements.addAuditTypeButton) {
  elements.addAuditTypeButton.addEventListener("click", () => {
    const newType = {
      id: generateAuditTypeId(),
      name: {
        en: "New audit type",
        fr: "Nouveau type d'audit",
      },
      categories: [],
    };
    store.auditTypes.push(newType);
    selectedAuditTypeId = newType.id;
    renderAuditTypeLibrary();
    renderAuditTypeSelectOptions();
    renderCategoryOptions();
    renderCategoryList();
    renderTaskPool();
  });
}

if (elements.saveCategoryButton) {
  elements.saveCategoryButton.addEventListener("click", () => {
    const auditType = getSelectedAuditType();
    if (!auditType) return;
    const nameEn = elements.categoryNameInputEn?.value || "";
    const nameFr = elements.categoryNameInputFr?.value || "";
    if (!nameEn.trim() && !nameFr.trim()) return;
    if (editingCategoryId) {
      const category = findCategoryById(auditType, editingCategoryId);
      if (!category) return;
      category.name = {
        en: nameEn.trim() || nameFr.trim(),
        fr: nameFr.trim() || nameEn.trim(),
      };
      resetCategoryForm();
    } else {
      ensureCategory(auditType, nameEn, nameFr);
      resetCategoryForm();
    }
    renderCategoryOptions();
    renderCategoryList();
    renderTaskPool();
  });
}

if (elements.auditTypeSelect) {
  elements.auditTypeSelect.addEventListener("change", (event) => {
    const audit = getSelectedAudit();
    if (!audit) return;
    audit.auditType = event.target.value;
    audit.categoryOptions = getCategoryOptionsForAudit(audit);
    renderTaskTemplatePicker();
    renderTaskDetail();
  });
}

elements.addTaskButton.addEventListener("click", () => {
  const titleEn = elements.taskTitleInputEn?.value || "";
  const titleFr = elements.taskTitleInputFr?.value || "";
  const categoryId = elements.taskCategorySelect?.value || "";
  const notesEn = elements.taskNotesInputEn?.value || "";
  const notesFr = elements.taskNotesInputFr?.value || "";
  const requiresProof = elements.taskProofRequiredInput?.checked;
  if (editingTemplateRef) {
    const auditType = getSelectedAuditType();
    const category = findCategoryById(auditType, categoryId || editingTemplateRef.categoryId);
    const template = category?.tasks.find((task) => task.id === editingTemplateRef.templateId);
    if (!category || !template) return;
    template.title = {
      en: titleEn.trim() || titleFr.trim(),
      fr: titleFr.trim() || titleEn.trim(),
    };
    template.notes = {
      en: notesEn.trim(),
      fr: notesFr.trim(),
    };
    template.requiresProof = requiresProof === undefined ? true : requiresProof;
    editingTemplateRef = null;
    if (elements.addTaskButton) elements.addTaskButton.textContent = "Add Task";
  } else {
    const template = createTemplate({ titleEn, titleFr, categoryId, notesEn, notesFr, requiresProof });
    if (!template) return;
  }
  resetTemplateForm();
  renderTaskTemplatePicker();
  renderTaskPool();
});

if (elements.saveContinueButton) {
  elements.saveContinueButton.addEventListener("click", () => {
    handleAuditEmailSend();
  });
}

elements.bulkAddButton.addEventListener("click", () => {
  const chips = document.querySelectorAll("#screen-create-tasks .chip");
  const auditType = getSelectedAuditType();
  if (!auditType) return;
  chips.forEach((chip) => {
    const titleEn = chip.dataset.titleEn || chip.textContent.trim();
    const titleFr = chip.dataset.titleFr || "";
    const notesEn = chip.dataset.notesEn || "";
    const notesFr = chip.dataset.notesFr || "";
    const categoryEn = chip.dataset.categoryEn || chip.dataset.category || "General";
    const categoryFr = chip.dataset.categoryFr || "";
    const category = ensureCategory(auditType, categoryEn, categoryFr);
    if (!category) return;
    const exists = category.tasks.some(
      (task) =>
        getLocalizedValue(task.title, "en").toLowerCase() === titleEn.toLowerCase() ||
        getLocalizedValue(task.title, "fr").toLowerCase() === titleFr.toLowerCase(),
    );
    if (!exists) {
      category.tasks.push({
        id: generateTemplateId(),
        title: {
          en: titleEn,
          fr: titleFr || titleEn,
        },
        notes: {
          en: notesEn,
          fr: notesFr || notesEn,
        },
        requiresProof: true,
      });
    }
  });
  renderTaskTemplatePicker();
  renderCategoryOptions();
  renderCategoryList();
  renderTaskPool();
});

elements.approveButton.addEventListener("click", async () => {
  const reviewerNotes = elements.reviewerNotes.value.trim();
  await api.reviewSubmission({
    taskId: state.selectedTaskId,
    decision: TaskStatus.APPROVED,
    reviewerNotes,
  });
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
});

elements.rejectButton.addEventListener("click", async () => {
  const reviewerNotes = elements.reviewerNotes.value.trim();
  await api.reviewSubmission({
    taskId: state.selectedTaskId,
    decision: TaskStatus.REJECTED,
    reviewerNotes,
  });
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
  switchScreen("task-list");
});

if (elements.taskDetailDueInput) {
  elements.taskDetailDueInput.addEventListener("change", (event) => {
    const taskEntry = getTaskEntry(state.selectedTaskId);
    if (!taskEntry) return;
    const deadline = elements.auditDeadlineInput?.value || taskEntry.audit.deadline || "";
    const clamped = clampTaskDueDate(event.target.value, deadline);
    if (clamped !== event.target.value) {
      event.target.value = clamped;
    }
    taskEntry.task.dueDate = clamped;
    elements.taskDue.textContent = formatDate(clamped);
    renderTaskList();
    renderReviewerQueue();
    renderHomeOverview();
    renderAuditList();
  });
}

if (elements.taskDetailCategoryInput) {
  elements.taskDetailCategoryInput.addEventListener("change", (event) => {
    const taskEntry = getTaskEntry(state.selectedTaskId);
    if (!taskEntry) return;
    taskEntry.task.category = event.target.value;
    elements.taskCategory.textContent = event.target.value;
    renderTaskList();
    renderReviewerQueue();
  });
}

if (elements.taskDetailAssigneeInput) {
  elements.taskDetailAssigneeInput.addEventListener("change", (event) => {
    const taskEntry = getTaskEntry(state.selectedTaskId);
    if (!taskEntry) return;
    const value = event.target.value.trim();
    const match = m365Directory.contacts.find(
      (contact) => contact.displayName === value || contact.email === value,
    );
    taskEntry.task.assignedTo = match?.displayName || value || "Unassigned";
    taskEntry.task.assignedEmail = match?.email || "";
    taskEntry.task.assignedUserId = users.find((user) => user.email === match?.email)?.id || null;
    elements.taskAssignee.textContent = taskEntry.task.assignedTo || "Unassigned";
    elements.taskAssigneeEmail.textContent = taskEntry.task.assignedEmail || "";
    renderTaskList();
    renderStoreManager();
  });
}

if (elements.taskDetailProofInput) {
  elements.taskDetailProofInput.addEventListener("change", (event) => {
    const taskEntry = getTaskEntry(state.selectedTaskId);
    if (!taskEntry) return;
    taskEntry.task.requiresProof = event.target.checked;
    elements.taskProofRequired.textContent = event.target.checked ? "Yes" : "No";
    renderTaskDetail();
    renderStoreManager();
  });
}

if (elements.removeTaskButton) {
  elements.removeTaskButton.addEventListener("click", () => {
    const taskEntry = getTaskEntry(state.selectedTaskId);
    if (!taskEntry) return;
    const { audit, task } = taskEntry;
    audit.tasks = audit.tasks.filter((entry) => entry.id !== task.id);
    state.selectedTaskId = audit.tasks[0]?.id || null;
    renderAuditTaskSummary();
    renderTaskList();
    renderReviewerQueue();
    renderTaskTemplatePicker();
    renderTaskPool();
    renderTaskDetail();
    renderStoreManager();
  });
}

if (elements.generateReportButton) {
  elements.generateReportButton.addEventListener("click", () => {
    if (!isAdmin()) return;
    downloadAuditReport();
  });
}

if (elements.adminMessageReviewerButton) {
  elements.adminMessageReviewerButton.addEventListener("click", () => {
    window.alert("Your message has been queued for the reviewer.");
  });
}

if (elements.storeManagerLocaleSelect) {
  elements.storeManagerLocaleSelect.addEventListener("change", (event) => {
    state.storeManagerLocale = event.target.value;
    state.storeManagerLocaleOverride = true;
    renderStoreManager();
  });
}

if (elements.auditLanguageSelect) {
  elements.auditLanguageSelect.addEventListener("change", (event) => {
    const audit = getSelectedAudit();
    if (!audit) return;
    audit.language = event.target.value;
    renderEmailSettingsForm(audit.language);
    const draftAudit = buildAuditDraftFromForm(audit);
    const assignee = getAssigneeFromInput();
    const deadline = elements.auditDeadlineInput?.value || audit.deadline || "";
    const appLink = buildDefaultAuditLink(draftAudit.id || audit.id);
    renderAuditEmailPreview({
      audit: draftAudit,
      assignee,
      language: audit.language,
      deadline,
      appLink,
    });
  });
}

[
  { element: elements.auditEmailSubjectTemplate, key: "subject" },
  { element: elements.auditEmailGreetingTemplate, key: "greeting" },
  { element: elements.auditEmailIntroTemplate, key: "intro" },
  { element: elements.auditEmailClosingTemplate, key: "closing" },
  { element: elements.auditEmailDetailsLabel, key: "detailsLabel" },
  { element: elements.auditEmailSummaryLabel, key: "summaryLabel" },
  { element: elements.auditEmailTypeLabel, key: "typeLabel" },
  { element: elements.auditEmailTasksLabel, key: "tasksLabel" },
  { element: elements.auditEmailDueLabel, key: "dueLabel" },
  { element: elements.auditEmailLinkLabel, key: "linkLabel" },
  { element: elements.auditEmailAuditorLabel, key: "auditorLabel" },
]
  .filter(({ element }) => element)
  .forEach(({ element, key }) => {
    element.addEventListener("input", (event) => {
      updateEmailTemplateSetting(key, event.target.value);
    });
  });

if (elements.auditStoreCodeInput) {
  elements.auditStoreCodeInput.addEventListener("change", (event) => {
    const contact = getStoreContactByCode(event.target.value);
    if (!contact) return;
    populateStoreContactFields(contact);
  });
}

[elements.adminFilterAuditor, elements.adminFilterStore, elements.adminFilterStatus].forEach((filter) => {
  filter.addEventListener("change", renderAdminOverview);
});

[elements.adminFilterStart, elements.adminFilterEnd].forEach((input) => {
  input.addEventListener("change", renderAdminOverview);
});

[
  elements.auditListFilterStatus,
  elements.auditListFilterAuditor,
  elements.auditListFilterStore,
  elements.auditListFilterStart,
  elements.auditListFilterEnd,
]
  .filter(Boolean)
  .forEach((filter) => {
    filter.addEventListener("change", renderAuditList);
  });

if (elements.taskListAuditorFilter) {
  elements.taskListAuditorFilter.addEventListener("change", renderTaskList);
}

function syncSelectedTask() {
  if (!state.selectedTaskId) return;
  const taskEntry = getTaskEntry(state.selectedTaskId);
  if (!taskEntry) {
    const audit = getSelectedAudit();
    const tasks = getTasksForAudit(audit);
    state.selectedTaskId = tasks[0]?.id || null;
  }
}

function init() {
  renderAssigneeDatalist();
  updateNavigationVisibility();
  renderRoleLayout();
  renderAuditTypeSelectOptions();
  renderAdminFilters();
  renderAuditListFilters();
  renderTaskListAuditorFilter();
  ensureSelectedAudit();
  renderSidebarFooter();
  renderSidebarMetrics();
  syncSelectedTask();
  renderEmailSettingsForm();
  const selectedAudit = getSelectedAudit();
  if (selectedAudit) {
    selectedAuditTypeId = selectedAudit.auditType || store.auditTypes[0]?.id || "";
    populateCreateAuditForm(selectedAudit);
    renderAuditEmailPreview({
      audit: buildAuditDraftFromForm(selectedAudit),
      assignee: getAssigneeFromInput(),
      language: elements.auditLanguageSelect?.value || getAuditLanguage(selectedAudit),
      deadline: elements.auditDeadlineInput?.value || selectedAudit.deadline || "",
      appLink: buildDefaultAuditLink(selectedAudit.id),
    });
    renderAuditEmailSendLog(selectedAudit.id);
    renderAuditNotificationLog(selectedAudit.id);
  }
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
  renderStoreManager();
  renderAuditTaskSummary();
  renderAuditTypeLibrary();
  renderCategoryOptions();
  renderCategoryList();
  renderTaskPool();
  renderAdminOverview();
  renderHomeOverview();
  renderAuditList();
  renderProfiles();
  applyTemplateEditorAccess();
}

init();
