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
  audits: [
    {
      id: "AUD-2025-001",
      storeCode: "ON-204",
      storeName: "Toronto Midtown",
      createdAt: "2025-02-12",
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
  const audit = getAudit();
  return audit.tasks.find((task) => task.id === taskId);
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
  const audit = getAudit();
  elements.taskListRows.innerHTML = "";

  audit.tasks.forEach((task) => {
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
  const audit = getAudit();
  elements.reviewerQueueList.innerHTML = "";

  const pending = audit.tasks.filter((task) => task.status === TaskStatus.PROOF_SUBMITTED);
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
