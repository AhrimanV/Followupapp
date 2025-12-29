const navButtons = document.querySelectorAll(".nav-item");
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

const TaskStatus = {
  NOT_STARTED: "Not Started",
  PROOF_SUBMITTED: "Proof Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const m365Directory = {
  accessMode: "imported",
  lastSync: "2025-02-19T14:20:00Z",
  securityNote: "Graph API access is restricted in this environment.",
  contacts: [
    {
      id: "m365-001",
      displayName: "Sam Thompson",
      email: "sam.thompson@contoso.com",
      jobTitle: "Store Manager",
      location: "Toronto Midtown",
    },
    {
      id: "m365-002",
      displayName: "Morgan Lee",
      email: "morgan.lee@contoso.com",
      jobTitle: "Store Manager",
      location: "Montreal East",
    },
    {
      id: "m365-003",
      displayName: "Kelly Rodgers",
      email: "kelly.rodgers@contoso.com",
      jobTitle: "Regional Manager",
      location: "Ontario",
    },
    {
      id: "m365-004",
      displayName: "Jamie Chen",
      email: "jamie.chen@contoso.com",
      jobTitle: "Audit Lead",
      location: "Audit Program",
    },
    {
      id: "m365-005",
      displayName: "Priya Nair",
      email: "priya.nair@contoso.com",
      jobTitle: "Compliance Analyst",
      location: "Toronto Midtown",
    },
    {
      id: "m365-006",
      displayName: "Taylor Rivers",
      email: "taylor.rivers@contoso.com",
      jobTitle: "Regional Operations Supervisor",
      location: "Quebec",
    },
    {
      id: "m365-007",
      displayName: "Guillaume Veillette",
      email: "guillaume.veillette@bell.ca",
      jobTitle: "Audit Director",
      location: "Quebec",
    },
  ],
};

const users = [
  {
    id: "usr-admin",
    name: "Kelly Rodgers",
    email: "kelly.rodgers@contoso.com",
    role: "admin",
    region: "Ontario",
  },
  {
    id: "usr-admin-2",
    name: "Guillaume Veillette",
    email: "guillaume.veillette@bell.ca",
    role: "admin",
    region: "Quebec",
  },
  {
    id: "usr-ros1",
    name: "Jamie Chen",
    email: "jamie.chen@contoso.com",
    role: "auditor",
    region: "ROS 1",
  },
  {
    id: "usr-ros2",
    name: "Taylor Rivers",
    email: "taylor.rivers@contoso.com",
    role: "auditor",
    region: "ROS 2",
  },
  {
    id: "usr-ros3",
    name: "Priya Nair",
    email: "priya.nair@contoso.com",
    role: "auditor",
    region: "ROS 3",
  },
  {
    id: "usr-sm1",
    name: "Sam Thompson",
    email: "sam.thompson@contoso.com",
    role: "store-manager",
    region: "Toronto Midtown",
  },
  {
    id: "usr-sm2",
    name: "Morgan Lee",
    email: "morgan.lee@contoso.com",
    role: "store-manager",
    region: "Montreal East",
  },
];

const m365UsersByName = new Map(m365Directory.contacts.map((contact) => [contact.displayName, contact]));

const store = {
  taskTemplates: [
    {
      id: "TPL-1001",
      title: "Emergency exit signage",
      category: "Loss Prevention",
      notes: "Ensure all emergency exits have clear signage and no obstructions.",
    },
    {
      id: "TPL-1002",
      title: "Stock room labeling",
      category: "Store Appearance",
      notes: "Label aisles, bays, and supply zones with updated signage.",
    },
    {
      id: "TPL-1003",
      title: "Fire extinguisher inspection",
      category: "Safety",
      notes: "Verify inspection tags, pressure gauges, and access paths.",
    },
    {
      id: "TPL-1004",
      title: "Back room exit lighting",
      category: "Safety",
      notes: "Check emergency lighting fixtures and replace bulbs if needed.",
    },
    {
      id: "TPL-1005",
      title: "Safety poster refresh",
      category: "Store Appearance",
      notes: "Update compliance posters and ensure they are visible to staff.",
    },
  ],
  audits: [
    {
      id: "AUD-2025-001",
      storeCode: "ON-204",
      storeName: "Toronto Midtown",
      createdAt: "2025-02-12",
      ownerId: "usr-ros1",
      language: "en",
      categoryOptions: ["Store Appearance", "Loss Prevention", "QPU", "Safety"],
      tasks: [
        {
          id: "AT-2001",
          templateId: "TPL-1001",
          title: "Emergency exit signage",
          category: "Loss Prevention",
          dueDate: "2025-03-01",
          assignedTo: "Sam Thompson",
          assignedUserId: "usr-sm1",
          assignedEmail: "sam.thompson@contoso.com",
          managerNotes: "Keep exit door area fully clear and mark floor decals.",
          status: TaskStatus.NOT_STARTED,
          submissions: [],
          pendingProof: {
            notes: "",
            photos: [],
          },
          reviewerNotes: "",
        },
        {
          id: "AT-2002",
          templateId: "TPL-1002",
          title: "Stock room labeling",
          category: "Store Appearance",
          dueDate: "2025-02-28",
          assignedTo: "Sam Thompson",
          assignedUserId: "usr-sm1",
          assignedEmail: "sam.thompson@contoso.com",
          managerNotes: "Include new SKU labels for seasonal racks.",
          status: TaskStatus.NOT_STARTED,
          submissions: [],
          pendingProof: {
            notes: "",
            photos: [],
          },
          reviewerNotes: "",
        },
        {
          id: "AT-2003",
          templateId: "TPL-1003",
          title: "Fire extinguisher inspection",
          category: "Safety",
          dueDate: "2025-03-03",
          assignedTo: "Sam Thompson",
          assignedUserId: "usr-sm1",
          assignedEmail: "sam.thompson@contoso.com",
          managerNotes: "Document inspection stickers for all units.",
          status: TaskStatus.PROOF_SUBMITTED,
          submissions: [
            {
              id: "SUB-2",
              submittedAt: "2025-02-15T11:32:00Z",
              status: TaskStatus.PROOF_SUBMITTED,
              notes: "Updated tags for back room units.",
              photos: ["IMG_1024.jpg", "IMG_1025.jpg", "IMG_1026.jpg"],
              reviewerNotes: "",
            },
          ],
          pendingProof: {
            notes: "",
            photos: [],
          },
          reviewerNotes: "",
        },
      ],
    },
    {
      id: "AUD-2025-002",
      storeCode: "QC-118",
      storeName: "Montreal East",
      createdAt: "2025-02-15",
      ownerId: "usr-ros2",
      language: "fr",
      categoryOptions: ["Store Appearance", "Loss Prevention", "QPU", "Safety"],
      tasks: [
        {
          id: "AT-2004",
          templateId: "TPL-1004",
          title: "Back room exit lighting",
          category: "Safety",
          dueDate: "2025-03-06",
          assignedTo: "Morgan Lee",
          assignedUserId: "usr-sm2",
          assignedEmail: "morgan.lee@contoso.com",
          managerNotes: "Confirm fixtures near loading bay.",
          status: TaskStatus.PROOF_SUBMITTED,
          submissions: [
            {
              id: "SUB-1",
              submittedAt: "2025-02-18T15:10:00Z",
              status: TaskStatus.PROOF_SUBMITTED,
              notes: "Installed new fixtures near loading bay.",
              photos: ["IMG_2041.jpg", "IMG_2042.jpg"],
              reviewerNotes: "",
            },
          ],
          pendingProof: {
            notes: "",
            photos: [],
          },
          reviewerNotes: "",
        },
        {
          id: "AT-2005",
          templateId: "TPL-1005",
          title: "Safety poster refresh",
          category: "Store Appearance",
          dueDate: "2025-03-08",
          assignedTo: "Morgan Lee",
          assignedUserId: "usr-sm2",
          assignedEmail: "morgan.lee@contoso.com",
          managerNotes: "Update posters in break room and stock room.",
          status: TaskStatus.APPROVED,
          submissions: [
            {
              id: "SUB-1",
              submittedAt: "2025-02-16T09:18:00Z",
              status: TaskStatus.APPROVED,
              notes: "Updated posters in break room and back office.",
              photos: ["IMG_2100.jpg"],
              reviewerNotes: "Looks good.",
            },
          ],
          pendingProof: {
            notes: "",
            photos: [],
          },
          reviewerNotes: "Looks good.",
        },
      ],
    },
  ],
};

const state = {
  selectedAuditId: "AUD-2025-001",
  selectedTaskId: "AT-2003",
  selectedAssignee: null,
  activeUserId: "usr-admin",
  viewAsUserId: null,
  dragTaskId: null,
  storeManagerLocale: "en",
  storeManagerLocaleOverride: false,
};

const elements = {
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
  addTaskButton: document.getElementById("add-task-button"),
  bulkAddButton: document.getElementById("bulk-add-button"),
  taskPoolList: document.getElementById("task-pool-list"),
  taskAssignee: document.getElementById("detail-task-assignee"),
  taskAssigneeEmail: document.getElementById("detail-task-email"),
  viewAsSelect: document.getElementById("view-as-select"),
  viewAsBanner: document.getElementById("view-as-banner"),
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
  profileList: document.getElementById("profile-list"),
  assigneeList: document.getElementById("assignee-list"),
};

const storeManagerLocaleContent = {
  en: {
    screenTitle: "My Assigned Tasks",
    screenSubtitle: "Upload proof and submit tasks to the reviewer queue.",
    languageLabel: "Language",
    languageEnglish: "English",
    languageFrench: "French",
    currentAuditLabel: "Current audit",
    noAuditTitle: "No audit selected",
    noAuditBody: "Assign an audit to view store manager tasks.",
    managerBadge: "Store Manager",
    tasksCount: (count) => `${count} tasks`,
    duePrefix: "Due",
    overdueLabel: "Overdue",
    managerNotesLabel: "Manager notes:",
    reviewerNotesLabel: "Reviewer notes:",
    proofUploadLabel: "Proof upload",
    notesToReviewerLabel: "Notes to reviewer",
    notesPlaceholder: "Add context for the reviewer...",
    actionCompleted: "Completed",
    actionSubmitted: "Submitted",
    actionResubmit: "Resubmit Proof",
    actionSubmit: "Submit Proof",
    submissionCount: (count) => `Submission #${count}`,
    noTasksAssigned: "No tasks assigned to you for this audit.",
  },
  fr: {
    screenTitle: "Mes tâches assignées",
    screenSubtitle: "Téléversez des preuves et soumettez les tâches à la file de révision.",
    languageLabel: "Langue",
    languageEnglish: "Anglais",
    languageFrench: "Français",
    currentAuditLabel: "Audit en cours",
    noAuditTitle: "Aucun audit sélectionné",
    noAuditBody: "Assignez un audit pour voir les tâches du gérant.",
    managerBadge: "Gérant de magasin",
    tasksCount: (count) => `${count} tâches`,
    duePrefix: "Échéance",
    overdueLabel: "En retard",
    managerNotesLabel: "Notes du responsable :",
    reviewerNotesLabel: "Notes du réviseur :",
    proofUploadLabel: "Téléversement des preuves",
    notesToReviewerLabel: "Notes au réviseur",
    notesPlaceholder: "Ajoutez du contexte pour le réviseur...",
    actionCompleted: "Terminé",
    actionSubmitted: "Soumis",
    actionResubmit: "Renvoyer la preuve",
    actionSubmit: "Soumettre la preuve",
    submissionCount: (count) => `Soumission nº${count}`,
    noTasksAssigned: "Aucune tâche ne vous est assignée pour cet audit.",
  },
};

const api = {
  async uploadProof({ taskId, notes, photos }) {
    const taskEntry = getTaskEntry(taskId);
    if (!taskEntry) return null;
    taskEntry.task.pendingProof = {
      notes: notes || "",
      photos: photos || [],
    };
    return taskEntry.task;
  },
  async submitProof({ taskId }) {
    const taskEntry = getTaskEntry(taskId);
    if (!taskEntry) return null;
    const task = taskEntry.task;
    const proof = task.pendingProof;
    const nextId = `SUB-${task.submissions.length + 1}`;
    const submission = {
      id: nextId,
      submittedAt: new Date().toISOString(),
      status: TaskStatus.PROOF_SUBMITTED,
      notes: proof.notes,
      photos: proof.photos,
      reviewerNotes: "",
    };
    task.submissions.push(submission);
    task.status = TaskStatus.PROOF_SUBMITTED;
    task.reviewerNotes = "";
    task.pendingProof = { notes: "", photos: [] };
    return submission;
  },
  async reviewSubmission({ taskId, decision, reviewerNotes }) {
    const taskEntry = getTaskEntry(taskId);
    if (!taskEntry) return null;
    const task = taskEntry.task;
    const latestSubmission = task.submissions[task.submissions.length - 1];
    if (!latestSubmission) {
      throw new Error("No submission found for task.");
    }
    latestSubmission.status = decision;
    latestSubmission.reviewerNotes = reviewerNotes;
    task.status = decision;
    task.reviewerNotes = reviewerNotes;
    return task;
  },
};

function getM365SourceLabel() {
  return m365Directory.accessMode === "graph" ? "Microsoft Graph API" : "Imported contact list";
}

function getM365SourceHint() {
  const lastSync = m365Directory.lastSync
    ? `Last sync ${new Date(m365Directory.lastSync).toLocaleString("en-US")}.`
    : "";
  const securityNote = m365Directory.accessMode === "graph" ? "" : m365Directory.securityNote;
  return [getM365SourceLabel(), lastSync, securityNote].filter(Boolean).join(" ");
}

function getUserById(id) {
  return users.find((user) => user.id === id) || null;
}

function getActiveUser() {
  return getUserById(state.activeUserId);
}

function getEffectiveUser() {
  return state.viewAsUserId ? getUserById(state.viewAsUserId) : getActiveUser();
}

function isAdmin() {
  return getActiveUser()?.role === "admin";
}

function isViewingAsUser() {
  return Boolean(state.viewAsUserId);
}

function getRoleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "auditor") return "Auditor";
  return "Store Manager";
}

function detectAuditLanguage(audit) {
  if (!audit) return "en";
  const frenchSignals = [
    "sécurité",
    "preuve",
    "affichage",
    "étiquette",
    "sortie",
    "audit",
    "révision",
    "tâche",
  ];
  const combinedText = [
    audit.storeName,
    audit.storeCode,
    ...(audit.tasks || []).flatMap((task) => [task.title, task.managerNotes, task.reviewerNotes]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return frenchSignals.some((signal) => combinedText.includes(signal)) ? "fr" : "en";
}

function getAuditLanguage(audit) {
  if (!audit) return "en";
  return audit.language || detectAuditLanguage(audit);
}

function getStoreManagerStrings() {
  return storeManagerLocaleContent[state.storeManagerLocale] || storeManagerLocaleContent.en;
}

function syncStoreManagerLocaleFromAudit() {
  if (state.storeManagerLocaleOverride) return;
  const auditLocale = getAuditLanguage(getSelectedAudit());
  state.storeManagerLocale = auditLocale;
  if (elements.storeManagerLocaleSelect) {
    elements.storeManagerLocaleSelect.value = auditLocale;
  }
}

function getAuditById(auditId) {
  return store.audits.find((audit) => audit.id === auditId) || null;
}

function getTaskEntry(taskId) {
  for (const audit of store.audits) {
    const task = audit.tasks.find((entry) => entry.id === taskId);
    if (task) {
      return { audit, task };
    }
  }
  return null;
}

function getSelectedAudit() {
  return getAuditById(state.selectedAuditId);
}

function getAccessibleAudits() {
  const user = getEffectiveUser();
  if (!user) return [];
  if (user.role === "admin") return store.audits;
  if (user.role === "auditor") {
    return store.audits.filter((audit) => audit.ownerId === user.id);
  }
  if (user.role === "store-manager") {
    return store.audits.filter((audit) =>
      audit.tasks.some((task) => task.assignedUserId === user.id),
    );
  }
  return store.audits;
}

function getTasksForAudit(audit) {
  if (!audit) return [];
  return audit.tasks;
}

function getVisibleTasksForAudit(audit) {
  const user = getEffectiveUser();
  const tasks = getTasksForAudit(audit);
  if (!user) return [];
  if (user.role === "store-manager") {
    return tasks.filter((task) => task.assignedUserId === user.id);
  }
  return tasks;
}

function getLatestPendingSubmission(audits) {
  const pendingSubmissions = [];
  audits.forEach((audit) => {
    const auditTasks = getTasksForAudit(audit);
    auditTasks.forEach((task) => {
      const latestSubmission = task.submissions[task.submissions.length - 1];
      if (task.status === TaskStatus.PROOF_SUBMITTED && latestSubmission) {
        pendingSubmissions.push({ audit, task, submission: latestSubmission });
      }
    });
  });
  if (!pendingSubmissions.length) return null;
  return pendingSubmissions.reduce((latest, entry) => {
    if (!latest) return entry;
    return new Date(entry.submission.submittedAt) > new Date(latest.submission.submittedAt)
      ? entry
      : latest;
  }, null);
}

function getUnassignedTemplates(audit) {
  if (!audit) return store.taskTemplates;
  return store.taskTemplates.filter(
    (template) => !audit.tasks.some((task) => task.templateId === template.id),
  );
}

function generateTemplateId() {
  const maxId = store.taskTemplates.reduce((max, template) => {
    const match = template.id.match(/TPL-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 1000);
  return `TPL-${String(maxId + 1).padStart(4, "0")}`;
}

function generateAuditTaskId() {
  const tasks = store.audits.flatMap((audit) => audit.tasks);
  const maxId = tasks.reduce((max, task) => {
    const match = task.id.match(/AT-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 2000);
  return `AT-${String(maxId + 1).padStart(4, "0")}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getStatusBadgeClass(status) {
  if (status === TaskStatus.PROOF_SUBMITTED || status === TaskStatus.APPROVED) {
    return "badge success";
  }
  if (status === TaskStatus.REJECTED) {
    return "badge danger";
  }
  return "badge";
}

function isTaskOverdue(task) {
  if (!task?.dueDate) return false;
  if (task.status === TaskStatus.APPROVED) return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function formatDateRange(dates) {
  const validDates = dates
    .map((date) => (date ? new Date(date) : null))
    .filter((date) => date && !Number.isNaN(date.valueOf()));
  if (!validDates.length) return "No due dates";
  const sortedDates = validDates.sort((a, b) => a - b);
  const start = sortedDates[0];
  const end = sortedDates[sortedDates.length - 1];
  if (start.toDateString() === end.toDateString()) {
    return `Due ${formatDate(start)}`;
  }
  return `Due window ${formatDate(start)} - ${formatDate(end)}`;
}

function getAuditCompletionStatus(audit) {
  if (!audit.tasks.length) return "Open";
  const allApproved = audit.tasks.every((task) => task.status === TaskStatus.APPROVED);
  return allApproved ? "Complete" : "Open";
}

function getRoleBadgeClass(role) {
  if (role === "admin") return "role-pill admin";
  if (role === "auditor") return "role-pill auditor";
  return "role-pill store-manager";
}

function renderAssigneeDatalist() {
  elements.assigneeList.innerHTML = "";
  m365Directory.contacts.forEach((contact) => {
    const option = document.createElement("option");
    option.value = contact.displayName;
    elements.assigneeList.appendChild(option);
    const emailOption = document.createElement("option");
    emailOption.value = contact.email;
    elements.assigneeList.appendChild(emailOption);
  });
}

function renderTaskList() {
  elements.taskListRows.innerHTML = "";
  const audit = getSelectedAudit();
  const auditTasks = getVisibleTasksForAudit(audit);

  if (!auditTasks.length) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "table-row";
    emptyRow.innerHTML = `
      <span>No tasks assigned to this audit yet.</span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    `;
    elements.taskListRows.appendChild(emptyRow);
    return;
  }

  auditTasks.forEach((task) => {
    const row = document.createElement("div");
    row.className = "table-row clickable";
    row.dataset.taskId = task.id;
    row.innerHTML = `
      <span>${task.title}</span>
      <span>${task.category || "-"}</span>
      <span>${formatDate(task.dueDate)}</span>
      <span>${task.assignedTo || "Unassigned"}</span>
      <span>
        <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
        ${
          task.status === TaskStatus.REJECTED && task.reviewerNotes
            ? `<span class="subtext">Reviewer: ${task.reviewerNotes}</span>`
            : ""
        }
      </span>
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
    elements.taskTitle.textContent = "-";
    elements.taskCategory.textContent = "-";
    elements.taskAudit.textContent = "-";
    elements.taskDue.textContent = "-";
    elements.taskAssignee.textContent = "-";
    elements.taskAssigneeEmail.textContent = "-";
    elements.taskStatus.textContent = "-";
    elements.taskStatus.className = "";
    elements.taskSubmission.textContent = "-";
    elements.reviewerNotes.value = "";
    elements.managerNotes.value = "";
    elements.proofNotes.value = "";
    elements.proofGallery.innerHTML = "";
    elements.reviewerFeedback.textContent = "";
    elements.reviewerFeedback.classList.remove("visible");
    return;
  }
  const { task, audit } = taskEntry;
  const latestSubmission = task.submissions[task.submissions.length - 1];
  elements.taskTitle.textContent = task.title;
  elements.taskCategory.textContent = task.category || "-";
  elements.taskAudit.textContent = `${audit.id} · ${audit.storeCode}`;
  elements.taskDue.textContent = formatDate(task.dueDate);
  elements.taskAssignee.textContent = task.assignedTo || "Unassigned";
  elements.taskAssigneeEmail.textContent = task.assignedEmail || "Not linked";
  elements.taskStatus.textContent = task.status;
  elements.taskStatus.className = task.status === TaskStatus.REJECTED ? "danger" : "";
  elements.taskSubmission.textContent = latestSubmission ? latestSubmission.id : "-";
  elements.reviewerNotes.value = task.reviewerNotes || "";
  elements.managerNotes.value = task.managerNotes || "";
  elements.proofNotes.value = task.pendingProof?.notes || latestSubmission?.notes || "";

  elements.proofGallery.innerHTML = "";
  const photos = task.pendingProof?.photos?.length ? task.pendingProof.photos : latestSubmission?.photos || [];
  photos.forEach((photo) => {
    const card = document.createElement("div");
    card.className = "image-card";
    card.textContent = photo;
    elements.proofGallery.appendChild(card);
  });

  if (task.status === TaskStatus.REJECTED && task.reviewerNotes) {
    elements.reviewerFeedback.textContent = `Reviewer notes: ${task.reviewerNotes}`;
    elements.reviewerFeedback.classList.add("visible");
  } else {
    elements.reviewerFeedback.textContent = "";
    elements.reviewerFeedback.classList.remove("visible");
  }
}

function renderReviewerQueue() {
  elements.reviewerQueueList.innerHTML = "";

  const audits = getAccessibleAudits();
  const latestPending = getLatestPendingSubmission(audits);
  if (latestPending) {
    elements.queueAlertText.textContent = `${latestPending.task.title} · ${latestPending.audit.id}`;
    elements.queueAlert.classList.remove("hidden");
    elements.queueAlertAction.onclick = () => {
      state.selectedTaskId = latestPending.task.id;
      renderTaskDetail();
      switchScreen("task-detail");
    };
  } else {
    elements.queueAlert.classList.add("hidden");
  }

  const queueAudits = audits
    .map((audit) => {
      const auditTasks = getTasksForAudit(audit);
      const submittedTasks = auditTasks.filter((task) => task.submissions.length);
      if (!submittedTasks.length) return null;
      const tasksToConfirm = submittedTasks.filter(
        (task) => task.status === TaskStatus.PROOF_SUBMITTED,
      ).length;
      return {
        audit,
        submittedTasks,
        tasksToConfirm,
        submittedCount: submittedTasks.length,
        dueWindow: formatDateRange(submittedTasks.map((task) => task.dueDate)),
      };
    })
    .filter(Boolean);

  if (!queueAudits.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "muted";
    emptyState.textContent = "No submissions have been sent for review yet.";
    elements.reviewerQueueList.appendChild(emptyState);
    return;
  }

  queueAudits.forEach((entry, index) => {
    const card = document.createElement("details");
    card.className = "queue-audit-card";
    card.open = index === 0;
    card.innerHTML = `
      <summary class="queue-audit-summary">
        <div>
          <h4>${entry.audit.id} · ${entry.audit.storeCode}</h4>
          <p>${entry.audit.storeName} · ${entry.dueWindow}</p>
        </div>
        <div class="queue-audit-counts">
          ${entry.tasksToConfirm} tasks to confirm out of ${entry.submittedCount} submitted
        </div>
      </summary>
    `;

    const taskList = document.createElement("div");
    taskList.className = "queue-task-list";

    entry.submittedTasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "queue-task";
      const actionLabel = task.status === TaskStatus.PROOF_SUBMITTED ? "Review" : "View";
      taskItem.innerHTML = `
        <div>
          <h5>${task.title}</h5>
          <p>Submission #${task.submissions.length} · Due ${formatDate(task.dueDate)}</p>
        </div>
        <div class="queue-task-actions">
          <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
          <button class="link" data-task-id="${task.id}">${actionLabel}</button>
        </div>
      `;
      taskItem.querySelector("button").addEventListener("click", () => {
        state.selectedTaskId = task.id;
        renderTaskDetail();
        switchScreen("task-detail");
      });
      taskList.appendChild(taskItem);
    });

    card.appendChild(taskList);
    elements.reviewerQueueList.appendChild(card);
  });
}

function renderStoreManagerView() {
  syncStoreManagerLocaleFromAudit();
  const strings = getStoreManagerStrings();
  if (elements.storeManagerTitle) {
    elements.storeManagerTitle.textContent = strings.screenTitle;
  }
  if (elements.storeManagerSubtitle) {
    elements.storeManagerSubtitle.textContent = strings.screenSubtitle;
  }
  if (elements.storeManagerLanguageLabel) {
    elements.storeManagerLanguageLabel.textContent = strings.languageLabel;
  }
  if (elements.storeManagerLocaleSelect) {
    const englishOption = elements.storeManagerLocaleSelect.querySelector("option[value='en']");
    const frenchOption = elements.storeManagerLocaleSelect.querySelector("option[value='fr']");
    if (englishOption) englishOption.textContent = strings.languageEnglish;
    if (frenchOption) frenchOption.textContent = strings.languageFrench;
    elements.storeManagerLocaleSelect.value = state.storeManagerLocale;
  }
  const audit = getSelectedAudit();
  const user = getEffectiveUser();
  const managerName = user?.role === "store-manager" ? user.name : "";
  if (!audit) {
    elements.managerAuditHeader.innerHTML = `
      <h3>${strings.noAuditTitle}</h3>
      <p class="muted">${strings.noAuditBody}</p>
    `;
    elements.managerTaskList.innerHTML = "";
    return;
  }

  const auditTasks = getTasksForAudit(audit);
  const managerTasks = managerName
    ? auditTasks.filter((task) => task.assignedTo === managerName)
    : [];
  const dueWindow = formatDateRange(managerTasks.map((task) => task.dueDate));

  elements.managerAuditHeader.innerHTML = `
    <div>
      <p class="muted">${strings.currentAuditLabel}</p>
      <h3>${audit.storeName} · ${audit.storeCode}</h3>
      <p>${audit.id} · ${dueWindow}</p>
    </div>
    <div class="manager-header-meta">
      <span class="badge">${managerName || strings.managerBadge}</span>
      <span class="badge">${strings.tasksCount(managerTasks.length)}</span>
    </div>
  `;

  elements.managerTaskList.innerHTML = "";
  if (!managerTasks.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "muted";
    emptyState.textContent = strings.noTasksAssigned;
    elements.managerTaskList.appendChild(emptyState);
    return;
  }

  managerTasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "manager-task-card";
    const overdue = isTaskOverdue(task);
    const actionLabel =
      task.status === TaskStatus.APPROVED
        ? strings.actionCompleted
        : task.status === TaskStatus.PROOF_SUBMITTED
          ? strings.actionSubmitted
          : task.status === TaskStatus.REJECTED
            ? strings.actionResubmit
            : strings.actionSubmit;
    const disableAction = task.status === TaskStatus.APPROVED || task.status === TaskStatus.PROOF_SUBMITTED;
    taskCard.innerHTML = `
      <div class="manager-task-header">
        <div>
          <h4>${task.title}</h4>
          <p>${strings.duePrefix} ${formatDate(task.dueDate)} · ${task.id}</p>
          <p class="muted">${task.category || ""}</p>
        </div>
        <div class="manager-task-badges">
          <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
          ${overdue ? `<span class="badge warning">${strings.overdueLabel}</span>` : ""}
        </div>
      </div>
      ${
        task.managerNotes
          ? `<div class="manager-task-callout">${strings.managerNotesLabel} ${task.managerNotes}</div>`
          : ""
      }
      ${
        task.status === TaskStatus.REJECTED && task.reviewerNotes
          ? `<div class="manager-task-callout">${strings.reviewerNotesLabel} ${task.reviewerNotes}</div>`
          : ""
      }
      <div class="manager-task-body">
        <label class="field">
          ${strings.proofUploadLabel}
          <input type="file" multiple data-task-id="${task.id}" />
        </label>
        <label class="field">
          ${strings.notesToReviewerLabel}
          <textarea rows="3" data-task-notes="${task.id}" placeholder="${strings.notesPlaceholder}">${
            task.pendingProof?.notes || ""
          }</textarea>
        </label>
        <div class="manager-task-actions">
          <button class="${disableAction ? "secondary" : "primary"}" data-task-action="${task.id}" ${
            disableAction ? "disabled" : ""
          }>${actionLabel}</button>
          <span class="subtext">${strings.submissionCount(task.submissions.length)}</span>
        </div>
      </div>
    `;

    const actionButton = taskCard.querySelector("[data-task-action]");
    const notesField = taskCard.querySelector("[data-task-notes]");
    const fileInput = taskCard.querySelector("input[type='file']");

    actionButton.addEventListener("click", async () => {
      const notes = notesField.value.trim();
      const photos = Array.from(fileInput.files || []).map((file) => file.name);
      await api.uploadProof({ taskId: task.id, notes, photos });
      await api.submitProof({ taskId: task.id });
      renderTaskList();
      renderReviewerQueue();
      renderTaskDetail();
      renderStoreManagerView();
    });

    elements.managerTaskList.appendChild(taskCard);
  });
}

function renderExistingTaskOptions() {
  const audit = getSelectedAudit();
  if (!audit) {
    elements.existingTaskSelect.innerHTML = "";
    const option = document.createElement("option");
    option.textContent = "Select an audit to assign templates";
    option.disabled = true;
    option.selected = true;
    elements.existingTaskSelect.appendChild(option);
    return;
  }
  const unassignedTemplates = getUnassignedTemplates(audit);
  elements.existingTaskSelect.innerHTML = "";

  if (!unassignedTemplates.length) {
    const option = document.createElement("option");
    option.textContent = "No unassigned templates available";
    option.disabled = true;
    option.selected = true;
    elements.existingTaskSelect.appendChild(option);
    return;
  }

  unassignedTemplates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = `${template.title} · ${template.category}`;
    elements.existingTaskSelect.appendChild(option);
  });
}

function renderAuditTaskSummary() {
  const audit = getSelectedAudit();
  const auditTasks = getTasksForAudit(audit);
  elements.auditTaskSummary.innerHTML = "";
  elements.auditTaskCount.textContent = `${auditTasks.length} assigned`;

  if (!audit) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "muted";
    emptyItem.textContent = "Select an audit to view assignments.";
    elements.auditTaskSummary.appendChild(emptyItem);
    return;
  }

  if (!auditTasks.length) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "muted";
    emptyItem.textContent = "No tasks assigned yet.";
    elements.auditTaskSummary.appendChild(emptyItem);
    return;
  }

  auditTasks.forEach((task, index) => {
    const item = document.createElement("div");
    item.className = "audit-task-card";
    item.draggable = true;
    item.dataset.taskId = task.id;
    item.innerHTML = `
      <div class="audit-task-header">
        <div class="task-meta">
          <strong>${task.title}</strong>
          <small>${task.templateId} · ${task.category || "Uncategorized"}</small>
        </div>
        <div class="drag-handle" aria-label="Drag task">Drag</div>
      </div>
      <div class="audit-task-fields">
        <div class="audit-task-row">
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
      renderStoreManagerView();
    });

    item.querySelector("[data-task-notes]").addEventListener("input", (event) => {
      task.managerNotes = event.target.value;
      renderStoreManagerView();
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
      renderStoreManagerView();
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

function updateNavigationVisibility() {
  const user = getEffectiveUser();
  if (!user) return;
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

function ensureSelectedAudit() {
  const accessibleAudits = getAccessibleAudits();
  if (!accessibleAudits.length) {
    state.selectedAuditId = null;
    return;
  }
  if (!accessibleAudits.some((audit) => audit.id === state.selectedAuditId)) {
    state.selectedAuditId = accessibleAudits[0].id;
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

function createTemplate({ title, category, notes }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return null;
  const id = generateTemplateId();
  const template = {
    id,
    title: trimmedTitle,
    category: category.trim() || "General",
    notes: notes.trim() || "",
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
    syncStoreManagerLocaleFromAudit();
    renderStoreManagerView();
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
  const template = createTemplate({ title, category, notes });
  if (!template) return;
  elements.taskTitleInput.value = "";
  elements.taskCategoryInput.value = "";
  elements.taskNotesInput.value = "";
  renderExistingTaskOptions();
  renderTaskPool();
});

elements.bulkAddButton.addEventListener("click", () => {
  const chips = document.querySelectorAll("#screen-create-tasks .chip");
  chips.forEach((chip) => {
    const title = chip.textContent.trim();
    const category = chip.dataset.category || "General";
    const exists = store.taskTemplates.some((template) => template.title === title);
    if (!exists) {
      createTemplate({ title, category, notes: "" });
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
  renderStoreManagerView();
});

elements.viewAsSelect.addEventListener("change", (event) => {
  if (!isAdmin()) return;
  state.viewAsUserId = event.target.value || null;
  ensureSelectedAudit();
  updateNavigationVisibility();
  updateViewAsBanner();
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
  renderStoreManagerView();
  renderAuditTaskSummary();
  renderExistingTaskOptions();
  renderAdminOverview();
});

if (elements.storeManagerLocaleSelect) {
  elements.storeManagerLocaleSelect.addEventListener("change", (event) => {
    state.storeManagerLocale = event.target.value;
    state.storeManagerLocaleOverride = true;
    renderStoreManagerView();
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
  renderAdminFilters();
  ensureSelectedAudit();
  syncSelectedTask();
  renderTaskList();
  renderTaskDetail();
  renderReviewerQueue();
  renderStoreManagerView();
  renderExistingTaskOptions();
  renderAuditTaskSummary();
  renderTaskPool();
  renderAdminOverview();
  renderProfiles();
}

init();
