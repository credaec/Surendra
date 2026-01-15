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
}

export interface PayrollConfig {
    defaultRateType: 'HOURLY' | 'MONTHLY';
    payrollCycle: 'MONTHLY' | 'BI_WEEKLY';
    lockPayrollAfterGeneration: boolean;
}

export interface SecurityConfig {
    minPasswordLength: number;
    sessionTimeoutMinutes: number;
    forceLogoutAfterDays: number;
    twoFactorEnabled: boolean;
    allowAdminRoleSwitch: boolean;
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
        blockInvoicingForPending: true
    },
    payroll: {
        defaultRateType: 'HOURLY',
        payrollCycle: 'MONTHLY',
        lockPayrollAfterGeneration: true
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
    }
};

const STORAGE_KEY = 'credence_app_settings_v1';

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
        return updated;
    },

    updateSection: <K extends keyof AppSettings>(section: K, data: Partial<AppSettings[K]>) => {
        const current = settingsService.getSettings();
        const updatedSection = { ...current[section], ...data };
        const updated = { ...current, [section]: updatedSection };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    }
};
