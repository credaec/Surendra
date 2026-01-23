export interface CompanyConfig {
    name: string;
    logoUrl?: string; // Optional
    address: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
    weekStartDay: 'MONDAY' | 'SUNDAY';
    workingDays: string[]; // e.g. ['MON', 'TUE', '...']
    currency: 'USD' | 'INR' | 'EUR';
    secondaryCurrency?: string;
}

export interface TimesheetConfig {
    minHoursPerDay?: number;
    maxHoursPerDay: number;
    allowFutureEntries: boolean;
    allowBackdatedEntries: boolean;
    requireDescription: boolean;
    requireProof: boolean;
    autoSubmitWeekly: boolean; // Sunday 11:59 PM
    approvalMode: 'SINGLE_LEVEL' | 'MULTI_LEVEL';
}

export interface BillingConfig {
    invoicePrefix: string;
    startingNumber: string;
    defaultPaymentTerms: 'NET7' | 'NET15' | 'NET30';
    defaultTaxPercentage: number;
    invoiceNotesTemplate: string;
    blockInvoicingForPending: boolean;
    billableApprovedOnly: boolean;
}

export interface PayrollConfig {
    defaultRateType: 'HOURLY' | 'MONTHLY';
    payrollCycle: 'MONTHLY' | 'BI_WEEKLY';
    lockPayrollAfterGeneration: boolean;
    allowMidMonthRateChanges: boolean;
}

export interface SecurityConfig {
    minPasswordLength: number;
    sessionTimeoutMinutes: number;
    forceLogoutAfterDays: number;
    twoFactorEnabled: boolean;
    allowAdminRoleSwitch: boolean;
}

export interface EmailConfig {
    service: 'Outlook' | 'Custom';
    authType: 'OAUTH2' | 'STANDARD';
    fromEmail: string;
    fromName: string;
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password?: string; // Standard Auth
    clientId?: string; // OAuth2
    clientSecret?: string; // OAuth2
    refreshToken?: string; // OAuth2
}

export interface AppSettings {
    company: CompanyConfig;
    timesheet: TimesheetConfig;
    billing: BillingConfig;
    payroll: PayrollConfig;
    security: SecurityConfig;
    notifications: {
        emailAlerts: boolean;
        inAppAlerts: boolean;
        remindPendingApprovals: boolean;
    };
    client: ClientConfig;
    project: ProjectConfig;
    email: EmailConfig; // New
}

// ... (ClientConfig and ProjectConfig interfaces remain unchanged)
export interface ClientConfig {
    requireEmailPhone: boolean;
    enableCategories: boolean;
}

export interface ProjectConfig {
    defaultStatus: 'Active' | 'Planning' | 'On Hold';
    defaultBudgetType: 'Total Project Hours' | 'Total Project Fees' | 'No Budget';
    allowMultipleAssignments: boolean;
    requireProjectManager: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    company: {
        name: 'Credence Time Tracker',
        address: '123 Tech Park',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        timezone: 'UTC-8',
        weekStartDay: 'MONDAY',
        workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        currency: 'USD'
    },
    timesheet: {
        maxHoursPerDay: 16,
        allowFutureEntries: false,
        allowBackdatedEntries: true,
        requireDescription: true,
        requireProof: true,
        autoSubmitWeekly: false,
        approvalMode: 'SINGLE_LEVEL'
    },
    billing: {
        invoicePrefix: 'INV-',
        startingNumber: '0001',
        defaultPaymentTerms: 'NET30',
        defaultTaxPercentage: 0,
        invoiceNotesTemplate: 'Thank you for your business.',
        blockInvoicingForPending: true,
        billableApprovedOnly: true
    },
    payroll: {
        defaultRateType: 'HOURLY',
        payrollCycle: 'MONTHLY',
        lockPayrollAfterGeneration: true,
        allowMidMonthRateChanges: true
    },
    security: {
        minPasswordLength: 8,
        sessionTimeoutMinutes: 30,
        forceLogoutAfterDays: 7,
        twoFactorEnabled: false,
        allowAdminRoleSwitch: true
    },
    notifications: {
        emailAlerts: true,
        inAppAlerts: true,
        remindPendingApprovals: true
    },
    client: {
        requireEmailPhone: true,
        enableCategories: false
    },
    project: {
        defaultStatus: 'Active',
        defaultBudgetType: 'Total Project Hours',
        allowMultipleAssignments: true,
        requireProjectManager: false
    },
    email: {
        service: 'Custom',
        authType: 'STANDARD',
        fromEmail: 'noreply@credencetracker.com',
        fromName: 'Credence Notifications',
        host: 'smtp.example.com',
        port: 587,
        secure: true,
        username: 'apikey',
        password: ''
    }
};

const STORAGE_KEY = 'credence_app_settings_v1';

import { auditService } from './auditService';

export const settingsService = {
    getSettings: (): AppSettings => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return DEFAULT_SETTINGS;
    },

    updateSettings: (newSettings: Partial<AppSettings>): AppSettings => {
        const current = settingsService.getSettings();
        const updated = { ...current, ...newSettings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Audit Log
        auditService.logAction('SETTINGS', 'UPDATE', 'INFO', 'Updated global settings', { type: 'System', id: 'SETTINGS', name: 'App Settings' });

        return updated;
    },

    updateSection: <K extends keyof AppSettings>(section: K, data: Partial<AppSettings[K]>) => {
        const current = settingsService.getSettings();
        const updatedSection = { ...current[section], ...data };
        const updated = { ...current, [section]: updatedSection };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Audit Log
        auditService.logAction('SETTINGS', 'UPDATE', 'INFO', `Updated ${section} settings`, { type: 'System', id: `SETTINGS-${section.toUpperCase()}`, name: `${section} Settings` });

        return updated;
    }
};
