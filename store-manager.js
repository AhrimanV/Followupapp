import {
  ensureSelectedAudit,
  getAccessibleAudits,
  getStoreManagerStrings,
  renderStoreManagerView,
  state,
} from "./shared.js";

const elements = {
  storeManagerTitle: document.getElementById("store-manager-title"),
  storeManagerSubtitle: document.getElementById("store-manager-subtitle"),
  storeManagerAuditLabel: document.getElementById("store-manager-audit-label"),
  storeManagerAuditSelect: document.getElementById("store-manager-audit-select"),
  storeManagerLocaleSelect: document.getElementById("store-manager-locale"),
  storeManagerLanguageLabel: document.getElementById("store-manager-language-label"),
  managerAuditHeader: document.getElementById("manager-audit-header"),
  managerTaskList: document.getElementById("manager-task-list"),
};

function populateAuditSelect() {
  if (!elements.storeManagerAuditSelect) return;
  const audits = getAccessibleAudits();
  const strings = getStoreManagerStrings();
  elements.storeManagerAuditSelect.innerHTML = "";

  if (!audits.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = strings.noAuditTitle;
    elements.storeManagerAuditSelect.appendChild(option);
    elements.storeManagerAuditSelect.disabled = true;
    return;
  }

  audits.forEach((audit) => {
    const option = document.createElement("option");
    option.value = audit.id;
    option.textContent = `${audit.storeName} · ${audit.storeCode}`;
    elements.storeManagerAuditSelect.appendChild(option);
  });
  elements.storeManagerAuditSelect.disabled = false;
  elements.storeManagerAuditSelect.value = state.selectedAuditId || audits[0].id;
}

function renderStoreManager() {
  populateAuditSelect();
  renderStoreManagerView(elements);
}

if (elements.storeManagerAuditSelect) {
  elements.storeManagerAuditSelect.addEventListener("change", (event) => {
    state.selectedAuditId = event.target.value || null;
    renderStoreManager();
  });
}

if (elements.storeManagerLocaleSelect) {
  elements.storeManagerLocaleSelect.addEventListener("change", (event) => {
    state.storeManagerLocale = event.target.value;
    state.storeManagerLocaleOverride = true;
    renderStoreManager();
  });
}

function init() {
  state.activeUserId = "usr-sm1";
  state.storeManagerLocaleOverride = false;
  ensureSelectedAudit();
  renderStoreManager();
}

init();
