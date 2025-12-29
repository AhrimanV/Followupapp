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
};

const TaskStatus = {
  NOT_STARTED: "Not Started",
  PROOF_SUBMITTED: "Proof Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const store = {
  tasks: [
    {
      id: "TSK-1001",
      title: "Emergency exit signage",
      dueDate: "2025-03-01",
      assignedTo: "Sam Thompson",
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
  existingTaskSelect: document.getElementById("existing-task-select"),
  addExistingTaskButton: document.getElementById("add-existing-task"),
  auditTaskSummary: document.getElementById("audit-task-summary"),
  auditTaskCount: document.getElementById("audit-task-count"),
  taskTitleInput: document.getElementById("task-title-input"),
  taskDueInput: document.getElementById("task-due-input"),
  addTaskButton: document.getElementById("add-task-button"),
  bulkAddButton: document.getElementById("bulk-add-button"),
  taskPoolList: document.getElementById("task-pool-list"),
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

function createTask({ title, dueDate }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;
  const id = generateTaskId();
  store.tasks.push({
    id,
    title: trimmedTitle,
    dueDate,
    assignedTo: "Unassigned",
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
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.screen;
    switchScreen(target);
  });
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
  createTask({ title, dueDate });
  elements.taskTitleInput.value = "";
  elements.taskDueInput.value = "";
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
renderExistingTaskOptions();
renderAuditTaskSummary();
renderTaskPool();
