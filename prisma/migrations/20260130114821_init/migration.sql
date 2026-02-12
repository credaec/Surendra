-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "avatarUrl" TEXT,
    "department" TEXT,
    "designation" TEXT,
    "joiningDate" DATETIME,
    "hourlyCostRate" REAL,
    "avatarInitials" TEXT
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "totalProjects" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ClientContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClientDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "uploadDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "ClientDocument_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "type" TEXT NOT NULL DEFAULT 'HOURLY',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "deliveryDate" DATETIME,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "budgetAmount" REAL,
    "estimatedHours" REAL,
    "monthlyHourCap" REAL,
    "billingMode" TEXT NOT NULL,
    "rateLogic" TEXT NOT NULL,
    "globalRate" REAL,
    "milestones" TEXT,
    "teamMembers" TEXT,
    "entryRules" TEXT,
    "alerts" TEXT,
    "usedHours" REAL NOT NULL DEFAULT 0,
    "billableHours" REAL NOT NULL DEFAULT 0,
    "usedBudget" REAL,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isBillable" BOOLEAN NOT NULL DEFAULT true,
    "defaultRate" REAL,
    "isProofRequired" BOOLEAN NOT NULL DEFAULT false,
    "isNotesRequired" BOOLEAN NOT NULL DEFAULT false,
    "restrictedToProjects" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" DATETIME,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TaskCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskId" TEXT,
    "categoryId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "durationMinutes" INTEGER NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "isBillable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "proofUrl" TEXT,
    "deletedAt" DATETIME,
    "activityLogs" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "lastEditedAt" DATETIME,
    CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TimeEntry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TaskCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "projectId" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    CONSTRAINT "UserAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAssignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TaskCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AvailabilityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subType" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isAllDay" BOOLEAN NOT NULL DEFAULT true,
    "resourceId" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNo" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "projectId" TEXT,
    "projectName" TEXT,
    "date" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "taxAmount" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "balanceAmount" REAL NOT NULL,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payments" TEXT,
    "type" TEXT NOT NULL DEFAULT 'FIXED',
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayrollRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "period" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalEmployees" INTEGER NOT NULL,
    "totalPayable" REAL NOT NULL,
    "totalApprovedHours" REAL NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedBy" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "PayrollRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payrollRunId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "designation" TEXT,
    "department" TEXT,
    "joinDate" DATETIME,
    "totalHours" REAL NOT NULL,
    "approvedHours" REAL NOT NULL,
    "billableHours" REAL NOT NULL,
    "nonBillableHours" REAL NOT NULL,
    "rateType" TEXT NOT NULL,
    "hourlyRate" REAL NOT NULL,
    "basePay" REAL NOT NULL,
    "overtimeHours" REAL NOT NULL DEFAULT 0,
    "overtimeAmount" REAL NOT NULL DEFAULT 0,
    "deductions" REAL NOT NULL DEFAULT 0,
    "bonus" REAL NOT NULL DEFAULT 0,
    "totalPayable" REAL NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "PayrollRecord_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "PayrollRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PayrollRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");
