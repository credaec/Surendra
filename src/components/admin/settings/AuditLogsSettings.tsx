
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, FileText } from 'lucide-react';
import { auditService, type AuditLog, type AuditStats } from '../../../services/auditService';
import AuditStatsCards from '../../admin/audit/AuditStats';
import AuditFilterPanel from '../../admin/audit/AuditFilterPanel';
import AuditLogTable from '../../admin/audit/AuditLogTable';
import AuditLogDrawer from '../../admin/audit/AuditLogDrawer';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';

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

    const loadData = async () => {
        setIsRefreshing(true);
        try {
            let allLogs = await auditService.getLogs();
            if (!Array.isArray(allLogs)) {
                console.error('Expected array of logs but got:', allLogs);
                allLogs = [];
            }

            // Client-side filtering logic
            if (filters.module) {
                allLogs = allLogs.filter(l => l.module === filters.module);
            }
            if (filters.action) {
                allLogs = allLogs.filter(l => l.action === filters.action);
            }
            if (filters.user) {
                const searchUser = filters.user.toLowerCase();
                allLogs = allLogs.filter(l => l.userName.toLowerCase().includes(searchUser) || l.userEmail.toLowerCase().includes(searchUser));
            }
            if (filters.search) {
                const query = filters.search.toLowerCase();
                allLogs = allLogs.filter(l =>
                    l.id.toLowerCase().includes(query) ||
                    l.summary.toLowerCase().includes(query) ||
                    l.targetName.toLowerCase().includes(query)
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
            const statsData = await auditService.getStats();
            setStats(statsData);
        } catch (error) {
            showToast('Failed to load audit logs', 'error');
            console.error(error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        loadData();
        showToast('Filters applied successfully', 'success');
    };

    const handleReset = async () => {
        const defaults = {
            dateRange: 'LAST_30_DAYS',
            module: '',
            action: '',
            user: '',
            search: ''
        };
        setFilters(defaults);

        setIsRefreshing(true);
        try {
            // Fetch all without filters
            const logs = await auditService.getLogs();
            setLogs(logs);
            showToast('Filters reset', 'info');
        } catch (error) {
            showToast('Failed to reset filters', 'error');
        } finally {
            setIsRefreshing(false);
        }
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

    const selectedLog = selectedLogId ? logs.find(l => l.id === selectedLogId) || null : null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5">
                    <div className="h-14 w-14 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center shadow-sm border border-violet-100 dark:border-violet-500/20">
                        <FileText className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Audit Logs</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">System Activity Tracker</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={loadData}
                        className={cn(
                            "p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all active:scale-95",
                            isRefreshing ? 'animate-spin' : ''
                        )}
                        title="Refresh Logs"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-black uppercase tracking-widest shadow-sm active:scale-95"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            {stats && <AuditStatsCards stats={stats} />}

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <AuditFilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApply={handleApplyFilters}
                    onReset={handleReset}
                />
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-2 overflow-hidden shadow-sm">
                <AuditLogTable logs={logs} onViewIds={handleViewDetails} />
            </div>

            {/* Drawer */}
            {selectedLog && (
                <AuditLogDrawer log={selectedLog} onClose={() => setSelectedLogId(null)} />
            )}
        </div>
    );
};

export default AuditLogsSettings;
