import { api } from './api';
import { auditService } from './auditService';

export interface CompanyConfig {
    name: string;
    logoUrl?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
    weekStartDay: 'MONDAY' | 'SUNDAY';
    workingDays: string[];
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
    autoSubmitWeekly: boolean;
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
    password?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
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
    email: EmailConfig;
    backup: BackupConfig;
}

export interface BackupConfig {
    enabled: boolean;
    schedule: string;
    localBackup: {
        enabled: boolean;
        path: string;
    };
    networkBackup: {
        enabled: boolean;
        path: string;
        username: string;
        password?: string;
    };
    ftpBackup: {
        enabled: boolean;
        host: string;
        port: number;
        username: string;
        password?: string;
    };
    lastBackupDate: string;
}

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
        name: 'Pulse Time Tracker',
        address: '12 Tech Street',
        city: 'Digital City',
        state: 'DS',
        country: 'Global',
        timezone: 'UTC+0',
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
        fromEmail: 'noreply@localhost.com',
        fromName: 'Pulse Notifications',
        host: 'smtp.example.com',
        port: 587,
        secure: true,
        username: 'apikey',
        password: ''
    },
    backup: {
        enabled: true,
        schedule: 'Daily (Midnight)',
        localBackup: { enabled: false, path: 'C:\\Backups\\CRED' },
        networkBackup: { enabled: false, path: '', username: '' },
        ftpBackup: { enabled: false, host: '', port: 21, username: '' },
        lastBackupDate: ''
    }
};

const STORAGE_KEY = 'pulse_app_settings_v1';

export const settingsService = {
    getSettings: async (): Promise<AppSettings> => {
        try {
            const data = await api.get('/settings');
            if (Object.keys(data).length === 0) {
                // If DB is empty, check localStorage then fallback to default
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
            }
            return { ...DEFAULT_SETTINGS, ...data };
        } catch (error) {
            console.error('Failed to fetch settings from API, using local storage:', error);
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        }
    },

    updateSettings: async (settings: AppSettings): Promise<AppSettings> => {
        try {
            const data = await api.post('/settings', settings);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            auditService.logAction('SYSTEM', 'UPDATE', 'INFO', 'Global application settings updated', { type: 'System', id: 'SETTINGS', name: 'Global Configuration' });
            return data;
        } catch (error) {
            console.error('Failed to update settings on server, updating locally only:', error);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            return settings;
        }
    },

    updateSection: async <K extends keyof AppSettings>(section: K, data: Partial<AppSettings[K]>) => {
        const current = await settingsService.getSettings();
        const updated = {
            ...current,
            [section]: { ...current[section], ...data }
        };
        return settingsService.updateSettings(updated);
    }
};
