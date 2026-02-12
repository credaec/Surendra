import React from 'react';
import { Calendar, HelpCircle, FileText, ArrowLeft } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const TimerHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timer</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your working time live</p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => navigate('/employee/timesheet', { state: { openAddEntry: true } })}
                    className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                    Manual Entry
                </button>
                <button
                    onClick={() => navigate('/employee/timesheet')}
                    className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <FileText className="h-4 w-4 mr-2 text-slate-500" />
                    View Timesheet
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default TimerHeader;
