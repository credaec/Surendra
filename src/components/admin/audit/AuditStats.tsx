import React from 'react';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle, Settings } from 'lucide-react';
import type { AuditStats } from '../../../services/auditService';

interface AuditStatsProps {
    stats: AuditStats;
}

const AuditStatsComponent: React.FC<AuditStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Activity className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalActivities}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Activities</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg">
                    <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.criticalActions}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Actions</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.failedAttempts}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Failed Attempts</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.approvals}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approvals</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Settings className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.settingsChanges}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Settings Updated</p>
                </div>
            </div>
        </div>
    );
};

export default AuditStatsComponent;
