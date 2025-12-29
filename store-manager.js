import {
  ensureSelectedAudit,
  renderStoreManagerView,
  state,
} from "./shared.js";

const elements = {
  storeManagerTitle: document.getElementById("store-manager-title"),
  storeManagerSubtitle: document.getElementById("store-manager-subtitle"),
  storeManagerBanner: document.getElementById("store-manager-banner"),
  storeManagerLocaleSelect: document.getElementById("store-manager-locale"),
  storeManagerLanguageLabel: document.getElementById("store-manager-language-label"),
  managerAuditHeader: document.getElementById("manager-audit-header"),
  managerTaskList: document.getElementById("manager-task-list"),
};

function renderStoreManager() {
  renderStoreManagerView(elements);
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
  state.viewAsUserId = null;
  state.storeManagerLocaleOverride = false;
  ensureSelectedAudit();
  renderStoreManager();
}

init();
