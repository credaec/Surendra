import React from 'react';
import { Download, RefreshCcw, CalendarPlus, UserMinus } from 'lucide-react';

interface AvailabilityHeaderProps {
    onAddHoliday: () => void;
    onMarkLeave: () => void;
    onRefresh: () => void;
    onExport: () => void;
}

const AvailabilityHeader: React.FC<AvailabilityHeaderProps> = ({
    onAddHoliday,
    onMarkLeave,
    onRefresh,
    onExport
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team Availability</h1>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2">
                    <span>Admin</span>
                    <span className="mx-2 opacity-30">/</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">Availability</span>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={onRefresh}
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm"
                >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </button>

                <button
                    onClick={onAddHoliday}
                    className="flex items-center px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all text-sm font-bold active:scale-95"
                >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Add Holiday
                </button>

                <button
                    onClick={onMarkLeave}
                    className="flex items-center px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 shadow-lg shadow-slate-900/20 transition-all text-sm font-bold active:scale-95"
                >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Mark Leave
                </button>
            </div>
        </div>
    );
};

export default AvailabilityHeader;
