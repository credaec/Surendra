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

const STORAGE_KEY = 'credence_audit_logs_v1';

// Initial seed if empty
const INITIAL_LOGS: AuditLog[] = [
    {
        id: 'LOG-INIT',
        timestamp: new Date().toISOString(),
        module: 'SYSTEM',
        action: 'CREATE',
        severity: 'INFO',
        performedBy: { id: 'SYS', name: 'System', role: 'System', email: 'system@credence.com' },
        target: { type: 'System', id: 'INIT', name: 'Audit Log' },
        summary: 'Audit logging system initialized',
        metadata: { ipAddress: '127.0.0.1', device: 'Server', browser: 'N/A' }
    }
];

export const auditService = {
    getLogs: (filters?: any): AuditLog[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        let logs: AuditLog[] = stored ? JSON.parse(stored) : INITIAL_LOGS;

        if (filters) {
            // Basic mock filtering
            if (filters.module) logs = logs.filter(l => l.module === filters.module);
            if (filters.action) logs = logs.filter(l => l.action === filters.action);
            if (filters.user) {
                const q = filters.user.toLowerCase();
                logs = logs.filter(l => l.performedBy.name.toLowerCase().includes(q) || l.performedBy.email.toLowerCase().includes(q));
            }
            if (filters.search) {
                const q = filters.search.toLowerCase();
                logs = logs.filter(l =>
                    l.summary.toLowerCase().includes(q) ||
                    l.target.name.toLowerCase().includes(q) ||
                    l.id.toLowerCase().includes(q)
                );
            }
            if (filters.dateRange === 'LAST_7_DAYS') {
                const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                logs = logs.filter(l => new Date(l.timestamp) >= cutoff);
            }
            // ... other date ranges
        }

        // Sort DESC
        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    getStats: (): AuditStats => {
        const logs = auditService.getLogs();
        return {
            totalActivities: logs.length,
            criticalActions: logs.filter(l => l.severity === 'CRITICAL').length,
            failedAttempts: logs.filter(l => l.action === 'FAILED_LOGIN').length,
            approvals: logs.filter(l => l.action === 'APPROVE').length,
            settingsChanges: logs.filter(l => l.module === 'SETTINGS' || l.module === 'SECURITY').length
        };
    },

    getLogDetails: (id: string): AuditLog | undefined => {
        return auditService.getLogs().find(l => l.id === id);
    },

    logAction: (
        module: AuditModule,
        action: AuditAction,
        severity: AuditSeverity,
        summary: string,
        target: { type: string; id: string; name: string },
        details?: string,
        changes?: AuditChange[],
        user?: { id: string; name: string; role: string; email: string }
    ) => {
        const logs = auditService.getLogs();

        // Default to Admin if no user provided (simulating current session user)
        const performedBy = user || {
            id: 'ADM001',
            name: 'Dhiraj Vasu',
            role: 'Super Admin',
            email: 'dhiraj@credence.com'
        };

        const newLog: AuditLog = {
            id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            module,
            action,
            severity,
            performedBy,
            target,
            summary,
            details,
            changes,
            metadata: {
                ipAddress: '192.168.1.10', // Mock
                device: 'Browser',
                browser: 'Chrome 120.0'
            }
        };

        logs.unshift(newLog);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        return newLog;
    }
};
