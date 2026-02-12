import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface WeeklySummaryCardProps {
    totalHours: number;
    billableHours: number;
    expectedHours: number;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ totalHours, billableHours, expectedHours }) => {
    // Calculate percentages
    const percentage = Math.round((totalHours / expectedHours) * 100) || 0;
    const billablePercentage = Math.round((billableHours / totalHours) * 100) || 0;
    const nonBillableHours = totalHours - billableHours;
    const nonBillablePercentage = 100 - billablePercentage;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6 transition-colors">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">Weekly Summary</h3>
            </div>
            <div className="p-5">
                <div className="flex items-baseline justify-between mb-4">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalHours.toFixed(1)}<span className="text-lg font-normal text-slate-500 dark:text-slate-400">h</span></span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                        {percentage}% of Target
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Billable</span>
                        <span className="font-medium text-slate-900 dark:text-white">{billableHours.toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${billablePercentage}%` }}></div>
                    </div>

                    <div className="flex justify-between text-sm pt-2">
                        <span className="text-slate-500 dark:text-slate-400">Non-Billable</span>
                        <span className="font-medium text-slate-900 dark:text-white">{nonBillableHours.toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-slate-400 dark:bg-slate-600 h-1.5 rounded-full" style={{ width: `${nonBillablePercentage}%` }}></div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Days Worked</div>
                        <div className="font-semibold text-slate-900 dark:text-white">5</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Billable %</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{billablePercentage}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ProofPendingTimesheetCardProps {
    missingCount: number;
}

export const ProofPendingTimesheetCard: React.FC<ProofPendingTimesheetCardProps> = ({ missingCount }) => {
    return null; // Disabled as per requirement
};

interface ValidationChecklistProps {
    hasEntries: boolean;
    overlapErrors: number;
    onRunValidation: () => void;
    isValidating: boolean;
}

export const ValidationChecklist: React.FC<ValidationChecklistProps> = ({
    hasEntries,
    overlapErrors,
    onRunValidation,
    isValidating
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Submission Checklist</h3>
            </div>
            <div className="p-5 space-y-3">
                {/* 1. Has Entries Check */}
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    {hasEntries ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-slate-300 dark:text-slate-600 mr-2" />
                    )}
                    <span className={hasEntries ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}>
                        {hasEntries ? "Entries present" : "No entries added yet"}
                    </span>
                </div>

                {/* 2. Overlap Check */}
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    {overlapErrors === 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={overlapErrors > 0 ? "text-red-600 dark:text-red-400 font-medium" : "text-slate-900 dark:text-white"}>
                        {overlapErrors > 0 ? `${overlapErrors} Time overlaps found` : "No time overlaps"}
                    </span>
                </div>

                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    {/* Proof check removed */}
                </div>

                <button
                    onClick={onRunValidation}
                    disabled={isValidating}
                    className="w-full mt-2 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                >
                    {isValidating ? 'Checking...' : 'Run Validation Check'}
                </button>
            </div>
        </div>
    );
};
