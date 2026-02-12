import React from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';

interface TimesheetHeaderProps {
    dateRange?: string; // Legacy or alternative
    weekRange?: string; // Matching Page usage
    canSubmit: boolean;
    onSubmit: () => void;
    onAddEntry: () => void;
    onPrevWeek: () => void;
    onNextWeek: () => void;
}

const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({
    dateRange,
    weekRange,
    canSubmit,
    onSubmit,
    onAddEntry,
    onPrevWeek,
    onNextWeek
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timesheet</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review your weekly hours and submit for approval</p>
            </div>

            <div className="flex items-center space-x-4">
                {/* Week Selector */}
                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors">
                    <button onClick={onPrevWeek} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-l-lg transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border-x border-slate-100 dark:border-slate-700 table-cell align-middle min-w-[140px] text-center">
                        {weekRange || dateRange}
                    </span>
                    <button onClick={onNextWeek} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-r-lg transition-colors">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Actions */}
                <button
                    onClick={onAddEntry}
                    className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                    Add Time Entry
                </button>

                <button
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                >
                    {canSubmit ? <CheckCircle2 className="h-4 w-4 mr-2" /> : null}
                    Submit Timesheet
                </button>
            </div>
        </div>
    );
};

export default TimesheetHeader;
