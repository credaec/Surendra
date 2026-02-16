// Core Entities

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    status: UserStatus;
    avatarUrl?: string; // For UI
    department?: string;
    designation?: string;
    joiningDate?: string;
    hourlyCostRate?: number; // Admin only, internal cost
}

export interface UserAssignment {
    id: string;
    userId: string;
    categoryId: string;
    projectId?: string; // Optional if linked to specific project
    assignedAt: string;
    assignedBy?: string; // ID of the Admin/Manager who assigned it
}


export interface ClientContact {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    isPrimary?: boolean;
}

export interface Client {
    id: string;
    name: string;
    companyName: string;
    email?: string;
    phone?: string;
    currency: 'USD' | 'INR'; // Default currency
    status: 'ACTIVE' | 'INACTIVE';
    totalProjects: number;
    contacts?: ClientContact[];
}

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED' | 'DELETED';
export type ProjectType = 'HOURLY' | 'FIXED' | 'RETAINER' | 'INTERNAL';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
    id: string;
    code: string;
    name: string;
    clientId: string;
    clientName: string; // Denormalized for UI
    status: ProjectStatus;
    type: ProjectType;
    priority: Priority;

    description?: string;
    startDate: string;
    endDate?: string;
    deliveryDate?: string;

    // Budget & Financials (Admin Only)
    budgetAmount?: number;
    currency: 'USD' | 'INR' | 'EUR' | 'GBP';
    estimatedHours: number;
    monthlyHourCap?: number;

    // Billing Config
    billingMode: 'HOURLY_RATE' | 'FIXED_FEE' | 'RETAINER';
    rateLogic: 'GLOBAL_PROJECT_RATE' | 'CATEGORY_BASED_RATE' | 'EMPLOYEE_BASED_RATE';
    globalRate?: number; // Used if rateLogic is GLOBAL

    // Milestones (Optional)
    milestones?: {
        id: string;
        name: string;
        estimatedHours?: number;
        budgetAmount?: number;
        deadline?: string;
        status: 'PENDING' | 'COMPLETED';
    }[];

    // Team Configuration
    teamMembers: {
        userId: string;
        role: 'PROJECT_MANAGER' | 'ENGINEER' | 'DRAFTER' | 'REVIEWER';
        accessLevel: {
            canLogTime: boolean;
            canEditEntries: boolean;
            canApproveTime: boolean;
        };
        costRate?: number; // Internal cost
        billableRate?: number; // Specific billable rate for this project
        maxHoursPerWeek?: number;
    }[];

    // Task & Entry Rules
    allowedCategoryIds?: string[]; // If empty, all allowed
    entryRules: {
        notesRequired: boolean;
        proofRequired: boolean;
        minTimeUnit: 5 | 10 | 15; // Minutes
        allowFutureEntry: boolean;
        allowBackdatedEntry: boolean;
    };

    // Notification Thresholds
    alerts: {
        budgetThresholdPct: number; // e.g., 80
        deadlineAlertDays: number; // e.g., 7
    };

    // Legacy metrics (kept for compatibility, though likely computed)
    usedHours: number;
    usedBudget?: number;
    billableHours: number;
    projectManagerId?: string; // Kept for quick lookup
    documents?: ProjectDocument[];
}

export interface ProjectDocument {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
    uploadedBy: string;
}

export interface TaskCategory {
    id: string;
    name: string;
    isBillable: boolean;
    defaultRate?: number; // Optional override
    isProofRequired: boolean;
    isNotesRequired: boolean;
    restrictedToProjects?: string[]; // IDs of projects this is allowed for. If empty, allowed for all.
    status?: 'ACTIVE' | 'INACTIVE';
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    categoryId: string;
    assignedToId?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
    priority: Priority;
    dueDate?: string;
}

export type TimeEntryStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'LOCKED' | 'PAUSED';

export interface TimeEntry {
    id: string;
    userId: string;
    projectId: string;
    taskId?: string; // Optional if logging against category directly
    categoryId: string; // Required

    date: string;
    startTime?: string;
    endTime?: string;
    durationMinutes: number;

    description?: string;
    notes?: string;
    isBillable: boolean;
    status: TimeEntryStatus;

    proofUrl?: string; // Attachment
    deletedAt?: string; // ISO String for soft delete
    activityLogs?: string; // JSON String of activity logs
    isEdited?: boolean;
    lastEditedAt?: string;
}

export interface Timesheet {
    id: string;
    userId: string;
    weekStartDate: string;
    weekEndDate: string;
    totalMinutes: number;
    status: TimeEntryStatus;
    submittedAt?: string;
    approvedBy?: string;
}

export interface AvailabilityEvent {
    id: string;
    title: string;
    type: 'HOLIDAY' | 'LEAVE' | 'busy' | 'available' | 'tentative';
    subType?: 'NATIONAL' | 'COMPANY' | 'SICK' | 'CASUAL' | 'WFH' | 'OTHER';
    startDate: string;
    endDate: string;
    start?: Date;
    end?: Date;
    isAllDay?: boolean;
    resourceId?: string; // Employee ID if LEAVE
    userId?: string; // Legacy/Optional
    notes?: string;
    createdBy?: string;
    createdAt: string;
}
