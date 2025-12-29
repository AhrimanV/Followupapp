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
    title: "Create Tasks",
    subtitle: "Log failed points and assign owners.",
  },
  "task-list": {
    title: "Task List",
    subtitle: "Track progress across all tasks.",
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
  ],
};

const m365UsersByName = new Map(m365Directory.contacts.map((contact) => [contact.displayName, contact]));
const samUser = m365UsersByName.get("Sam Thompson");
const morganUser = m365UsersByName.get("Morgan Lee");

const store = {
  tasks: [
    {
      id: "TSK-1001",
      title: "Emergency exit signage",
      dueDate: "2025-03-01",
      assignedTo: "Sam Thompson",
      assignedUserId: samUser?.id ?? null,
      assignedEmail: samUser?.email ?? null,
      status: TaskStatus.NOT_STARTED,
      submissions: [],
      pendingProof: {
        notes: "",
        photos: [],
      },
      reviewerNotes: "",
    },
    {
      id: "TSK-1002",
      title: "Stock room labeling",
      dueDate: "2025-02-28",
      assignedTo: "Sam Thompson",
      assignedUserId: samUser?.id ?? null,
      assignedEmail: samUser?.email ?? null,
      status: TaskStatus.NOT_STARTED,
      submissions: [],
      pendingProof: {
        notes: "",
        photos: [],
      },
      reviewerNotes: "",
    },
    {
      id: "TSK-1003",
      title: "Fire extinguisher inspection",
      dueDate: "2025-03-03",
      assignedTo: "Sam Thompson",
      assignedUserId: samUser?.id ?? null,
      assignedEmail: samUser?.email ?? null,
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
    {
      id: "TSK-1004",
      title: "Back room exit lighting",
      dueDate: "2025-03-06",
      assignedTo: "Morgan Lee",
      assignedUserId: morganUser?.id ?? null,
      assignedEmail: morganUser?.email ?? null,
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
      id: "TSK-1005",
      title: "Safety poster refresh",
      dueDate: "2025-03-08",
      assignedTo: "Morgan Lee",
      assignedUserId: morganUser?.id ?? null,
      assignedEmail: morganUser?.email ?? null,
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
  audits: [
    {
      id: "AUD-2025-001",
      storeCode: "ON-204",
      storeName: "Toronto Midtown",
      createdAt: "2025-02-12",
      taskIds: ["TSK-1001", "TSK-1002", "TSK-1003"],
    },
    {
      id: "AUD-2025-002",
      storeCode: "QC-118",
      storeName: "Montreal East",
      createdAt: "2025-02-15",
      taskIds: ["TSK-1004", "TSK-1005"],
    },
  ],
};

const state = {
  selectedAuditId: "AUD-2025-001",
  selectedTaskId: "TSK-1003",
  managerName: "Sam Thompson",
  selectedAssignee: null,
};

const elements = {
  taskListRows: document.getElementById("task-list-rows"),
  taskTitle: document.getElementById("detail-task-title"),
  taskDue: document.getElementById("detail-task-due"),
  taskStatus: document.getElementById("detail-task-status"),
  taskSubmission: document.getElementById("detail-task-submission"),
  reviewerNotes: document.getElementById("detail-reviewer-notes"),
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
  taskDueInput: document.getElementById("task-due-input"),
  assigneeInput: document.getElementById("assignee-input"),
  assigneeMenu: document.getElementById("assignee-menu"),
  assigneeHint: document.getElementById("assignee-hint"),
  assigneeSelected: document.getElementById("assignee-selected"),
  assigneeError: document.getElementById("assignee-error"),
  addTaskButton: document.getElementById("add-task-button"),
  bulkAddButton: document.getElementById("bulk-add-button"),
  taskPoolList: document.getElementById("task-pool-list"),
  taskAssignee: document.getElementById("detail-task-assignee"),
  taskAssigneeEmail: document.getElementById("detail-task-email"),
};

const api = {
  async uploadProof({ taskId, notes, photos }) {
    const task = getTask(taskId);
    task.pendingProof = {
      notes: notes || "",
      photos: photos || [],
    };
    return task;
  },
  async submitProof({ taskId }) {
    const task = getTask(taskId);
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
    const task = getTask(taskId);
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

async function lookupM365Contacts(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const matches = m365Directory.contacts.filter((contact) => {
    return (
      contact.displayName.toLowerCase().includes(normalized) ||
      contact.email.toLowerCase().includes(normalized)
    );
  });
  return matches;
}

function getAudit() {
  return store.audits.find((audit) => audit.id === state.selectedAuditId);
}

function getTask(taskId) {
  return store.tasks.find((task) => task.id === taskId);
}

function getAuditTasks(audit = getAudit()) {
  if (!audit) return [];
  return audit.taskIds.map((taskId) => getTask(taskId)).filter(Boolean);
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

function getReviewerQueueAudits() {
  return store.audits
    .map((audit) => {
      const auditTasks = getAuditTasks(audit);
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
}

function getLatestPendingSubmission() {
  const pendingSubmissions = [];
  store.audits.forEach((audit) => {
    const auditTasks = getAuditTasks(audit);
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

function getUnassignedTasks(audit = getAudit()) {
  if (!audit) return store.tasks;
  return store.tasks.filter((task) => !audit.taskIds.includes(task.id));
}

function generateTaskId() {
  const maxId = store.tasks.reduce((max, task) => {
    const match = task.id.match(/TSK-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 1000);
  return `TSK-${String(maxId + 1).padStart(4, "0")}`;
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

function renderTaskList() {
  elements.taskListRows.innerHTML = "";
  const auditTasks = getAuditTasks();

  if (!auditTasks.length) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "table-row";
    emptyRow.innerHTML = `
      <span>No tasks assigned to this audit yet.</span>
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
      <span>${formatDate(task.dueDate)}</span>
      <span>${task.assignedTo}</span>
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
  const task = getTask(state.selectedTaskId);
  if (!task) {
    elements.taskTitle.textContent = "-";
    elements.taskDue.textContent = "-";
    elements.taskAssignee.textContent = "-";
    elements.taskAssigneeEmail.textContent = "-";
    elements.taskStatus.textContent = "-";
    elements.taskStatus.className = "";
    elements.taskSubmission.textContent = "-";
    elements.reviewerNotes.value = "";
    elements.proofNotes.value = "";
    elements.proofGallery.innerHTML = "";
    elements.reviewerFeedback.textContent = "";
    elements.reviewerFeedback.classList.remove("visible");
    return;
  }
  const latestSubmission = task.submissions[task.submissions.length - 1];
  elements.taskTitle.textContent = task.title;
  elements.taskDue.textContent = formatDate(task.dueDate);
  elements.taskAssignee.textContent = task.assignedTo || "Unassigned";
  elements.taskAssigneeEmail.textContent = task.assignedEmail || "Not linked";
  elements.taskStatus.textContent = task.status;
  elements.taskStatus.className = task.status === TaskStatus.REJECTED ? "danger" : "";
  elements.taskSubmission.textContent = latestSubmission ? latestSubmission.id : "-";
  elements.reviewerNotes.value = task.reviewerNotes || "";
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

  const latestPending = getLatestPendingSubmission();
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

  const queueAudits = getReviewerQueueAudits();
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
  const audit = getAudit();
  if (!audit) {
    elements.managerAuditHeader.innerHTML = `
      <h3>No audit selected</h3>
      <p class="muted">Assign an audit to view store manager tasks.</p>
    `;
    elements.managerTaskList.innerHTML = "";
    return;
  }

  const auditTasks = getAuditTasks(audit);
  const managerTasks = auditTasks.filter((task) => task.assignedTo === state.managerName);
  const dueWindow = formatDateRange(managerTasks.map((task) => task.dueDate));

  elements.managerAuditHeader.innerHTML = `
    <div>
      <p class="muted">Current audit</p>
      <h3>${audit.storeName} · ${audit.storeCode}</h3>
      <p>${audit.id} · ${dueWindow}</p>
    </div>
    <div class="manager-header-meta">
      <span class="badge">${state.managerName}</span>
      <span class="badge">${managerTasks.length} tasks</span>
    </div>
  `;

  elements.managerTaskList.innerHTML = "";
  if (!managerTasks.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "muted";
    emptyState.textContent = "No tasks assigned to you for this audit.";
    elements.managerTaskList.appendChild(emptyState);
    return;
  }

  managerTasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "manager-task-card";
    const overdue = isTaskOverdue(task);
    const actionLabel =
      task.status === TaskStatus.APPROVED
        ? "Completed"
        : task.status === TaskStatus.PROOF_SUBMITTED
          ? "Submitted"
          : task.status === TaskStatus.REJECTED
            ? "Resubmit Proof"
            : "Submit Proof";
    const disableAction = task.status === TaskStatus.APPROVED || task.status === TaskStatus.PROOF_SUBMITTED;
    taskCard.innerHTML = `
      <div class="manager-task-header">
        <div>
          <h4>${task.title}</h4>
          <p>Due ${formatDate(task.dueDate)} · ${task.id}</p>
        </div>
        <div class="manager-task-badges">
          <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
          ${overdue ? '<span class="badge warning">Overdue</span>' : ""}
        </div>
      </div>
      ${
        task.status === TaskStatus.REJECTED && task.reviewerNotes
          ? `<div class="manager-task-callout">Reviewer notes: ${task.reviewerNotes}</div>`
          : ""
      }
      <div class="manager-task-body">
        <label class="field">
          Proof upload
          <input type="file" multiple data-task-id="${task.id}" />
        </label>
        <label class="field">
          Notes to reviewer
          <textarea rows="3" data-task-notes="${task.id}" placeholder="Add context for the reviewer...">${
            task.pendingProof?.notes || ""
          }</textarea>
        </label>
        <div class="manager-task-actions">
          <button class="${disableAction ? "secondary" : "primary"}" data-task-action="${task.id}" ${
            disableAction ? "disabled" : ""
          }>${actionLabel}</button>
          <span class="subtext">Submission #${task.submissions.length}</span>
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
  const audit = getAudit();
  const unassignedTasks = getUnassignedTasks(audit);
  elements.existingTaskSelect.innerHTML = "";

  if (!unassignedTasks.length) {
    const option = document.createElement("option");
    option.textContent = "No unassigned tasks available";
    option.disabled = true;
    option.selected = true;
    elements.existingTaskSelect.appendChild(option);
    return;
  }

  unassignedTasks.forEach((task) => {
    const option = document.createElement("option");
    option.value = task.id;
    option.textContent = `${task.title} · due ${formatDate(task.dueDate)}`;
    elements.existingTaskSelect.appendChild(option);
  });
}

function renderAuditTaskSummary() {
  const audit = getAudit();
  const auditTasks = getAuditTasks(audit);
  elements.auditTaskSummary.innerHTML = "";
  elements.auditTaskCount.textContent = `${auditTasks.length} assigned`;

  if (!auditTasks.length) {
    const emptyItem = document.createElement("li");
    emptyItem.innerHTML = "<span class=\"muted\">No tasks assigned yet.</span>";
    elements.auditTaskSummary.appendChild(emptyItem);
    return;
  }

  auditTasks.forEach((task) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div class="task-meta">
        <strong>${task.title}</strong>
        <small>Due ${formatDate(task.dueDate)} · ${task.status}</small>
      </div>
      <button class="secondary" data-task-id="${task.id}">Remove from audit</button>
    `;
    item.querySelector("button").addEventListener("click", () => {
      audit.taskIds = audit.taskIds.filter((taskId) => taskId !== task.id);
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
  const audit = getAudit();
  elements.taskPoolList.innerHTML = "";

  store.tasks.forEach((task) => {
    const poolItem = document.createElement("div");
    poolItem.className = "task-pool-item";
    const isAssigned = audit?.taskIds.includes(task.id);
    poolItem.innerHTML = `
      <div class="task-meta">
        <strong>${task.title}</strong>
        <small>Due ${formatDate(task.dueDate)} · ${task.status}</small>
      </div>
      <span class="pill ${isAssigned ? "" : "muted"}">${isAssigned ? "Assigned" : "Unassigned"}</span>
    `;
    elements.taskPoolList.appendChild(poolItem);
  });
}

function renderAssigneeMenu(results) {
  elements.assigneeMenu.innerHTML = "";
  if (!results.length) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "autocomplete-item";
    emptyItem.innerHTML = "<strong>No matches found</strong><span>Try another name or email.</span>";
    elements.assigneeMenu.appendChild(emptyItem);
    return;
  }

  results.forEach((contact) => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.innerHTML = `
      <strong>${contact.displayName}</strong>
      <span>${contact.email} · ${contact.jobTitle}</span>
    `;
    item.addEventListener("click", () => {
      setSelectedAssignee(contact);
      hideAssigneeMenu();
    });
    elements.assigneeMenu.appendChild(item);
  });
}

function showAssigneeMenu() {
  elements.assigneeMenu.classList.remove("hidden");
}

function hideAssigneeMenu() {
  elements.assigneeMenu.classList.add("hidden");
}

function clearAssigneeSelection() {
  state.selectedAssignee = null;
  elements.assigneeSelected.classList.add("hidden");
  elements.assigneeSelected.innerHTML = "";
}

function setSelectedAssignee(contact) {
  state.selectedAssignee = contact;
  elements.assigneeInput.value = contact.displayName;
  elements.assigneeSelected.innerHTML = `
    <strong>${contact.displayName}</strong>
    <span>${contact.email} · ${contact.jobTitle}</span>
    <span>ID: ${contact.id}</span>
  `;
  elements.assigneeSelected.classList.remove("hidden");
  elements.assigneeError.classList.add("hidden");
}

function setAssigneeError(message) {
  if (!message) {
    elements.assigneeError.textContent = "";
    elements.assigneeError.classList.add("hidden");
    return;
  }
  elements.assigneeError.textContent = message;
  elements.assigneeError.classList.remove("hidden");
}

function validateAssignee() {
  const inputValue = elements.assigneeInput.value.trim();
  if (!inputValue) {
    return { valid: true, assignee: null };
  }
  if (
    state.selectedAssignee &&
    (inputValue === state.selectedAssignee.displayName || inputValue === state.selectedAssignee.email)
  ) {
    return { valid: true, assignee: state.selectedAssignee };
  }
  return {
    valid: false,
    message: "Select a valid M365 contact from the dropdown to assign this task.",
  };
}

async function handleAssigneeLookup() {
  const query = elements.assigneeInput.value.trim();
  if (!query) {
    hideAssigneeMenu();
    clearAssigneeSelection();
    return;
  }
  const results = await lookupM365Contacts(query);
  renderAssigneeMenu(results);
  showAssigneeMenu();
}

function createTask({ title, dueDate, assignee }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;
  const id = generateTaskId();
  store.tasks.push({
    id,
    title: trimmedTitle,
    dueDate,
    assignedTo: assignee?.displayName || "Unassigned",
    assignedUserId: assignee?.id || null,
    assignedEmail: assignee?.email || null,
    status: TaskStatus.NOT_STARTED,
    submissions: [],
    pendingProof: {
      notes: "",
      photos: [],
    },
    reviewerNotes: "",
  });
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
    renderStoreManagerView();
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.screen;
    switchScreen(target);
  });
});

elements.assigneeHint.textContent = getM365SourceHint();

elements.assigneeInput.addEventListener("input", () => {
  const value = elements.assigneeInput.value.trim();
  if (
    state.selectedAssignee &&
    value !== state.selectedAssignee.displayName &&
    value !== state.selectedAssignee.email
  ) {
    clearAssigneeSelection();
  }
  setAssigneeError("");
  handleAssigneeLookup();
});

elements.assigneeInput.addEventListener("focus", () => {
  if (elements.assigneeInput.value.trim()) {
    handleAssigneeLookup();
  }
});

document.addEventListener("click", (event) => {
  const isAutocomplete = event.target.closest(".autocomplete");
  if (!isAutocomplete) {
    hideAssigneeMenu();
  }
});

elements.addExistingTaskButton.addEventListener("click", () => {
  const audit = getAudit();
  const taskId = elements.existingTaskSelect.value;
  if (!taskId || audit.taskIds.includes(taskId)) return;
  audit.taskIds.push(taskId);
  renderAuditTaskSummary();
  renderTaskList();
  renderReviewerQueue();
  renderExistingTaskOptions();
  renderTaskPool();
});

elements.addTaskButton.addEventListener("click", () => {
  const title = elements.taskTitleInput.value;
  const dueDate = elements.taskDueInput.value;
  const validation = validateAssignee();
  if (!validation.valid) {
    setAssigneeError(validation.message);
    return;
  }
  createTask({ title, dueDate, assignee: validation.assignee });
  elements.taskTitleInput.value = "";
  elements.taskDueInput.value = "";
  elements.assigneeInput.value = "";
  clearAssigneeSelection();
  setAssigneeError("");
  hideAssigneeMenu();
  renderExistingTaskOptions();
  renderTaskPool();
});

elements.bulkAddButton.addEventListener("click", () => {
  const chips = document.querySelectorAll("#screen-create-tasks .chip");
  chips.forEach((chip) => {
    const title = chip.textContent;
    const exists = store.tasks.some((task) => task.title === title);
    if (!exists) {
      createTask({ title, dueDate: "" });
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

renderTaskList();
renderTaskDetail();
renderReviewerQueue();
renderStoreManagerView();
renderExistingTaskOptions();
renderAuditTaskSummary();
renderTaskPool();
