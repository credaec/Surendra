import React from 'react';
import { Calendar, HelpCircle, FileText } from 'lucide-react';

const TimerHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Timer</h1>
                <p className="text-slate-500 text-sm mt-1">Track your working time live</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                    Manual Entry
                </button>
                <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
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
