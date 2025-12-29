# Audit Follow-Up Tracking App — Build Package

## A) Architecture (1 page)
**Components**
- **SharePoint Lists**: StoreContacts, AuditFollowUps, AuditTasks, ReminderRules, TaskSubmissions (optional but recommended for resubmissions).
- **SharePoint Document Library**: ProofLibrary (stores proof images by task and submission).
- **Power Apps Canvas App**: Single app for audit creation, task management, proof submission, and review.
- **Power Automate Cloud Flows**: Reminders/escalations, proof submission notification, approve/reject notification, optional task creation automation.
- **Outlook + Teams**: Notification channels.

**Data Flow (high level)**
1. Auditor creates **AuditFollowUp** record in Power Apps, referencing **StoreContacts** by *Store / Dealer Code*.
2. Auditor creates **AuditTasks** for failed points (manual or bulk entry). Each task is assigned to SM from StoreContacts.
3. Store submits proof in Power Apps, creating a **TaskSubmissions** record and uploading files to **ProofLibrary** folder for that task.
4. Reviewer approves/rejects in Power Apps; task status updates and notifications are sent.
5. Scheduled flow reads **ReminderRules** and **AuditTasks** to send reminders/escalations based on due dates.

**Security Model Overview**
- **Primary Key** across solution: *Store / Dealer Code*.
- **Store users**: view/edit only tasks for their Store / Dealer Code; can upload proof.
- **RM/Director**: view tasks for their assigned stores.
- **Reviewer (you)**: full control.
- **Implementation options** (see section G):
  - **Simple**: SharePoint list permissions + app-level filters.
  - **Strict**: Item-level permissions set by flow (more complex but tighter).

## B) Data Model (SharePoint)

### 1) StoreContacts (SharePoint List)
**Purpose**: Master reference imported from Excel. *Store / Dealer Code* is the key used in all lookups.

**Columns** (use exact names from Excel):
- Brand (Single line of text)
- Store / Dealer Code (Single line of text) **Required, Indexed, Unique**
- Cost center (Single line of text)
- ROS (Single line of text)
- Prov (Single line of text)
- City (Single line of text)
- Postal code (Single line of text)
- Location Name (Single line of text)
- Store Phone # (Single line of text)
- Director (Single line of text)
- Director email (Single line of text)
- RM (Single line of text)
- RM Email (Single line of text)
- SM (Single line of text)
- SM Email (Single line of text)
- SM Cellphone (Single line of text)
- Type (Single line of text)
- Store Email (Single line of text)
- RM Cellphone (Single line of text)
- Device / Access. Planner (Single line of text)
- Support Expert Email (Single line of text)
- Employee List (Multiple lines of text)
- Store Tier (Single line of text)
- Footprint (Single line of text)
- Address (Single line of text)
- Area Name (Single line of text)
- Province Name (Single line of text)
- Opening Date (Date only)

**Indexes**
- Store / Dealer Code (unique index)
- RM Email (index)
- Director email (index)

**Relationships**
- Used as lookup from AuditFollowUps and AuditTasks based on Store / Dealer Code.

---

### 2) AuditFollowUps (SharePoint List)
**Purpose**: One record per audit visit.

**Columns**
- Title (Single line of text) — **Audit Identifier** (e.g., `AUD-2025-001`) **Required**
- Store / Dealer Code (Single line of text) **Required, Indexed**
- Store Name (Single line of text) — derived from StoreContacts.Location Name
- Audit Date (Date only) **Required**
- Audit Completed By (Person or Group) **Required**
- AI Summary (Multiple lines of text, enhanced rich text)
- Audit Photos Folder Link (Hyperlink) **Required**
- Status (Choice): `Open`, `Closed`
- Total Failed Points (Number)

**Indexes**
- Store / Dealer Code
- Audit Date
- Status

**Relationships**
- One AuditFollowUp → many AuditTasks

---

### 3) AuditTasks (SharePoint List)
**Purpose**: One record per failed point/task.

**Columns**
- Title (Single line of text) — **Task Title / Failed Point** **Required**
- AuditFollowUpId (Lookup to AuditFollowUps: Title) **Required**
- Store / Dealer Code (Single line of text) **Required, Indexed**
- Due Date (Date only) **Required**
- Assigned To Email (Single line of text) — default SM Email from StoreContacts **Required**
- Assigned To Name (Single line of text) — default SM
- Status (Choice) **Required**: `Not Started`, `Proof Submitted`, `Rejected`, `Accepted`, `Closed`
- Overdue (Yes/No) — calculated by flow or Power Apps
- Last Proof Submission Date (Date/Time)
- Current Submission # (Number)
- Review Notes (Multiple lines of text)
- Task Link (Hyperlink) — deep link to Power Apps screen (optional)

**Indexes**
- Store / Dealer Code
- Due Date
- Status
- Assigned To Email

**Relationships**
- Many tasks → one AuditFollowUp
- One task → many TaskSubmissions (optional list)

---

### 4) ReminderRules (SharePoint List)
**Purpose**: Configurable notification rules for reminders/escalations.

**Columns**
- Title (Single line of text) — Rule Name (e.g., `D-14 Teams to SM`)
- DaysBeforeDue (Number) **Required** (e.g., 14, 7, 3, -1 for past due)
- Channel (Choice): `Teams`, `Email`
- Recipients (Choice, multi-select): `SM`, `RM`, `Director`
- Enabled (Yes/No) **Required**
- Priority (Number) — sort order if multiple rules match same day
- Message Template (Multiple lines of text, enhanced rich text)

**Default rows (insert exactly as configuration):**
1. Title: `D-14 Teams to SM` | DaysBeforeDue: 14 | Channel: Teams | Recipients: SM | Enabled: Yes
2. Title: `D-7 Teams+Email to SM, Email RM` | DaysBeforeDue: 7 | Channel: Teams | Recipients: SM | Enabled: Yes
3. Title: `D-7 Email to SM+RM` | DaysBeforeDue: 7 | Channel: Email | Recipients: SM, RM | Enabled: Yes
4. Title: `D-3 Email to SM+RM` | DaysBeforeDue: 3 | Channel: Email | Recipients: SM, RM | Enabled: Yes
5. Title: `Past Due Email to SM+RM+Director` | DaysBeforeDue: -1 | Channel: Email | Recipients: SM, RM, Director | Enabled: Yes

---

### 5) TaskSubmissions (SharePoint List) — Optional but recommended
**Purpose**: Track multiple proof submissions for the same task.

**Columns**
- Title (Single line of text) — Submission label (e.g., `Task 123 - Submission 2`)
- TaskId (Lookup to AuditTasks: Title) **Required**
- Submission # (Number) **Required**
- Submitted By (Person or Group) **Required**
- Submitted On (Date/Time) **Required**
- Status (Choice): `Submitted`, `Reviewed`, `Rejected`, `Accepted`
- Reviewer (Person or Group)
- Review Date (Date/Time)
- Review Notes (Multiple lines of text)
- Proof Folder Link (Hyperlink) — link to proof folder in library

**Indexes**
- TaskId
- Submission #
- Submitted On

---

### 6) ProofLibrary (SharePoint Document Library)
**Purpose**: Store proof images per task and submission.

**Folder Structure (required)**
```
/ProofLibrary/Proof/{AuditFollowUpID}/{TaskID}/Submission_{n}/
```

**Metadata Columns**
- AuditFollowUpId (Single line of text)
- TaskId (Single line of text)
- Submission # (Number)
- Store / Dealer Code (Single line of text)
- Uploaded By (Person or Group)
- Uploaded On (Date/Time)

**Indexes**
- TaskId
- Store / Dealer Code

---

## C) Import strategy for the Excel contact list

### Option 1: One-time import + periodic refresh (recommended)
**Best for:** Stable contact list with occasional updates.

**Steps**
1. Store the Excel file in SharePoint (e.g., `Documents/ContactMaster/StoreContacts.xlsx`).
2. Use **SharePoint: Import spreadsheet** to create or refresh `StoreContacts` list.
3. After import, verify `Store / Dealer Code` is unique and indexed.
4. For periodic refresh:
   - Export SharePoint list to Excel, update rows, then re-import.
   - Or use a Power Automate sync (see Option 2).

### Option 2: Power Automate sync from Excel in SharePoint (non-premium)
**Best for:** Continuous updates by business users.

**Steps**
1. Keep Excel file in SharePoint library; ensure table name is `StoreContactsTable`.
2. Create a scheduled flow (daily or hourly).
3. Flow outline:
   - Trigger: Recurrence
   - Action: **List rows present in a table** (Excel Online (Business))
   - For each row:
     - **Get items** from `StoreContacts` where `Store / Dealer Code` equals Excel row.
     - If exists → **Update item**.
     - If not exists → **Create item**.
4. Add basic error handling: log failures to a SharePoint list (optional).

---

## D) Power Apps (Canvas) Design

### Naming conventions
- Screens: `scrHome`, `scrCreateAudit`, `scrCreateTasks`, `scrTaskList`, `scrTaskDetail`, `scrReviewerQueue`
- Galleries: `galTasks`, `galSubmissions`
- Forms: `frmAudit`, `frmTask`
- Inputs: `txtDealerCode`, `txtAuditId`, `dtpDueDate`
- Variables: `varDealerCode`, `varAuditId`, `varSelectedTask`, `varSubmissionNum`

### Screen 1: Home / Search by Dealer Code (`scrHome`)
**Controls**
- `txtDealerCode` (Text input)
- `btnSearch`

**OnSelect (btnSearch)**
```powerfx
Set(varDealerCode, Trim(txtDealerCode.Text));
Set(varStore, LookUp(StoreContacts, 'Store / Dealer Code' = varDealerCode));
If(IsBlank(varStore), Notify("Store not found", NotificationType.Error), Navigate(scrCreateAudit));
```

---

### Screen 2: Create Audit Follow-Up (`scrCreateAudit`)
**Controls**
- `frmAudit` (Form connected to `AuditFollowUps`)
- Fields: Title, Audit Date, Audit Completed By, AI Summary, Audit Photos Folder Link
- Auto-fill: Store / Dealer Code, Store Name
- `btnSaveAudit`

**Default values**
- Store / Dealer Code: `varDealerCode`
- Store Name: `varStore.'Location Name'`

**OnSelect (btnSaveAudit)**
```powerfx
SubmitForm(frmAudit);
If(frmAudit.Valid,
   Set(varAuditId, frmAudit.LastSubmit.ID);
   Navigate(scrCreateTasks)
);
```

---

### Screen 3: Create Tasks from failed points (`scrCreateTasks`)
**Controls**
- `txtTaskTitle`
- `dtpDueDate`
- `btnAddTask`
- `colTasks` (collection for bulk add)
- `btnBulkAdd`

**OnSelect (btnAddTask)**
```powerfx
Collect(colTasks, {
  Title: txtTaskTitle.Text,
  DueDate: dtpDueDate.SelectedDate
});
Reset(txtTaskTitle);
```

**OnSelect (btnBulkAdd)**
```powerfx
ForAll(colTasks,
  Patch(AuditTasks, Defaults(AuditTasks), {
    Title: Title,
    'AuditFollowUpId': varAuditId,
    'Store / Dealer Code': varDealerCode,
    'Due Date': DueDate,
    'Assigned To Email': varStore.'SM Email',
    'Assigned To Name': varStore.SM,
    Status: "Not Started"
  })
);
Clear(colTasks);
Navigate(scrTaskList);
```

---

### Screen 4: Task List View (`scrTaskList`)
**Controls**
- `galTasks` (Gallery)
- Filters (dropdown for Status)

**Items (galTasks)**
```powerfx
Filter(AuditTasks, 'Store / Dealer Code' = varDealerCode)
```

**OnSelect (galTasks)**
```powerfx
Set(varSelectedTask, ThisItem);
Navigate(scrTaskDetail);
```

---

### Screen 5: Task Detail (`scrTaskDetail`)
**Controls**
- Task details card
- `btnUploadProof` (Attachment control)
- `btnSubmitProof`

**OnSelect (btnSubmitProof)**
```powerfx
Set(varSubmissionNum, varSelectedTask.'Current Submission #'+1);
Patch(TaskSubmissions, Defaults(TaskSubmissions), {
  Title: "Task " & varSelectedTask.ID & " - Submission " & varSubmissionNum,
  TaskId: varSelectedTask.ID,
  'Submission #': varSubmissionNum,
  'Submitted By': User(),
  'Submitted On': Now(),
  Status: "Submitted"
});
Patch(AuditTasks, varSelectedTask, {
  Status: "Proof Submitted",
  'Current Submission #': varSubmissionNum,
  'Last Proof Submission Date': Now()
});
Notify("Proof submitted", NotificationType.Success);
```

---

### Screen 6: Reviewer Queue (`scrReviewerQueue`)
**Controls**
- `galReview` (Gallery of tasks where Status = "Proof Submitted")
- Approve/Reject buttons

**Items (galReview)**
```powerfx
Filter(AuditTasks, Status = "Proof Submitted")
```

**OnSelect (btnApprove)**
```powerfx
Patch(AuditTasks, ThisItem, {
  Status: "Accepted",
  'Review Notes': txtReviewNotes.Text
});
```

**OnSelect (btnReject)**
```powerfx
Patch(AuditTasks, ThisItem, {
  Status: "Rejected",
  'Review Notes': txtReviewNotes.Text
});
```

---

## E) Power Automate Flows

### Flow 1: Scheduled Reminder/Escalation (daily)
**Trigger**: Recurrence (daily at 7 AM)

**Steps**
1. Get items from `AuditTasks` where Status != Closed.
2. For each task:
   - Calculate `DaysToDue` = difference between Due Date and utcNow().
   - Get ReminderRules where Enabled = Yes and DaysBeforeDue matches DaysToDue (or -1 for overdue).
   - Resolve recipients from StoreContacts using Store / Dealer Code.
3. Send Teams or Email based on rule.

**Key Expression (DaysToDue)**
```text
int(div(sub(ticks(items('Apply_to_each_Task')?['Due Date']), ticks(utcNow())), 864000000000))
```

**Teams fallback**
- If Teams chat fails, send email to SM.

---

### Flow 2: On Proof Uploaded → Notify Reviewer
**Trigger**: When item created in TaskSubmissions
**Steps**
1. Update AuditTasks status to "Proof Submitted".
2. Send notification to reviewer (you).

---

### Flow 3: On Approve/Reject → Notify Store
**Trigger**: When item modified in AuditTasks
**Condition**: Status changed to Accepted or Rejected
**Actions**
- Send email to SM with review decision.
- If Rejected, include reason and link to task.

---

## F) Proof Storage Design
- Folder path: `/ProofLibrary/Proof/{AuditFollowUpID}/{TaskID}/Submission_{n}/`
- Metadata captured on each file upload: TaskId, Submission #, Store / Dealer Code
- Power Apps: use attachment control + Power Automate to move into the correct folder
- Reviewer: open task detail screen to see proof gallery filtered by TaskId

---

## G) Permissions / Governance

**Simple approach**
- SharePoint list permissions: everyone can read, only assigned users edit.
- App-level filtering by Store / Dealer Code.

**Strict approach**
- Use Power Automate to break inheritance per list item.
- Grant SM, RM, Director on tasks for their stores.
- Caution: item-level permissions at scale can affect performance.

---

## H) Reporting
- SharePoint views: Overdue tasks, Tasks by Status, Tasks by Store.
- Excel pivot: connect to `AuditTasks` list for metrics like average close time.
- Power BI ready: use AuditTasks + TaskSubmissions for data model.

---

## I) Test Plan (15+ cases)
1. Create audit with valid Dealer Code → tasks created.
2. Invalid Dealer Code → error.
3. Task due date set → reminder rule triggers correctly at D-14, D-7, D-3.
4. Past due tasks trigger escalation to SM+RM+Director.
5. Proof submission updates task status to Proof Submitted.
6. Multiple submissions increment submission number.
7. Reviewer approves → task status Accepted.
8. Reviewer rejects → task status Rejected, store notified.
9. Rejected task allows resubmission.
10. Missing SM email → flow logs error and notifies admin.
11. RM and Director emails resolved correctly from StoreContacts.
12. Store user can only see their tasks.
13. RM sees tasks for assigned stores.
14. Proof files saved in correct folder path.
15. Audit photos folder link included in reminders.
16. Task list filters (overdue, waiting review) work correctly.
17. Close task after acceptance.
