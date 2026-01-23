
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { auditService, type AuditLog, type AuditStats } from '../../../services/auditService';
import AuditStatsCards from '../../admin/audit/AuditStats';
import AuditFilterPanel from '../../admin/audit/AuditFilterPanel';
import AuditLogTable from '../../admin/audit/AuditLogTable';
import AuditLogDrawer from '../../admin/audit/AuditLogDrawer';
import { useToast } from '../../../context/ToastContext';

const AuditLogsSettings: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { showToast } = useToast();

    // Filters
    const [filters, setFilters] = useState({
        dateRange: 'LAST_30_DAYS',
        module: '',
        action: '',
        user: '',
        search: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsRefreshing(true);
        // Simulate network delay
        setTimeout(() => {
            let allLogs = auditService.getLogs();

            // Client-side filtering logic
            if (filters.module) {
                allLogs = allLogs.filter(l => l.module === filters.module);
            }
            if (filters.action) {
                allLogs = allLogs.filter(l => l.action === filters.action);
            }
            if (filters.user) {
                const searchUser = filters.user.toLowerCase();
                allLogs = allLogs.filter(l => l.performedBy.name.toLowerCase().includes(searchUser) || l.performedBy.email.toLowerCase().includes(searchUser));
            }
            if (filters.search) {
                const query = filters.search.toLowerCase();
                allLogs = allLogs.filter(l =>
                    l.id.toLowerCase().includes(query) ||
                    l.summary.toLowerCase().includes(query) ||
                    l.target.name.toLowerCase().includes(query)
                );
            }

            // Date filtering (Mock implementation)
            const now = new Date();
            if (filters.dateRange === 'LAST_7_DAYS') {
                const cutoff = new Date(now.setDate(now.getDate() - 7));
                allLogs = allLogs.filter(l => new Date(l.timestamp) >= cutoff);
            } else if (filters.dateRange === 'LAST_30_DAYS') {
                const cutoff = new Date(now.setDate(now.getDate() - 30));
                allLogs = allLogs.filter(l => new Date(l.timestamp) >= cutoff);
            }

            setLogs(allLogs);
            setStats(auditService.getStats());
            setIsRefreshing(false);
        }, 600);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        loadData();
        showToast('Filters applied successfully', 'success');
    };

    const handleReset = () => {
        const defaults = {
            dateRange: 'LAST_30_DAYS',
            module: '',
            action: '',
            user: '',
            search: ''
        };
        setFilters(defaults);

        setIsRefreshing(true);
        setTimeout(() => {
            // Fetch all without filters
            setLogs(auditService.getLogs()); // This ignores 'filters' state for this run
            setIsRefreshing(false);
            showToast('Filters reset', 'info');
        }, 500);
    };


    const handleExport = () => {
        showToast('Exporting audit logs to CSV...', 'info');
        setTimeout(() => {
            showToast('Audit_Logs_Export.csv downloaded', 'success');
        }, 1500);
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
                        className={`p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        title="Refresh Logs"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            {stats && <AuditStatsCards stats={stats} />}

            {/* Filters */}
            <AuditFilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
                onReset={handleReset}
            />

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
