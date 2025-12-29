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
  ],
  audits: [
    {
      id: "AUD-2025-001",
      storeCode: "ON-204",
      storeName: "Toronto Midtown",
      createdAt: "2025-02-12",
      taskIds: ["TSK-1001", "TSK-1002", "TSK-1003"],
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

  const pending = getAuditTasks().filter((task) => task.status === TaskStatus.PROOF_SUBMITTED);
  if (pending.length) {
    const newest = pending[0];
    elements.queueAlertText.textContent = `${newest.title} · Submission ${newest.submissions.length}`;
    elements.queueAlert.classList.remove("hidden");
    elements.queueAlertAction.onclick = () => {
      state.selectedTaskId = newest.id;
      renderTaskDetail();
      switchScreen("task-detail");
    };
  } else {
    elements.queueAlert.classList.add("hidden");
  }

  pending.forEach((task) => {
    const queueItem = document.createElement("div");
    queueItem.className = "queue-item";
    queueItem.innerHTML = `
      <div>
        <h4>${task.title}</h4>
        <p>Store ${getAudit().storeCode} · Submission #${task.submissions.length}</p>
      </div>
      <div>
        <span class="${getStatusBadgeClass(task.status)}">${task.status}</span>
        <button class="link" data-task-id="${task.id}">Review</button>
      </div>
    `;
    queueItem.querySelector("button").addEventListener("click", () => {
      state.selectedTaskId = task.id;
      renderTaskDetail();
      switchScreen("task-detail");
    });
    elements.reviewerQueueList.appendChild(queueItem);
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
