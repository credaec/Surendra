
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X, ChevronDown } from 'lucide-react';

interface ReportsFilterBarProps {
    dateRange: string;
    startDate: string;
    endDate: string;
    onDateChange: (start: string, end: string) => void;

    projects: { id: string, name: string }[];
    selectedProject: string;
    onProjectChange: (projectId: string) => void;

    selectedStatus: string;
    onStatusChange: (status: string) => void;

    selectedBillable: string;
    onBillableChange: (billable: string) => void;

    onApply: () => void;
    onReset: () => void;
}

const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
    dateRange,
    startDate,
    endDate,
    onDateChange,
    projects,
    selectedProject,
    onProjectChange,
    selectedStatus,
    onStatusChange,
    selectedBillable,
    onBillableChange,
    onApply,
    onReset
}) => {
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [tempStart, setTempStart] = useState(startDate);
    const [tempEnd, setTempEnd] = useState(endDate);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTempStart(startDate);
        setTempEnd(endDate);
    }, [startDate, endDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsDatePopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateApply = () => {
        onDateChange(tempStart, tempEnd);
        setIsDatePopoverOpen(false);
    };

    return (
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 -mx-6 px-6 py-3 mb-6 flex flex-wrap items-center justify-between gap-3 transition-colors">

            {/* Filter Groups */}
            <div className="flex flex-wrap items-center gap-2">

                {/* Date Range Selector */}
                <div className="relative" ref={popoverRef}>
                    <button
                        onClick={() => setIsDatePopoverOpen(!isDatePopoverOpen)}
                        className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm px-3 py-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 mr-2">{dateRange}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded flex items-center">
                            Change <ChevronDown className="h-3 w-3 ml-1" />
                        </span>
                    </button>

                    {isDatePopoverOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Select Date Range</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={tempStart}
                                        onChange={(e) => setTempStart(e.target.value)}
                                        className="w-full text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={tempEnd}
                                        onChange={(e) => setTempEnd(e.target.value)}
                                        className="w-full text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={handleDateApply}
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Apply Range
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Project Filter */}
                <select
                    value={selectedProject}
                    onChange={(e) => onProjectChange(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <option value="ALL">All Projects</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="RUNNING">Running</option>
                </select>

                {/* Billable Filter */}
                <select
                    value={selectedBillable}
                    onChange={(e) => onBillableChange(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <option value="ALL">All Billable Types</option>
                    <option value="BILLABLE">Billable</option>
                    <option value="NON_BILLABLE">Non-Billable</option>
                </select>

            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={onApply}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5"
                >
                    Apply
                </button>
                <button
                    onClick={onReset}
                    className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 flex items-center"
                >
                    <X className="h-3 w-3 mr-1" /> Reset
                </button>
            </div>

        </div>
    );
};

export default ReportsFilterBar;
