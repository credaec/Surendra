import React from 'react';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle, Settings } from 'lucide-react';
import type { AuditStats } from '../../../services/auditService';

interface AuditStatsProps {
    stats: AuditStats;
}

const AuditStatsComponent: React.FC<AuditStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Activity className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">{stats.totalActivities}</h4>
                    <p className="text-xs text-slate-500 font-medium">Total Activities</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">{stats.criticalActions}</h4>
                    <p className="text-xs text-slate-500 font-medium">Critical Actions</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">{stats.failedAttempts}</h4>
                    <p className="text-xs text-slate-500 font-medium">Failed Attempts</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">{stats.approvals}</h4>
                    <p className="text-xs text-slate-500 font-medium">Approvals</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Settings className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">{stats.settingsChanges}</h4>
                    <p className="text-xs text-slate-500 font-medium">Settings Updated</p>
                </div>
            </div>
        </div>
    );
};

export default AuditStatsComponent;
