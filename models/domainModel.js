export const AuditStatus = Object.freeze({
  Draft: "Draft",
  Launched: "Launched",
  Closed: "Closed",
});

export const TaskStatus = Object.freeze({
  NotStarted: "Not Started",
  ProofRequested: "Proof Requested",
  ProofSubmitted: "Proof Submitted",
  Approved: "Approved",
  Rejected: "Rejected",
  Overdue: "Overdue",
});

export const TaskSchema = {
  title: "Task",
  type: "object",
  required: ["id", "title", "status"],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    status: {
      type: "string",
      enum: Object.values(TaskStatus),
    },
    dueDate: { type: "string", format: "date" },
    requiresProof: { type: "boolean" },
    submissions: {
      type: "array",
      items: { $ref: "Submission" },
    },
  },
};

export const SubmissionSchema = {
  title: "Submission",
  type: "object",
  required: ["id", "status", "submittedAt"],
  properties: {
    id: { type: "string" },
    status: {
      type: "string",
      enum: [TaskStatus.ProofSubmitted, TaskStatus.Approved, TaskStatus.Rejected],
    },
    submittedAt: { type: "string", format: "date-time" },
    notes: { type: "string" },
    files: { type: "array", items: { type: "string" } },
  },
};

export const DecisionSchema = {
  title: "Decision",
  type: "object",
  required: ["status"],
  properties: {
    status: {
      type: "string",
      enum: [TaskStatus.Approved, TaskStatus.Rejected],
    },
    reviewerNotes: { type: "string" },
  },
};

export const AuditSchema = {
  title: "Audit",
  type: "object",
  required: ["id", "status", "tasks"],
  properties: {
    id: { type: "string" },
    status: {
      type: "string",
      enum: Object.values(AuditStatus),
    },
    tasks: {
      type: "array",
      items: { $ref: "Task" },
    },
  },
};
