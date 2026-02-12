import React from 'react';
import { Download, CheckCircle, Lock, Plus } from 'lucide-react';

interface AdminTimesheetHeaderProps {
    onExport: () => void;
    onBulkApprove: () => void;
    onLock: () => void;
    onAddEntry: () => void;
}

const AdminTimesheetHeader: React.FC<AdminTimesheetHeaderProps> = ({
    onExport,
    onBulkApprove,
    onLock,
    onAddEntry
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Timesheets / Time Tracking</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View & manage time logs of all employees</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium shadow-sm hover:translate-y-[-1px] active:scale-[0.98]"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>

                <button
                    onClick={onBulkApprove}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium shadow-sm hover:translate-y-[-1px] active:scale-[0.98]"
                >
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Bulk Approve
                </button>

                <button
                    onClick={onLock}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium shadow-sm hover:translate-y-[-1px] active:scale-[0.98]"
                >
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Lock Period
                </button>

                <button
                    onClick={onAddEntry}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Time Entry
                </button>
            </div>
        </div>
    );
};

export default AdminTimesheetHeader;
