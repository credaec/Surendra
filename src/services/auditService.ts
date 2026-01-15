export type AuditModule =
    | 'TIMESHEET'
    | 'PROJECTS'
    | 'BILLING'
    | 'PAYROLL'
    | 'SETTINGS'
    | 'SECURITY'
    | 'USERS'
    | 'SYSTEM';

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'APPROVE'
    | 'REJECT'
    | 'SUBMIT'
    | 'LOCK'
    | 'UNLOCK'
    | 'LOGIN'
    | 'FAILED_LOGIN'
    | 'EXPORT';

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditChange {
    field: string;
    oldValue: string | number | boolean | null;
    newValue: string | number | boolean | null;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    module: AuditModule;
    action: AuditAction;
    severity: AuditSeverity;
    performedBy: {
        id: string;
        name: string;
        role: string;
        email: string;
    };
    target: {
        type: string;
        id: string;
        name: string;
    };
    summary: string;
    details?: string;
    changes?: AuditChange[];
    metadata: {
        ipAddress: string;
        device: string;
        browser: string;
        location?: string;
    };
}

export interface AuditStats {
    totalActivities: number;
    criticalActions: number;
    failedAttempts: number;
    approvals: number;
    settingsChanges: number;
}

// --- Mock Data Generator ---

const LOGS: AuditLog[] = [
    {
        id: 'LOG-2024-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        module: 'SETTINGS',
        action: 'UPDATE',
        severity: 'CRITICAL',
        performedBy: { id: 'ADM001', name: 'Dhiraj Vasu', role: 'Super Admin', email: 'dhiraj@credence.com' },
        target: { type: 'Company Profile', id: 'COMP-01', name: 'Credence Tracker' },
        summary: 'Updated company currency and working days',
        changes: [
            { field: 'currency', oldValue: 'USD', newValue: 'INR' },
            { field: 'workingDays', oldValue: 'Mon-Fri', newValue: 'Mon-Sat' }
        ],
        metadata: { ipAddress: '192.168.1.5', device: 'MacBook Pro', browser: 'Chrome 120.0' }
    },
    {
        id: 'LOG-2024-002',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        module: 'TIMESHEET',
        action: 'APPROVE',
        severity: 'INFO',
        performedBy: { id: 'ADM001', name: 'Dhiraj Vasu', role: 'Super Admin', email: 'dhiraj@credence.com' },
        target: { type: 'Timesheet', id: 'TS-3849', name: 'Week 3 Jan - Rahul' },
        summary: 'Approved timesheet for Rahul Sharma (15-21 Jan)',
        metadata: { ipAddress: '192.168.1.5', device: 'MacBook Pro', browser: 'Chrome 120.0' }
    },
    {
        id: 'LOG-2024-003',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        module: 'SECURITY',
        action: 'FAILED_LOGIN',
        severity: 'WARNING',
        performedBy: { id: 'UNKNOWN', name: 'Unknown User', role: 'N/A', email: 'hacker@bad.com' },
        target: { type: 'System', id: 'SYS-AUTH', name: 'Login Portal' },
        summary: 'Failed login attempt detected from suspicious IP',
        metadata: { ipAddress: '45.22.19.112', device: 'Unknown', browser: 'Firefox' }
    },
    {
        id: 'LOG-2024-004',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        module: 'PAYROLL',
        action: 'LOCK',
        severity: 'CRITICAL',
        performedBy: { id: 'ADM001', name: 'Dhiraj Vasu', role: 'Super Admin', email: 'dhiraj@credence.com' },
        target: { type: 'Payroll Run', id: 'PR-JAN-2026', name: 'January 2026 Payroll' },
        summary: 'Locked payroll for January 2026 processing',
        metadata: { ipAddress: '192.168.1.5', device: 'MacBook Pro', browser: 'Chrome 120.0' }
    },
    {
        id: 'LOG-2024-005',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        module: 'BILLING',
        action: 'CREATE',
        severity: 'INFO',
        performedBy: { id: 'PM002', name: 'John Project', role: 'Project Manager', email: 'john@credence.com' },
        target: { type: 'Invoice', id: 'INV-1022', name: 'Inv for Client Acme Corp' },
        summary: 'Created draft invoice for Acme Corp Project',
        changes: [
            { field: 'amount', oldValue: null, newValue: '$4,500.00' },
            { field: 'status', oldValue: null, newValue: 'DRAFT' }
        ],
        metadata: { ipAddress: '10.0.0.42', device: 'Windows PC', browser: 'Edge' }
    },
    // Adding more bulk logs...
    ...Array.from({ length: 15 }).map((_, i) => ({
        id: `LOG-OLD-${i}`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 2)).toISOString(),
        module: i % 3 === 0 ? 'TIMESHEET' as const : i % 3 === 1 ? 'PROJECTS' as const : 'USERS' as const,
        action: i % 3 === 0 ? 'SUBMIT' as const : 'UPDATE' as const,
        severity: 'INFO' as const,
        performedBy: { id: 'EMP005', name: 'Sarah Devi', role: 'Employee', email: 'sarah@credence.com' },
        target: { type: 'Task', id: `TSK-${1000 + i}`, name: `Debugging Task ${i}` },
        summary: `Updated task status to In Progress`,
        metadata: { ipAddress: '10.0.0.55', device: 'Mobile', browser: 'Safari' }
    }))
];

export const auditService = {
    getLogs: (_filters?: any): AuditLog[] => {
        // Just return all for now, filter logic handled in UI for mock simplicity
        return LOGS;
    },

    getStats: (): AuditStats => {
        return {
            totalActivities: LOGS.length,
            criticalActions: LOGS.filter(l => l.severity === 'CRITICAL').length,
            failedAttempts: LOGS.filter(l => l.action === 'FAILED_LOGIN').length,
            approvals: LOGS.filter(l => l.action === 'APPROVE').length,
            settingsChanges: LOGS.filter(l => l.module === 'SETTINGS' || l.module === 'SECURITY').length
        };
    },

    getLogDetails: (id: string): AuditLog | undefined => {
        return LOGS.find(l => l.id === id);
    }
};
