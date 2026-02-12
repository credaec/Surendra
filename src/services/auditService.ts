import { api } from './api';

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
    oldValue: any;
    newValue: any;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    module: AuditModule;
    action: AuditAction;
    severity: AuditSeverity;
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    targetType: string;
    targetId: string;
    targetName: string;
    summary: string;
    details?: string;
    changes?: string; // JSON string from API
    ipAddress?: string;
    device?: string;
    browser?: string;
}

export interface AuditStats {
    totalActivities: number;
    criticalActions: number;
    failedAttempts: number;
    approvals: number;
    settingsChanges: number;
}

export const auditService = {
    getLogs: async (filters?: any): Promise<AuditLog[]> => {
        const query = filters ? new URLSearchParams(filters).toString() : '';
        try {
            return await api.get(`/audit${query ? '?' + query : ''}`);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            return [];
        }
    },

    getStats: async (): Promise<AuditStats> => {
        const logs = await auditService.getLogs();
        return {
            totalActivities: logs.length,
            criticalActions: logs.filter(l => l.severity === 'CRITICAL').length,
            failedAttempts: logs.filter(l => l.action === 'FAILED_LOGIN').length,
            approvals: logs.filter(l => l.action === 'APPROVE').length,
            settingsChanges: logs.filter(l => l.module === 'SETTINGS' || l.module === 'SECURITY').length
        };
    },

    logAction: async (
        module: AuditModule,
        action: AuditAction,
        severity: AuditSeverity,
        summary: string,
        target: { type: string; id: string; name: string },
        details?: string,
        changes?: AuditChange[],
        user?: { id: string; name: string; role: string; email: string }
    ) => {
        const performedBy = user || {
            id: 'ADM001',
            name: 'Production Admin',
            role: 'Super Admin',
            email: 'admin@pulse.com'
        };

        const payload = {
            module,
            action,
            severity,
            summary,
            userId: performedBy.id,
            userName: performedBy.name,
            userRole: performedBy.role,
            userEmail: performedBy.email,
            targetType: target.type,
            targetId: target.id,
            targetName: target.name,
            details,
            changes: changes ? JSON.stringify(changes) : null,
            ipAddress: 'Production Instance', // In real app, server-side detection
            device: 'Web Client',
            browser: 'Chrome/Edge'
        };

        try {
            return await api.post('/audit', payload);
        } catch (error) {
            console.error('Background audit logging failed:', error);
        }
    },

    getLogDetails: (id: string): AuditLog | undefined => {
        // Since we don't have a separate API for details yet, we'll return undefined
        // The component will handle this by not showing the drawer or showing partial data
        // For now, in a real app, this would query the API or cache
        return undefined;
    }
};
