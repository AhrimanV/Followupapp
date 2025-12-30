import {
  TaskStatus,
  m365Directory,
  users,
  store,
  state,
  api,
  ensureSelectedAudit,
  formatDate,
  formatDateRange,
  generateAuditTaskId,
  generateTemplateId,
  generateAuditEmailTemplate,
  getAccessibleAudits,
  getAuditCompletionStatus,
  getEffectiveUser,
  getAuditLanguage,
  getLatestPendingSubmission,
  getRoleBadgeClass,
  getRoleLabel,
  getSelectedAudit,
  getStatusBadgeClass,
  getTaskEntry,
  getTasksForAudit,
  getUnassignedTemplates,
  getUserById,
  getVisibleTasksForAudit,
  isAdmin,
  isViewingAsUser,
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
  taskTitle: document.getElementById("detail-task-title"),
  taskCategory: document.getElementById("detail-task-category"),
  taskAudit: document.getElementById("detail-task-audit"),
  taskDue: document.getElementById("detail-task-due"),
  taskStatus: document.getElementById("detail-task-status"),
  taskSubmission: document.getElementById("detail-task-submission"),
  reviewerNotes: document.getElementById("detail-reviewer-notes"),
  managerNotes: document.getElementById("detail-manager-notes"),
  rejectButton: document.getElementById("reject-task"),
  approveButton: document.getElementById("approve-task"),
  proofNotes: document.getElementById("proof-notes"),
  proofFiles: document.getElementById("proof-files"),
  uploadProof: document.getElementById("upload-proof"),
  submitProof: document.getElementById("submit-proof"),
  proofGallery: document.getElementById("proof-gallery"),
  reviewerFeedback: document.getElementById("reviewer-feedback"),
  reviewerQueueList: document.getElementById("reviewer-queue-list"),
  queueAlert: document.getElementById("queue-alert"),
  queueAlertText: document.getElementById("queue-alert-text"),
  queueAlertAction: document.getElementById("queue-alert-action"),
  managerAuditHeader: document.getElementById("manager-audit-header"),
  managerTaskList: document.getElementById("manager-task-list"),
  existingTaskSelect: document.getElementById("existing-task-select"),
  addExistingTaskButton: document.getElementById("add-existing-task"),
  auditTaskSummary: document.getElementById("audit-task-summary"),
  auditTaskCount: document.getElementById("audit-task-count"),
  taskTitleInput: document.getElementById("task-title-input"),
  taskCategoryInput: document.getElementById("task-category-input"),
  taskNotesInput: document.getElementById("task-notes-input"),
  taskProofRequiredInput: document.getElementById("task-proof-required-input"),
  addTaskButton: document.getElementById("add-task-button"),
  bulkAddButton: document.getElementById("bulk-add-button"),
  taskPoolList: document.getElementById("task-pool-list"),
  taskAssignee: document.getElementById("detail-task-assignee"),
  taskAssigneeEmail: document.getElementById("detail-task-email"),
  taskProofRequired: document.getElementById("detail-task-proof"),
  viewAsSelect: document.getElementById("view-as-select"),
  viewAsBanner: document.getElementById("view-as-banner"),
  generateReportButton: document.getElementById("generate-report-button"),
  storeManagerTitle: document.getElementById("store-manager-title"),
  storeManagerSubtitle: document.getElementById("store-manager-subtitle"),
  storeManagerBanner: document.getElementById("store-manager-banner"),
  storeManagerLocaleSelect: document.getElementById("store-manager-locale"),
  storeManagerLanguageLabel: document.getElementById("store-manager-language-label"),
  adminFilterAuditor: document.getElementById("admin-filter-auditor"),
  adminFilterStore: document.getElementById("admin-filter-store"),
  adminFilterStatus: document.getElementById("admin-filter-status"),
  adminFilterStart: document.getElementById("admin-filter-start"),
  adminFilterEnd: document.getElementById("admin-filter-end"),
  adminAuditRows: document.getElementById("admin-audit-rows"),
  profileList: document.getElementById("profile-list"),
  assigneeList: document.getElementById("assignee-list"),
  exitViewAsButton: document.getElementById("exit-view-as"),
  saveContinueButton: document.getElementById("save-continue-button"),
  auditIdInput: document.getElementById("audit-id-input"),
  auditDateInput: document.getElementById("audit-date-input"),
  auditOwnerInput: document.getElementById("audit-owner-input"),
  auditStoreInput: document.getElementById("audit-store-input"),
  auditAssigneeInput: document.getElementById("audit-assignee-input"),
  auditDeadlineInput: document.getElementById("audit-deadline-input"),
  auditReminderInput: document.getElementById("audit-reminder-input"),
  auditLanguageSelect: document.getElementById("audit-language-select"),
  auditAppLinkInput: document.getElementById("audit-app-link-input"),
  auditSummaryInput: document.getElementById("audit-summary-input"),
  auditPhotosInput: document.getElementById("audit-photos-input"),
  auditEmailPreview: document.getElementById("audit-email-preview"),
  auditEmailSendLog: document.getElementById("audit-email-send-log"),
  auditNotificationLog: document.getElementById("audit-notification-log"),
};

const storeManagerElements = {
  storeManagerBanner: elements.storeManagerBanner,
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

function buildAuditDraftFromForm(audit) {
  const baseAudit = audit || {};
  const ownerLookupValue = elements.auditOwnerInput?.value.trim();
  const ownerMatch = users.find(
    (user) =>
      user.name.toLowerCase() === ownerLookupValue?.toLowerCase() ||
      user.email.toLowerCase() === ownerLookupValue?.toLowerCase(),
  );
  const reminderCadence = getReminderCadenceFromInput(baseAudit);
  return {
    ...baseAudit,
    id: elements.auditIdInput?.value.trim() || baseAudit.id,
    createdAt: elements.auditDateInput?.value || baseAudit.createdAt,
    storeName: elements.auditStoreInput?.value.trim() || baseAudit.storeName,
    ownerId: ownerMatch?.id || baseAudit.ownerId,
    deadline: elements.auditDeadlineInput?.value || baseAudit.deadline,
    reminderCadenceDays: reminderCadence ?? baseAudit.reminderCadenceDays,
    summary: elements.auditSummaryInput?.value.trim() || "",
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
  if (elements.auditAppLinkInput?.value.trim()) {
    return elements.auditAppLinkInput.value.trim();
  }
  const baseUrl = window.location?.origin || "https://followup.contoso.com";
  return `${baseUrl}/app/audits/${auditId}`;
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
    name: assignee?.name || fallbackTask?.assignedTo || "Store Manager",
    email: assignee?.email || fallbackTask?.assignedEmail || "",
    role: "Store Manager",
  };
  const regionalManager = normalizeDirectoryContact(
    m365Directory.contacts.find((contact) => contact.jobTitle === "Regional Manager"),
  );
  const director = normalizeDirectoryContact(
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
  if (elements.auditStoreInput) elements.auditStoreInput.value = audit.storeName || "";
  if (elements.auditAssigneeInput) {
    const primaryAssignee = audit.tasks.find((task) => task.assignedTo)?.assignedTo;
    elements.auditAssigneeInput.value = primaryAssignee || "";
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
  if (elements.auditSummaryInput) {
    elements.auditSummaryInput.value = audit.summary || elements.auditSummaryInput.value;
  }
  if (elements.auditAppLinkInput && !elements.auditAppLinkInput.value) {
    elements.auditAppLinkInput.value = buildDefaultAuditLink(audit.id);
  }
}

function renderTaskList() {
  elements.taskListRows.innerHTML = "";
  const audit = getSelectedAudit();
  const tasks = getVisibleTasksForAudit(audit);

  if (!tasks.length) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "table-row";
    emptyRow.innerHTML = "<span>No tasks assigned.</span>";
    elements.taskListRows.appendChild(emptyRow);
    return;
  }

  tasks.forEach((task) => {
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
    elements.managerNotes.value = "";
    elements.proofNotes.value = "";
    elements.proofGallery.innerHTML = "";
    elements.proofGallery.classList.add("hidden");
    elements.reviewerFeedback.classList.add("hidden");
    elements.reviewerFeedback.textContent = "";
    elements.rejectButton.disabled = true;
    elements.approveButton.disabled = true;
    elements.submitProof.disabled = true;
    elements.uploadProof.disabled = true;
    return;
  }
  const { audit, task } = taskEntry;
  elements.rejectButton.disabled = false;
  elements.approveButton.disabled = false;
  elements.submitProof.disabled = false;
  elements.uploadProof.disabled = false;
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
  elements.managerNotes.value = task.managerNotes || "";
  elements.proofNotes.value = task.pendingProof?.notes || "";
  elements.proofGallery.innerHTML = "";
  elements.proofGallery.classList.toggle("hidden", !requiresProof);

  const submission = task.submissions[task.submissions.length - 1];
  if (requiresProof && submission?.photos?.length) {
    submission.photos.forEach((photo) => {
      const img = document.createElement("div");
      img.className = "gallery-item";
      img.textContent = photo;
      elements.proofGallery.appendChild(img);
    });
  }

  elements.reviewerFeedback.classList.toggle("hidden", task.status !== TaskStatus.REJECTED);
  elements.reviewerFeedback.textContent = task.reviewerNotes || "No reviewer feedback.";
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
}

function renderExistingTaskOptions() {
  elements.existingTaskSelect.innerHTML = "";
  const audit = getSelectedAudit();
  const templates = getUnassignedTemplates(audit);

  if (!templates.length) {
    const option = document.createElement("option");
    option.textContent = "All templates already assigned";
    option.value = "";
    elements.existingTaskSelect.appendChild(option);
    return;
  }

  templates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = `${template.title} · ${template.category}`;
    elements.existingTaskSelect.appendChild(option);
  });
}

function renderAuditTaskSummary() {
  elements.auditTaskSummary.innerHTML = "";
  const audit = getSelectedAudit();
  const tasks = getTasksForAudit(audit);
  elements.auditTaskCount.textContent = `${tasks.length} tasks`;

  if (!tasks.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No tasks assigned yet.";
    elements.auditTaskSummary.appendChild(empty);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("div");
    item.className = "audit-task-card";
    item.draggable = true;
    item.innerHTML = `
      <div class="task-card-header">
        <strong>${task.title}</strong>
        <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
      </div>
      <div class="task-card-grid">
        <label class="field">
          Due date
          <input type="date" data-task-due="${task.id}" value="${task.dueDate || ""}" />
        </label>
        <label class="field">
          Category
          <select data-task-category="${task.id}">
            ${audit.categoryOptions
              .map(
                (category) =>
                  `<option value="${category}" ${
                    task.category === category ? "selected" : ""
                  }>${category}</option>`,
              )
              .join("")}
          </select>
        </label>
        <label class="field">
          Assign to
          <input type="text" list="assignee-list" data-task-assignee="${task.id}" value="${
            task.assignedTo || ""
          }" placeholder="Search M365 contact" />
        </label>
        <label class="field field-inline">
          <input type="checkbox" data-task-proof="${task.id}" ${
            task.requiresProof !== false ? "checked" : ""
          } />
          Proof required
        </label>
      </div>
      <label class="field">
        Manager notes
        <textarea rows="2" data-task-notes="${task.id}" placeholder="Add instructions for the store manager...">${
          task.managerNotes || ""
        }</textarea>
      </label>
      <div class="actions">
        <button class="secondary" data-task-id="${task.id}">Remove from audit</button>
        <span class="muted">Order ${index + 1}</span>
      </div>
    `;

    item.addEventListener("dragstart", () => {
      state.dragTaskId = task.id;
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      state.dragTaskId = null;
      item.classList.remove("dragging");
      document.querySelectorAll(".audit-task-card").forEach((card) => card.classList.remove("drag-over"));
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
      renderTaskPool();
    });

    item.querySelector("[data-task-due]").addEventListener("change", (event) => {
      task.dueDate = event.target.value;
      renderTaskList();
      renderReviewerQueue();
    });

    item.querySelector("[data-task-category]").addEventListener("change", (event) => {
      task.category = event.target.value;
      renderTaskList();
      renderReviewerQueue();
    });

    item.querySelector("[data-task-assignee]").addEventListener("change", (event) => {
      const value = event.target.value.trim();
      const match = m365Directory.contacts.find(
        (contact) => contact.displayName === value || contact.email === value,
      );
      task.assignedTo = match?.displayName || value || "Unassigned";
      task.assignedEmail = match?.email || "";
      task.assignedUserId = users.find((user) => user.email === match?.email)?.id || null;
      renderTaskList();
      renderStoreManager();
    });

    item.querySelector("[data-task-proof]").addEventListener("change", (event) => {
      task.requiresProof = event.target.checked;
      renderTaskDetail();
      renderStoreManager();
    });

    item.querySelector("[data-task-notes]").addEventListener("input", (event) => {
      task.managerNotes = event.target.value;
      renderStoreManager();
    });

    item.querySelector("button[data-task-id]").addEventListener("click", () => {
      audit.tasks = audit.tasks.filter((entry) => entry.id !== task.id);
      renderAuditTaskSummary();
      renderTaskList();
      renderReviewerQueue();
      renderExistingTaskOptions();
      renderTaskPool();
    });

    elements.auditTaskSummary.appendChild(item);
  });
}

function renderTaskPool() {
  elements.taskPoolList.innerHTML = "";

  store.taskTemplates.forEach((template) => {
    const poolItem = document.createElement("div");
    poolItem.className = "task-pool-item";
    poolItem.innerHTML = `
      <div class="task-meta">
        <strong>${template.title}</strong>
        <small>${template.category}</small>
      </div>
      <span class="pill">Template</span>
    `;
    elements.taskPoolList.appendChild(poolItem);
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
  const canEditRoles = isAdmin() && !isViewingAsUser();

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
      renderViewAsOptions();
      updateNavigationVisibility();
      updateStoreManagerViewControls();
      renderRoleLayout();
    });

    elements.profileList.appendChild(card);
  });
}

function renderViewAsOptions() {
  elements.viewAsSelect.innerHTML = "";
  if (!isAdmin()) {
    return;
  }

  const adminOption = document.createElement("option");
  adminOption.value = "";
  adminOption.textContent = "Admin (full access)";
  elements.viewAsSelect.appendChild(adminOption);

  const roleGroups = {
    auditor: {
      label: "ROS Auditors",
      users: [],
    },
    "store-manager": {
      label: "Store Managers",
      users: [],
    },
  };

  users
    .filter((user) => user.role !== "admin")
    .forEach((user) => {
      if (roleGroups[user.role]) {
        roleGroups[user.role].users.push(user);
      }
    });

  Object.values(roleGroups).forEach((group) => {
    if (!group.users.length) return;
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    group.users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.name} · ${getRoleLabel(user.role)} · ${user.region}`;
      optgroup.appendChild(option);
    });
    elements.viewAsSelect.appendChild(optgroup);
  });

  elements.viewAsSelect.value = state.viewAsUserId || "";
}

function updateViewAsBanner() {
  if (isViewingAsUser()) {
    const user = getEffectiveUser();
    const roleLabel = user.role === "auditor" ? "ROS Auditor" : getRoleLabel(user.role);
    elements.viewAsBanner.innerHTML = `
      Viewing as ${user.name}
      <span class="role-pill ${user.role}">${roleLabel}</span>
      <span class="muted">· Navigation and tasks reflect this perspective.</span>
    `;
    elements.viewAsBanner.classList.remove("hidden");
  } else {
    elements.viewAsBanner.textContent = "";
    elements.viewAsBanner.classList.add("hidden");
  }
}

function updateStoreManagerViewControls() {
  if (!elements.exitViewAsButton) return;
  const shouldShow = isAdmin() && isViewingAsUser();
  elements.exitViewAsButton.classList.toggle("hidden", !shouldShow);
}

function renderRoleLayout() {
  const user = getEffectiveUser();
  const showStoreManager = user?.role === "store-manager";
  if (elements.rosAdminApp) {
    elements.rosAdminApp.classList.toggle("hidden", showStoreManager);
  }
  if (elements.storeManagerApp) {
    elements.storeManagerApp.classList.toggle("hidden", !showStoreManager);
  }
}

function updateNavigationVisibility() {
  const user = getEffectiveUser();
  if (!user) return;
  renderRoleLayout();
  const navMap = {
    home: true,
    "create-audit": user.role !== "store-manager",
    "create-tasks": user.role !== "store-manager",
    "task-list": user.role !== "store-manager",
    "task-detail": user.role !== "store-manager",
    "reviewer-queue": user.role !== "store-manager",
    "store-manager": user.role === "store-manager",
    admin: user.role === "admin" && !isViewingAsUser(),
  };

  navButtons.forEach((button) => {
    const target = button.dataset.screen;
    const visible = navMap[target];
    button.classList.toggle("hidden", !visible);
  });

  document.querySelectorAll(".admin-only").forEach((node) => {
    node.classList.toggle("hidden", !isAdmin() || isViewingAsUser());
  });

  const activeButton = navButtons.find((button) => button.classList.contains("active"));
  const activeScreen = activeButton?.dataset.screen;
  if (!activeScreen || !navMap[activeScreen]) {
    const fallbackScreen = user.role === "store-manager" ? "store-manager" : "home";
    switchScreen(fallbackScreen);
  }
}

function applyViewAsChange(userId) {
  state.viewAsUserId = userId || null;
  ensureSelectedAudit();
  updateNavigationVisibility();
  updateViewAsBanner();
  updateStoreManagerViewControls();
  renderRoleLayout();
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
  renderStoreManager();
  renderAuditTaskSummary();
  renderExistingTaskOptions();
  renderAdminOverview();
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

function createTemplate({ title, category, notes, requiresProof }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return null;
  const id = generateTemplateId();
  const template = {
    id,
    title: trimmedTitle,
    category: category.trim() || "General",
    notes: notes.trim() || "",
    requiresProof: requiresProof === undefined ? true : requiresProof,
  };
  store.taskTemplates.push(template);
  return template;
}

function assignTemplateToAudit(templateId, audit) {
  const template = store.taskTemplates.find((entry) => entry.id === templateId);
  if (!template || !audit) return;
  const newTask = {
    id: generateAuditTaskId(),
    templateId: template.id,
    title: template.title,
    category: template.category,
    dueDate: "",
    assignedTo: "",
    assignedUserId: null,
    assignedEmail: "",
    managerNotes: template.notes || "",
    requiresProof: template.requiresProof ?? true,
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
  if (elements.auditAppLinkInput) {
    elements.auditAppLinkInput.value = appLink;
  }
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

elements.addExistingTaskButton.addEventListener("click", () => {
  const audit = getSelectedAudit();
  const templateId = elements.existingTaskSelect.value;
  if (!templateId || !audit) return;
  if (audit.tasks.some((task) => task.templateId === templateId)) return;
  assignTemplateToAudit(templateId, audit);
  renderAuditTaskSummary();
  renderTaskList();
  renderReviewerQueue();
  renderExistingTaskOptions();
  renderTaskPool();
});

elements.addTaskButton.addEventListener("click", () => {
  const title = elements.taskTitleInput.value;
  const category = elements.taskCategoryInput.value;
  const notes = elements.taskNotesInput.value;
  const requiresProof = elements.taskProofRequiredInput?.checked;
  const template = createTemplate({ title, category, notes, requiresProof });
  if (!template) return;
  elements.taskTitleInput.value = "";
  elements.taskCategoryInput.value = "";
  elements.taskNotesInput.value = "";
  if (elements.taskProofRequiredInput) {
    elements.taskProofRequiredInput.checked = true;
  }
  renderExistingTaskOptions();
  renderTaskPool();
});

if (elements.saveContinueButton) {
  elements.saveContinueButton.addEventListener("click", () => {
    handleAuditEmailSend();
  });
}

elements.bulkAddButton.addEventListener("click", () => {
  const chips = document.querySelectorAll("#screen-create-tasks .chip");
  chips.forEach((chip) => {
    const title = chip.textContent.trim();
    const category = chip.dataset.category || "General";
    const exists = store.taskTemplates.some((template) => template.title === title);
    if (!exists) {
      createTemplate({ title, category, notes: "", requiresProof: true });
    }
  });
  renderExistingTaskOptions();
  renderTaskPool();
});

elements.uploadProof.addEventListener("click", async () => {
  const taskId = state.selectedTaskId;
  const notes = elements.proofNotes.value.trim();
  const photos = Array.from(elements.proofFiles.files || []).map((file) => file.name);
  await api.uploadProof({ taskId, notes, photos });
  renderTaskDetail();
});

elements.submitProof.addEventListener("click", async () => {
  await api.submitProof({ taskId: state.selectedTaskId });
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
  switchScreen("reviewer-queue");
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

elements.managerNotes.addEventListener("input", (event) => {
  const taskEntry = getTaskEntry(state.selectedTaskId);
  if (!taskEntry) return;
  taskEntry.task.managerNotes = event.target.value;
  renderStoreManager();
});

elements.viewAsSelect.addEventListener("change", (event) => {
  if (!isAdmin()) return;
  applyViewAsChange(event.target.value);
});

if (elements.generateReportButton) {
  elements.generateReportButton.addEventListener("click", () => {
    if (!isAdmin() || isViewingAsUser()) return;
    downloadAuditReport();
  });
}

if (elements.exitViewAsButton) {
  elements.exitViewAsButton.addEventListener("click", () => {
    applyViewAsChange(null);
    if (elements.viewAsSelect) {
      elements.viewAsSelect.value = "";
    }
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

[elements.adminFilterAuditor, elements.adminFilterStore, elements.adminFilterStatus].forEach((filter) => {
  filter.addEventListener("change", renderAdminOverview);
});

[elements.adminFilterStart, elements.adminFilterEnd].forEach((input) => {
  input.addEventListener("change", renderAdminOverview);
});

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
  renderViewAsOptions();
  updateNavigationVisibility();
  updateViewAsBanner();
  updateStoreManagerViewControls();
  renderRoleLayout();
  renderAdminFilters();
  ensureSelectedAudit();
  syncSelectedTask();
  const selectedAudit = getSelectedAudit();
  if (selectedAudit) {
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
  renderExistingTaskOptions();
  renderAuditTaskSummary();
  renderTaskPool();
  renderAdminOverview();
  renderProfiles();
}

init();
