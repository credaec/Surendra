import React from 'react';
import { AlertCircle, Lock, CheckCircle, Clock } from 'lucide-react';

export type TimesheetStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'LOCKED';

interface StatusBannerProps {
    status: TimesheetStatus;
    rejectionReason?: string;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ status, rejectionReason }) => {

    if (status === 'DRAFT') {
        return (
            <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-3 mb-8 flex items-center text-sm text-blue-700 dark:text-blue-300">
                <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-3 animate-pulse" />
                <span className="font-semibold mr-1">Draft:</span> You can still add and edit entries for this week.
            </div>
        );
    }

    if (status === 'SUBMITTED') {
        return (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg px-4 py-3 mb-8 flex items-center text-sm text-amber-800 dark:text-amber-300">
                <Clock className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold mr-1">Submitted:</span> Editing is locked. Waiting for Project Manager approval.
            </div>
        );
    }

    if (status === 'APPROVED') {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg px-4 py-3 mb-8 flex items-center text-sm text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold mr-1">PM Approved:</span> Approved by Project Manager. Waiting for Admin to lock.
            </div>
        );
    }

    if (status === 'LOCKED') {
        return (
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 mb-8 flex items-center text-sm text-slate-700 dark:text-slate-300">
                <Lock className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                <span className="font-semibold mr-1">Locked:</span> Final approved. No changes allowed.
            </div>
        );
    }

    if (status === 'REJECTED') {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg px-4 py-3 mb-8 flex items-start text-sm text-red-800 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                    <span className="font-semibold mr-1">Rejected:</span> Timesheet returned by Project Manager.
                    {rejectionReason && <p className="mt-1 text-red-600 dark:text-red-400 font-medium">Reason: "{rejectionReason}"</p>}
                </div>
            </div>
        );
    }

    return null;
};

export default StatusBanner;
