
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { auditService, type AuditLog, type AuditStats } from '../../../services/auditService';
import AuditStatsCards from '../../admin/audit/AuditStats';
import AuditFilterPanel from '../../admin/audit/AuditFilterPanel';
import AuditLogTable from '../../admin/audit/AuditLogTable';
import AuditLogDrawer from '../../admin/audit/AuditLogDrawer';

const AuditLogsSettings: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsRefreshing(true);
        // Simulate network delay
        setTimeout(() => {
            setLogs(auditService.getLogs());
            setStats(auditService.getStats());
            setIsRefreshing(false);
        }, 600);
    };

    const handleViewDetails = (id: string) => {
        setSelectedLogId(id);
    };

    const selectedLog = selectedLogId ? auditService.getLogDetails(selectedLogId) || null : null;

    return (
        <div className="space-y-6">

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">System Audit Logs</h2>
                    <p className="text-sm text-slate-500">Track and monitor all critical system activities.</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={loadData}
                        className={`p - 2 text - slate - 600 hover: bg - slate - 100 rounded - lg border border - slate - 200 transition - all ${isRefreshing ? 'animate-spin' : ''} `}
                        title="Refresh Logs"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            {stats && <AuditStatsCards stats={stats} />}

            {/* Filters */}
            <AuditFilterPanel />

            {/* Logs Table */}
            <AuditLogTable logs={logs} onViewIds={handleViewDetails} />

            {/* Drawer */}
            {selectedLog && (
                <AuditLogDrawer log={selectedLog} onClose={() => setSelectedLogId(null)} />
            )}
        </div>
    );
};

export default AuditLogsSettings;
