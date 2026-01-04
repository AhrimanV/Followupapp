import { TaskStatus } from "./models/domainModel.js";
import { createLocalStorageAdapter } from "./storage/localStorageAdapter.js";

export function showNotification(message, { tone = "info", duration = 3200 } = {}) {
  const toast = document.getElementById("toast-banner");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("toast-banner--success", "toast-banner--warning", "toast-banner--info");
  toast.classList.add(`toast-banner--${tone}`);
  toast.classList.add("is-visible");

  window.clearTimeout(showNotification.timeoutId);
  showNotification.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, duration);
}

showNotification.timeoutId = null;

export const m365Directory = {
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

const defaultStoreContacts = [
  {
    storeCode: "ON-204",
    storeName: "Toronto Midtown",
    storeManager: "Sam Thompson",
    storeManagerEmail: "sam.thompson@contoso.com",
    regionalManager: "Kelly Rodgers",
    regionalManagerEmail: "kelly.rodgers@contoso.com",
    director: "Guillaume Veillette",
    directorEmail: "guillaume.veillette@bell.ca",
  },
  {
    storeCode: "QC-118",
    storeName: "Montreal East",
    storeManager: "Morgan Lee",
    storeManagerEmail: "morgan.lee@contoso.com",
    regionalManager: "Taylor Rivers",
    regionalManagerEmail: "taylor.rivers@contoso.com",
    director: "Guillaume Veillette",
    directorEmail: "guillaume.veillette@bell.ca",
  },
];

export let storeContacts = [...defaultStoreContacts];

export const users = [
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

const initialStore = {
  auditTypes: [
    {
      id: "ATY-1001",
      name: {
        en: "Safety",
        fr: "Sécurité",
      },
      categories: [
        {
          id: "CAT-2001",
          name: {
            en: "Loss Prevention",
            fr: "Prévention des pertes",
          },
          tasks: [
            {
              id: "TPL-1001",
              title: {
                en: "Emergency exit signage",
                fr: "Signalisation des sorties de secours",
              },
              notes: {
                en: "Ensure all emergency exits have clear signage and no obstructions.",
                fr: "Assurez-vous que toutes les sorties de secours ont une signalisation claire et sans obstruction.",
              },
              requiresProof: true,
            },
          ],
        },
        {
          id: "CAT-2002",
          name: {
            en: "Store Appearance",
            fr: "Apparence du magasin",
          },
          tasks: [
            {
              id: "TPL-1002",
              title: {
                en: "Stock room labeling",
                fr: "Étiquetage de la réserve",
              },
              notes: {
                en: "Label aisles, bays, and supply zones with updated signage.",
                fr: "Étiquetez les allées, baies et zones de stock avec une signalisation à jour.",
              },
              requiresProof: true,
            },
          ],
        },
        {
          id: "CAT-2003",
          name: {
            en: "Safety",
            fr: "Sécurité",
          },
          tasks: [
            {
              id: "TPL-1003",
              title: {
                en: "Fire extinguisher inspection",
                fr: "Inspection des extincteurs",
              },
              notes: {
                en: "Verify inspection tags, pressure gauges, and access paths.",
                fr: "Vérifiez les étiquettes d'inspection, les manomètres et les accès.",
              },
              requiresProof: true,
            },
          ],
        },
      ],
    },
    {
      id: "ATY-1002",
      name: {
        en: "Operations",
        fr: "Opérations",
      },
      categories: [
        {
          id: "CAT-2004",
          name: {
            en: "Safety",
            fr: "Sécurité",
          },
          tasks: [
            {
              id: "TPL-1004",
              title: {
                en: "Back room exit lighting",
                fr: "Éclairage des sorties de l'arrière-boutique",
              },
              notes: {
                en: "Check emergency lighting fixtures and replace bulbs if needed.",
                fr: "Vérifiez les luminaires d'urgence et remplacez les ampoules si nécessaire.",
              },
              requiresProof: true,
            },
          ],
        },
        {
          id: "CAT-2005",
          name: {
            en: "Store Appearance",
            fr: "Apparence du magasin",
          },
          tasks: [
            {
              id: "TPL-1005",
              title: {
                en: "Safety poster refresh",
                fr: "Mise à jour des affiches de sécurité",
              },
              notes: {
                en: "Update compliance posters and ensure they are visible to staff.",
                fr: "Mettez à jour les affiches de conformité et assurez-vous qu'elles sont visibles.",
              },
              requiresProof: true,
            },
          ],
        },
      ],
    },
    {
      id: "ATY-1003",
      name: {
        en: "Loss Prevention",
        fr: "Prévention des pertes",
      },
      categories: [
        {
          id: "CAT-2006",
          name: {
            en: "Cash Handling",
            fr: "Gestion de la caisse",
          },
          tasks: [
            {
              id: "TPL-1006",
              title: {
                en: "Cash till reconciliation",
                fr: "Rapprochement des caisses",
              },
              notes: {
                en: "Confirm tills are balanced and variances are documented.",
                fr: "Confirmez que les caisses sont équilibrées et que les écarts sont documentés.",
              },
              requiresProof: true,
            },
          ],
        },
      ],
    },
    {
      id: "ATY-1004",
      name: {
        en: "Compliance",
        fr: "Conformité",
      },
      categories: [
        {
          id: "CAT-2007",
          name: {
            en: "Documentation",
            fr: "Documentation",
          },
          tasks: [
            {
              id: "TPL-1007",
              title: {
                en: "Policy binder update",
                fr: "Mise à jour du classeur de politiques",
              },
              notes: {
                en: "Ensure the policy binder includes the latest signed acknowledgements.",
                fr: "Assurez-vous que le classeur contient les derniers accusés de réception signés.",
              },
              requiresProof: false,
            },
          ],
        },
      ],
    },
  ],
  audits: [
    {
      id: "AUD-2025-001",
      followUpIteration: "001",
      storeCode: "ON-204",
      storeName: "Toronto Midtown",
      auditType: "ATY-1001",
      createdAt: "2025-02-12",
      ownerId: "usr-ros1",
      language: "en",
      reminderCadenceDays: 7,
      escalationRules: {
        reminderRecipients: ["store-manager", "regional-manager"],
        deadlineRecipients: ["store-manager", "regional-manager", "director"],
      },
      storeManagerName: "Sam Thompson",
      storeManagerEmail: "sam.thompson@contoso.com",
      regionalManagerName: "Kelly Rodgers",
      regionalManagerEmail: "kelly.rodgers@contoso.com",
      directorName: "Guillaume Veillette",
      directorEmail: "guillaume.veillette@bell.ca",
      backupAssigneeEmail: "ros-team@contoso.com",
      categoryOptions: ["Loss Prevention", "Store Appearance", "Safety"],
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
          requiresProof: true,
          status: TaskStatus.NotStarted,
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
          requiresProof: true,
          status: TaskStatus.NotStarted,
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
          requiresProof: true,
          status: TaskStatus.ProofSubmitted,
          submissions: [
            {
              id: "SUB-2",
              submittedAt: "2025-02-15T11:32:00Z",
              status: TaskStatus.ProofSubmitted,
              comment: "Updated tags for back room units.",
              proofLinks: [
                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
              ],
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
      followUpIteration: "002",
      storeCode: "QC-118",
      storeName: "Montreal East",
      auditType: "ATY-1002",
      createdAt: "2025-02-15",
      ownerId: "usr-ros2",
      language: "fr",
      reminderCadenceDays: 5,
      escalationRules: {
        reminderRecipients: ["store-manager", "regional-manager"],
        deadlineRecipients: ["store-manager", "regional-manager", "director"],
      },
      storeManagerName: "Morgan Lee",
      storeManagerEmail: "morgan.lee@contoso.com",
      regionalManagerName: "Taylor Rivers",
      regionalManagerEmail: "taylor.rivers@contoso.com",
      directorName: "Guillaume Veillette",
      directorEmail: "guillaume.veillette@bell.ca",
      backupAssigneeEmail: "quebec-ops@contoso.com",
      categoryOptions: ["Sécurité", "Apparence du magasin"],
      tasks: [
        {
          id: "AT-2004",
          templateId: "TPL-1004",
          title: "Éclairage des sorties de l'arrière-boutique",
          category: "Sécurité",
          dueDate: "2025-03-06",
          assignedTo: "Morgan Lee",
          assignedUserId: "usr-sm2",
          assignedEmail: "morgan.lee@contoso.com",
          managerNotes: "Confirmez les luminaires près de la zone de chargement.",
          requiresProof: true,
          status: TaskStatus.ProofSubmitted,
          submissions: [
            {
              id: "SUB-1",
              submittedAt: "2025-02-18T15:10:00Z",
              status: TaskStatus.ProofSubmitted,
              comment: "Nouveaux luminaires installés près de la zone de chargement.",
              proofLinks: [
                "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80",
              ],
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
          title: "Mise à jour des affiches de sécurité",
          category: "Apparence du magasin",
          dueDate: "2025-03-08",
          assignedTo: "Morgan Lee",
          assignedUserId: "usr-sm2",
          assignedEmail: "morgan.lee@contoso.com",
          managerNotes: "Mettez à jour les affiches dans la salle de pause et la réserve.",
          requiresProof: true,
          status: TaskStatus.Approved,
          submissions: [
            {
              id: "SUB-1",
              submittedAt: "2025-02-16T09:18:00Z",
              status: TaskStatus.Approved,
              comment: "Affiches mises à jour dans la salle de pause et le back office.",
              proofLinks: [
                "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80",
              ],
              reviewerNotes: "Très bien.",
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
  auditEmailSends: [],
  auditNotifications: [],
};

export const storage = createLocalStorageAdapter({
  namespace: "followupapp",
  seed: initialStore,
});

export const store = storage.getStore();

export const state = {
  selectedAuditId: "AUD-2025-001",
  selectedTaskId: "AT-2003",
  selectedAssignee: null,
  activeUserId: "usr-admin",
  dragTaskId: null,
  storeManagerLocale: "en",
  storeManagerLocaleOverride: false,
};

const storeManagerLocaleContent = {
  en: {
    dateLocale: "en-US",
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
    taskOverviewTitle: "Task Overview",
    taskOverviewSubtitle: "Stay on top of due dates and proof submissions.",
    dueLabel: "Due",
    duePrefix: "Due",
    dueWindowLabel: "Due window",
    noDueDatesLabel: "No due dates",
    overdueLabel: "Overdue",
    managerNotesLabel: "Manager notes:",
    reviewerNotesLabel: "Reviewer notes:",
    proofUploadLabel: "Proof links",
    proofUploadRequired: "Please add at least one link before submitting.",
    proofUploadPlaceholder: "Paste one or more URLs (one per line).",
    notesToReviewerLabel: "Notes to reviewer",
    notesPlaceholder: "Add context for the reviewer...",
    actionCompleted: "Completed",
    actionSubmitted: "Submitted",
    actionResubmit: "Resubmit Proof",
    actionSubmit: "Submit Proof",
    submissionCount: (count) => `Submission #${count}`,
    noTasksAssigned: "No tasks assigned to you for this audit.",
    proofOptionalNote: "Proof links are not required for this task.",
  },
  fr: {
    dateLocale: "fr-CA",
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
    taskOverviewTitle: "Aperçu des tâches",
    taskOverviewSubtitle: "Suivez les échéances et les soumissions de preuves.",
    dueLabel: "Échéance",
    duePrefix: "Échéance",
    dueWindowLabel: "Période d'échéance",
    noDueDatesLabel: "Aucune date d'échéance",
    overdueLabel: "En retard",
    managerNotesLabel: "Notes du responsable :",
    reviewerNotesLabel: "Notes du réviseur :",
    proofUploadLabel: "Liens de preuve",
    proofUploadRequired: "Ajoutez au moins un lien avant de soumettre.",
    proofUploadPlaceholder: "Collez une ou plusieurs URL (une par ligne).",
    notesToReviewerLabel: "Notes au réviseur",
    notesPlaceholder: "Ajoutez du contexte pour le réviseur...",
    actionCompleted: "Terminé",
    actionSubmitted: "Soumis",
    actionResubmit: "Renvoyer la preuve",
    actionSubmit: "Soumettre la preuve",
    submissionCount: (count) => `Soumission nº${count}`,
    noTasksAssigned: "Aucune tâche ne vous est assignée pour cet audit.",
    proofOptionalNote: "Les liens de preuve ne sont pas requis pour cette tâche.",
  },
};

const defaultAuditEmailTemplates = {
  en: {
    subject: "Audit follow-up: {storeName} ({storeCode})",
    greeting: "Hi {assigneeName},",
    intro: "A new audit follow-up has been created and is ready for your review.",
    detailsLabel: "Audit details",
    summaryLabel: "Summary highlights",
    typeLabel: "Audit type",
    tasksLabel: "Total tasks",
    dueLabel: "Due date",
    linkLabel: "Open audit",
    auditorLabel: "Auditor",
    closing: "Thanks for keeping the follow-up on track.",
  },
  fr: {
    subject: "Suivi d'audit : {storeName} ({storeCode})",
    greeting: "Bonjour {assigneeName},",
    intro: "Un nouveau suivi d'audit est prêt pour votre révision.",
    detailsLabel: "Détails de l'audit",
    summaryLabel: "Points saillants",
    typeLabel: "Type d'audit",
    tasksLabel: "Nombre total de tâches",
    dueLabel: "Date d'échéance",
    linkLabel: "Ouvrir l'audit",
    auditorLabel: "Auditeur",
    closing: "Merci de maintenir le suivi sur la bonne voie.",
  },
};

export const emailTemplateSettings = {
  templates: JSON.parse(JSON.stringify(defaultAuditEmailTemplates)),
  powerApps: {
    source: "local",
    templateId: null,
    lastSyncedAt: null,
  },
};

function applyTemplateVariables(text, variables) {
  if (!text) return "";
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(variables, key) ? String(variables[key]) : match,
  );
}

function getEmailTemplate(locale) {
  const baseTemplate = defaultAuditEmailTemplates.en;
  const localeTemplate =
    emailTemplateSettings.templates[locale] || emailTemplateSettings.templates.en;
  return {
    subject: localeTemplate.subject || baseTemplate.subject,
    greeting: localeTemplate.greeting || baseTemplate.greeting,
    intro: localeTemplate.intro || baseTemplate.intro,
    detailsLabel: localeTemplate.detailsLabel || baseTemplate.detailsLabel,
    summaryLabel: localeTemplate.summaryLabel || baseTemplate.summaryLabel,
    typeLabel: localeTemplate.typeLabel || baseTemplate.typeLabel,
    tasksLabel: localeTemplate.tasksLabel || baseTemplate.tasksLabel,
    dueLabel: localeTemplate.dueLabel || baseTemplate.dueLabel,
    linkLabel: localeTemplate.linkLabel || baseTemplate.linkLabel,
    auditorLabel: localeTemplate.auditorLabel || baseTemplate.auditorLabel,
    closing: localeTemplate.closing || baseTemplate.closing,
  };
}

export const api = {
  async createSubmission({ taskId, comment, proofLinks }) {
    const taskEntry = getTaskEntry(taskId);
    if (!taskEntry) return null;
    const submission = storage.createSubmission(taskEntry.audit.id, taskEntry.task.id, {
      status: TaskStatus.ProofSubmitted,
      comment: comment || "",
      proofLinks: Array.isArray(proofLinks) ? proofLinks : [],
      reviewerNotes: "",
    });
    storage.updateTask(taskEntry.audit.id, taskEntry.task.id, {
      status: TaskStatus.ProofSubmitted,
      reviewerNotes: "",
    });
    return submission;
  },
  async reviewSubmission({ taskId, decision, reviewerNotes }) {
    const taskEntry = getTaskEntry(taskId);
    if (!taskEntry) return null;
    const task = storage.createDecision(taskEntry.audit.id, taskEntry.task.id, {
      status: decision,
      reviewerNotes,
    });
    if (!task) {
      throw new Error("No submission found for task.");
    }
    return task;
  },
};

export function getM365SourceLabel() {
  return m365Directory.accessMode === "graph" ? "Microsoft Graph API" : "Imported contact list";
}

export function getM365SourceHint() {
  const lastSync = m365Directory.lastSync
    ? `Last sync ${new Date(m365Directory.lastSync).toLocaleString("en-US")}.`
    : "";
  const securityNote = m365Directory.accessMode === "graph" ? "" : m365Directory.securityNote;
  return [getM365SourceLabel(), lastSync, securityNote].filter(Boolean).join(" ");
}

export function getUserById(id) {
  return users.find((user) => user.id === id) || null;
}

export function getStoreContactByCode(storeCode) {
  if (!storeCode) return null;
  const normalized = storeCode.trim().toLowerCase();
  return storeContacts.find((contact) => contact.storeCode.toLowerCase() === normalized) || null;
}

export async function loadDealerContacts() {
  try {
    const response = await fetch("./fixtures/dealer-contacts.json", { cache: "no-store" });
    if (!response.ok) {
      console.warn("Dealer contact fixture not found, using defaults.");
      return storeContacts;
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length) {
      storeContacts = data;
    }
  } catch (error) {
    console.warn("Unable to load dealer contacts fixture.", error);
  }
  return storeContacts;
}

export function getActiveUser() {
  return getUserById(state.activeUserId);
}

export function isAdmin() {
  return getActiveUser()?.role === "admin";
}

export function getRoleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "auditor") return "Auditor";
  return "Store Manager";
}

export function detectAuditLanguage(audit) {
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
  const taskFields = (audit.tasks || []).flatMap((task) => {
    const safeTask = task || {};
    return [safeTask.title, safeTask.managerNotes, safeTask.reviewerNotes];
  });
  const combinedText = [audit.storeName, audit.storeCode, ...taskFields]
    .map((value) => (value === null || value === undefined ? "" : String(value)))
    .filter((value) => value.trim())
    .join(" ")
    .toLowerCase();
  return frenchSignals.some((signal) => combinedText.includes(signal)) ? "fr" : "en";
}

export function getAuditLanguage(audit) {
  if (!audit) return "en";
  return audit.language || detectAuditLanguage(audit);
}

export function getStoreManagerStrings() {
  return storeManagerLocaleContent[state.storeManagerLocale] || storeManagerLocaleContent.en;
}

export function syncStoreManagerLocaleFromAudit(audit, localeSelect) {
  if (state.storeManagerLocaleOverride) return state.storeManagerLocale;
  const auditLocale = getAuditLanguage(audit);
  state.storeManagerLocale = auditLocale;
  if (localeSelect) {
    localeSelect.value = auditLocale;
  }
  return auditLocale;
}

export function getAuditById(auditId) {
  return storage.getAudit(auditId);
}

export function getTaskEntry(taskId) {
  for (const audit of store.audits) {
    const task = audit.tasks.find((entry) => entry.id === taskId);
    if (task) {
      return { audit, task };
    }
  }
  return null;
}

export function getSelectedAudit() {
  return getAuditById(state.selectedAuditId);
}

export function getAccessibleAudits() {
  const user = getActiveUser();
  if (!user) return [];
  if (user.role === "admin") return store.audits;
  if (user.role === "auditor") {
    return store.audits.filter((audit) => audit.ownerId === user.id);
  }
  const managedStores = storeContacts.filter(
    (contact) =>
      contact.storeManagerEmail?.toLowerCase() === user.email?.toLowerCase() ||
      contact.storeManager?.toLowerCase() === user.name?.toLowerCase(),
  );
  if (!managedStores.length) return [];
  const managedCodes = new Set(managedStores.map((contact) => contact.storeCode));
  return store.audits.filter((audit) => managedCodes.has(audit.storeCode));
}

export function getTasksForAudit(audit) {
  if (!audit) return [];
  const tasks = audit.tasks || [];
  if (isAdmin()) return [...tasks];
  const accessibleAudits = getAccessibleAudits();
  if (!accessibleAudits.some((entry) => entry.id === audit.id)) return [];
  return [...tasks];
}

export function getVisibleTasksForAudit(audit) {
  const user = getActiveUser();
  if (!user || !audit) return [];
  if (user.role === "store-manager") {
    return audit.tasks.filter(
      (task) =>
        task.assignedUserId === user.id || task.assignedTo === user.name || task.assignedEmail === user.email,
    );
  }
  return getTasksForAudit(audit);
}

export function getLatestPendingSubmission(audits) {
  const allTasks = audits.flatMap((audit) => audit.tasks.map((task) => ({ audit, task })));
  const submissions = allTasks.flatMap(({ audit, task }) =>
    storage
      .listSubmissions(audit.id, task.id)
      .map((submission) => ({ audit, task, submission })),
  );
  return submissions
    .filter((entry) => entry.submission.status === TaskStatus.ProofSubmitted)
    .sort((a, b) => new Date(b.submission.submittedAt) - new Date(a.submission.submittedAt))[0];
}

export function getLocalizedValue(value, locale = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en || value.fr || "";
}

export function getAuditTypeById(auditTypeId) {
  return store.auditTypes.find((type) => type.id === auditTypeId);
}

export function getAuditTypeLabel(auditTypeId, locale = "en") {
  const auditType = getAuditTypeById(auditTypeId);
  return auditType ? getLocalizedValue(auditType.name, locale) : auditTypeId || "";
}

export function getAuditTypeCategoryNames(auditTypeId, locale = "en") {
  const auditType = getAuditTypeById(auditTypeId);
  if (!auditType) return [];
  return auditType.categories.map((category) => getLocalizedValue(category.name, locale));
}

export function getAuditTypeTemplates(auditTypeId, locale = "en") {
  const auditType = getAuditTypeById(auditTypeId);
  if (!auditType) return [];
  return auditType.categories.flatMap((category) =>
    category.tasks.map((task) => ({
      id: task.id,
      title: getLocalizedValue(task.title, locale),
      category: getLocalizedValue(category.name, locale),
      notes: getLocalizedValue(task.notes, locale),
      requiresProof: task.requiresProof !== false,
      categoryId: category.id,
      auditTypeId: auditType.id,
    })),
  );
}

export function getAuditTypeTemplateEntry(auditTypeId, templateId) {
  const auditType = getAuditTypeById(auditTypeId);
  if (!auditType) return null;
  for (const category of auditType.categories) {
    const template = category.tasks.find((task) => task.id === templateId);
    if (template) {
      return { auditType, category, template };
    }
  }
  return null;
}

export function getUnassignedTemplates(audit) {
  if (!audit) return [];
  const locale = getAuditLanguage(audit);
  return getAuditTypeTemplates(audit.auditType, locale).filter(
    (template) => !audit.tasks.some((task) => task.templateId === template.id),
  );
}

export function generateTemplateId() {
  const templates = store.auditTypes.flatMap((type) =>
    type.categories.flatMap((category) => category.tasks),
  );
  const maxId = templates.reduce((max, template) => {
    const match = template.id?.match?.(/TPL-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 1000);
  return `TPL-${String(maxId + 1).padStart(4, "0")}`;
}

export function generateAuditTypeId() {
  const maxId = store.auditTypes.reduce((max, type) => {
    const match = type.id?.match?.(/ATY-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 1000);
  return `ATY-${String(maxId + 1).padStart(4, "0")}`;
}

export function generateAuditCategoryId() {
  const categories = store.auditTypes.flatMap((type) => type.categories);
  const maxId = categories.reduce((max, category) => {
    const match = category.id?.match?.(/CAT-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 2000);
  return `CAT-${String(maxId + 1).padStart(4, "0")}`;
}

export function generateAuditTaskId() {
  const tasks = store.audits.flatMap((audit) => audit.tasks);
  const maxId = tasks.reduce((max, task) => {
    const match = task.id.match(/AT-(\d+)/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 2000);
  return `AT-${String(maxId + 1).padStart(4, "0")}`;
}

function resolveLocale(localeOrLabels) {
  if (!localeOrLabels) return "en-US";
  if (typeof localeOrLabels === "string") {
    if (localeOrLabels === "fr") return "fr-CA";
    if (localeOrLabels === "en") return "en-US";
    return localeOrLabels;
  }
  if (typeof localeOrLabels === "object") {
    const locale =
      localeOrLabels.dateLocale || localeOrLabels.locale || localeOrLabels.language || null;
    if (locale === "fr") return "fr-CA";
    if (locale === "en") return "en-US";
    return locale || "en-US";
  }
  return "en-US";
}

export function formatDate(value, localeOrLabels) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString(resolveLocale(localeOrLabels), {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatAuditEmailDeadline(deadline, language) {
  if (!deadline) {
    return language === "fr" ? "À confirmer" : "TBD";
  }
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    return language === "fr" ? "À confirmer" : "TBD";
  }
  return date.toLocaleDateString(language === "fr" ? "fr-CA" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateAuditEmailTemplate({ audit, assignee, language, deadline, appLink }) {
  const locale = language || getAuditLanguage(audit);
  const assigneeName = assignee?.name || assignee?.displayName || assignee?.email || "";
  const owner = getUserById(audit?.ownerId);
  const tasksCount = audit?.tasks?.length ?? 0;
  const summary = audit?.summary || "";
  const formattedDeadline = formatAuditEmailDeadline(deadline, locale);
  const template = getEmailTemplate(locale);
  const templateVariables = {
    storeName: audit?.storeName || "Store",
    storeCode: audit?.storeCode || audit?.id || "Audit",
    auditId: audit?.id || "",
    assigneeName,
    auditType: getAuditTypeLabel(audit?.auditType, locale),
    tasksCount,
    dueDate: formattedDeadline,
    auditorName: owner?.name || "",
    appLink: appLink || "",
    summary,
  };
  const subject = applyTemplateVariables(template.subject, templateVariables);
  const bodyLines = [
    applyTemplateVariables(template.greeting, templateVariables),
    "",
    applyTemplateVariables(template.intro, templateVariables),
    "",
    `${applyTemplateVariables(template.detailsLabel, templateVariables)}:`,
    `• ${applyTemplateVariables("{storeName} ({storeCode})", templateVariables)}`,
    audit?.auditType
      ? `• ${applyTemplateVariables(template.typeLabel, templateVariables)}: ${templateVariables.auditType}`
      : null,
    `• ${applyTemplateVariables(template.tasksLabel, templateVariables)}: ${templateVariables.tasksCount}`,
    `• ${applyTemplateVariables(template.dueLabel, templateVariables)}: ${templateVariables.dueDate}`,
    owner
      ? `• ${applyTemplateVariables(template.auditorLabel, templateVariables)}: ${templateVariables.auditorName}`
      : null,
    appLink
      ? `• ${applyTemplateVariables(template.linkLabel, templateVariables)}: ${templateVariables.appLink}`
      : null,
    "",
    summary
      ? `${applyTemplateVariables(template.summaryLabel, templateVariables)}:\n${summary}`
      : null,
    "",
    applyTemplateVariables(template.closing, templateVariables),
  ].filter(Boolean);

  return {
    subject,
    body: bodyLines.join("\n"),
  };
}

export function logAuditEmailSend(payload) {
  const safePayload = payload && typeof payload === "object" ? payload : {};
  return storage.appendAuditEmailSend({
    ...safePayload,
    auditId: safePayload.auditId || "",
    subject: safePayload.subject || "",
  });
}

export function getStatusBadgeClass(status) {
  if (status === TaskStatus.ProofSubmitted || status === TaskStatus.Approved) {
    return "badge success";
  }
  if (status === TaskStatus.ProofRequested) {
    return "badge warning";
  }
  if (status === TaskStatus.Overdue) {
    return "badge danger";
  }
  if (status === TaskStatus.Rejected) {
    return "badge danger";
  }
  return "badge";
}

export function isTaskOverdue(task) {
  if (!task?.dueDate) return false;
  if (task.status === TaskStatus.Approved) return false;
  if (task.status === TaskStatus.Overdue) return true;
  const due = new Date(task.dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function formatDateRange(dates, localeOrLabels) {
  const labels = typeof localeOrLabels === "object" ? localeOrLabels : null;
  const validDates = dates
    .map((date) => (date ? new Date(date) : null))
    .filter((date) => date && !Number.isNaN(date.valueOf()));
  if (!validDates.length) return labels?.noDueDatesLabel || "No due dates";
  const sortedDates = validDates.sort((a, b) => a - b);
  const start = sortedDates[0];
  const end = sortedDates[sortedDates.length - 1];
  if (start.toDateString() === end.toDateString()) {
    const dueLabel = labels?.dueLabel || labels?.duePrefix || "Due";
    return `${dueLabel} ${formatDate(start, localeOrLabels)}`;
  }
  const dueWindowLabel = labels?.dueWindowLabel || "Due window";
  return `${dueWindowLabel} ${formatDate(start, localeOrLabels)} - ${formatDate(end, localeOrLabels)}`;
}

export function getAuditCompletionStatus(audit) {
  if (!audit || !audit.tasks.length) return "Open";
  const completed = audit.tasks.every((task) => task.status === TaskStatus.Approved);
  return completed ? "Complete" : "Open";
}

export function getSidebarMetrics() {
  const openAudits = store.audits.filter((audit) => getAuditCompletionStatus(audit) === "Open")
    .length;
  const tasksAwaitingApproval = store.audits
    .flatMap((audit) => audit.tasks)
    .filter((task) => task.status === TaskStatus.ProofSubmitted).length;
  return {
    openAudits,
    tasksAwaitingApproval,
  };
}

export function getRoleBadgeClass(role) {
  if (role === "admin") return "badge dark";
  if (role === "auditor") return "badge info";
  return "badge";
}

export function ensureSelectedAudit() {
  const accessibleAudits = getAccessibleAudits();
  if (!accessibleAudits.length) {
    state.selectedAuditId = null;
    return;
  }
  if (!accessibleAudits.some((audit) => audit.id === state.selectedAuditId)) {
    state.selectedAuditId = accessibleAudits[0].id;
  }
}

export function renderStoreManagerView(elements, { onTaskUpdated } = {}) {
  if (!elements) return;
  const audit = getSelectedAudit();
  syncStoreManagerLocaleFromAudit(audit, elements.storeManagerLocaleSelect);
  const strings = getStoreManagerStrings();
  const user = getActiveUser();
  if (elements.storeManagerTitle) {
    elements.storeManagerTitle.textContent = strings.screenTitle;
  }
  if (elements.storeManagerSubtitle) {
    elements.storeManagerSubtitle.textContent = audit
      ? `${strings.screenSubtitle} ${strings.currentAuditLabel}: ${audit.storeName} · ${audit.storeCode}.`
      : strings.screenSubtitle;
  }
  if (elements.storeManagerAuditLabel) {
    elements.storeManagerAuditLabel.textContent = strings.currentAuditLabel;
  }
  if (elements.storeManagerLanguageLabel) {
    elements.storeManagerLanguageLabel.textContent = strings.languageLabel;
  }
  if (elements.storeManagerTaskOverviewTitle) {
    elements.storeManagerTaskOverviewTitle.textContent = strings.taskOverviewTitle;
  }
  if (elements.storeManagerTaskOverviewSubtitle) {
    elements.storeManagerTaskOverviewSubtitle.textContent = strings.taskOverviewSubtitle;
  }
  if (elements.storeManagerLocaleSelect) {
    const englishOption = elements.storeManagerLocaleSelect.querySelector("option[value='en']");
    const frenchOption = elements.storeManagerLocaleSelect.querySelector("option[value='fr']");
    if (englishOption) englishOption.textContent = strings.languageEnglish;
    if (frenchOption) frenchOption.textContent = strings.languageFrench;
    elements.storeManagerLocaleSelect.value = state.storeManagerLocale;
  }

  const managerName = user?.role === "store-manager" ? user.name : "";
  if (!audit) {
    if (elements.managerAuditHeader) {
      elements.managerAuditHeader.innerHTML = `
        <h3>${strings.noAuditTitle}</h3>
        <p class="muted">${strings.noAuditBody}</p>
      `;
    }
    if (elements.managerTaskList) {
      elements.managerTaskList.innerHTML = "";
    }
    return;
  }

  const auditTasks = getVisibleTasksForAudit(audit);
  const managerTasks =
    user?.role === "store-manager"
      ? auditTasks.filter(
          (task) =>
            task.assignedUserId === user.id ||
            task.assignedEmail === user.email ||
            task.assignedTo === user.name,
        )
      : [];
  const dueWindow = formatDateRange(managerTasks.map((task) => task.dueDate), strings);

  if (elements.managerAuditHeader) {
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
  }

  if (!elements.managerTaskList) return;
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
    const requiresProof = task.requiresProof !== false;
    const actionLabel =
      task.status === TaskStatus.Approved
        ? strings.actionCompleted
        : task.status === TaskStatus.ProofSubmitted
          ? strings.actionSubmitted
          : task.status === TaskStatus.Rejected
            ? strings.actionResubmit
            : strings.actionSubmit;
    const disableAction = task.status === TaskStatus.Approved || task.status === TaskStatus.ProofSubmitted;
    taskCard.innerHTML = `
      <div class="manager-task-header">
        <div>
          <h4>${task.title}</h4>
          <p>${strings.duePrefix} ${formatDate(task.dueDate, strings)} · ${task.id}</p>
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
        task.status === TaskStatus.Rejected && task.reviewerNotes
          ? `<div class="manager-task-callout">${strings.reviewerNotesLabel} ${task.reviewerNotes}</div>`
          : ""
      }
      <div class="manager-task-body">
        ${
          requiresProof
            ? `
        <label class="field">
          ${strings.proofUploadLabel}
          <textarea rows="2" data-task-links="${task.id}" placeholder="${strings.proofUploadPlaceholder}"></textarea>
          <p class="field-error hidden" id="task-link-error-${task.id}" role="alert" data-task-link-error="${task.id}">${strings.proofUploadRequired}</p>
        </label>
        `
            : `<p class="muted">${strings.proofOptionalNote}</p>`
        }
        <label class="field">
          ${strings.notesToReviewerLabel}
          <textarea rows="3" data-task-notes="${task.id}" placeholder="${strings.notesPlaceholder}"></textarea>
        </label>
        <div class="manager-task-actions">
          <button class="${disableAction ? "secondary" : "primary"}" data-task-action="${
            task.id
          }" ${disableAction ? "disabled" : ""}>${actionLabel}</button>
          <span class="subtext">${strings.submissionCount(storage.listSubmissions(audit.id, task.id).length)}</span>
        </div>
      </div>
    `;

    const actionButton = taskCard.querySelector("[data-task-action]");
    const notesField = taskCard.querySelector("[data-task-notes]");
    const linksField = taskCard.querySelector("[data-task-links]");
    const linkError = taskCard.querySelector("[data-task-link-error]");

    actionButton.addEventListener("click", async () => {
      const notes = notesField.value.trim();
      const proofLinks = (linksField?.value || "")
        .split(/[\n,]+/)
        .map((link) => link.trim())
        .filter(Boolean);
      if (requiresProof && proofLinks.length === 0) {
        if (linkError) {
          linkError.classList.remove("hidden");
        }
        if (linksField) {
          linksField.setAttribute("aria-invalid", "true");
          if (linkError?.id) {
            linksField.setAttribute("aria-describedby", linkError.id);
          }
          linksField.focus();
        }
        return;
      }
      if (linkError) {
        linkError.classList.add("hidden");
      }
      if (linksField) {
        linksField.removeAttribute("aria-invalid");
        linksField.removeAttribute("aria-describedby");
      }
      await api.createSubmission({ taskId: task.id, comment: notes, proofLinks });
      if (onTaskUpdated) {
        onTaskUpdated();
      }
      renderStoreManagerView(elements, { onTaskUpdated });
    });

    if (linksField) {
      linksField.addEventListener("input", () => {
        if (linkError && linksField.value.trim().length > 0) {
          linkError.classList.add("hidden");
          linksField.removeAttribute("aria-invalid");
          linksField.removeAttribute("aria-describedby");
        }
      });
    }

    elements.managerTaskList.appendChild(taskCard);
  });
}
