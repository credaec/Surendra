import React from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ReportsFilterBarProps {
    dateRange: string;
    onDateRangeChange: (range: string) => void;
}

const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({ dateRange, onDateRangeChange }) => {
    return (
        <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-slate-200 -mx-6 px-6 py-3 mb-6 flex flex-wrap items-center justify-between gap-3">

            {/* Filter Groups */}
            <div className="flex flex-wrap items-center gap-2">

                {/* Date Range Selector */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Calendar className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-sm font-medium text-slate-700 mr-2">{dateRange}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Change</span>
                </div>

                {/* Project Filter */}
                <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Projects</option>
                    <option>BCS Skylights</option>
                    <option>Dr. Wade Residence</option>
                </select>

                {/* Status Filter */}
                <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Statuses</option>
                    <option>Approved</option>
                    <option>Submitted</option>
                    <option>Draft</option>
                </select>

                <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Billable Types</option>
                    <option>Billable</option>
                    <option>Non-Billable</option>
                </select>

            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5">
                    Apply
                </button>
                <button className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 flex items-center">
                    <X className="h-3 w-3 mr-1" /> Reset
                </button>
            </div>

        </div>
    );
};

export default ReportsFilterBar;
