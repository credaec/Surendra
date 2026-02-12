import React from 'react';
import { Calendar, Users, Briefcase, Search, RotateCcw, Save } from 'lucide-react';

export interface ApprovalFilterState {
    dateRange: string;
    employeeIds: string[];
    projectIds: string[];
    status: 'ALL' | 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'OVERDUE';
    approvalType: string;
    billableType: string;
    minHours: string;
    delayDays: string;
    searchQuery: string;
}

interface ApprovalFiltersProps {
    filters: ApprovalFilterState;
    onFilterChange: (newFilters: ApprovalFilterState) => void;
    onReset?: () => void;
    onSaveView?: () => void;
    onApply?: () => void;
}

const ApprovalFilters: React.FC<ApprovalFiltersProps> = ({
    filters,
    onFilterChange,
    onReset,
    onSaveView,
    onApply
}) => {

    const handleChange = (key: keyof ApprovalFilterState, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-all duration-300">
            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Date Range */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-2" /> Date Range
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                        value={filters.dateRange}
                        onChange={(e) => handleChange('dateRange', e.target.value)}
                    >
                        <option value="this_week">This Week</option>
                        <option value="last_week">Last Week</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {/* Employee */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-2" /> Employee
                    </label>
                    <select className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3">
                        <option value="all">All Employees</option>
                        <option value="emp1">Naresh Prajapati</option>
                        <option value="emp2">Abhishek J</option>
                    </select>
                </div>

                {/* Project */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Briefcase className="h-3 w-3 mr-2" /> Project
                    </label>
                    <select className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3">
                        <option value="all">All Projects</option>
                        <option value="p1">Skylights</option>
                        <option value="p2">City Mall</option>
                    </select>
                </div>

                {/* Search */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Search className="h-3 w-3 mr-2" /> Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search employee, project..."
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                            value={filters.searchQuery}
                            onChange={(e) => handleChange('searchQuery', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Row 2 - Status & Types */}
            <div className="flex flex-col md:flex-row gap-6 items-end border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</label>
                        <select
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                            value={filters.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Billable Type</label>
                        <select
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                            value={filters.billableType}
                            onChange={(e) => handleChange('billableType', e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="BILLABLE">Billable</option>
                            <option value="NON_BILLABLE">Non-Billable</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                        onClick={onReset}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all font-bold h-10"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={onSaveView}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-bold h-10"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save View
                    </button>
                    <button
                        onClick={onApply}
                        className="flex-[2] md:flex-none flex items-center justify-center px-8 py-2.5 text-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-all font-bold shadow-lg shadow-blue-500/20 active:scale-95 h-10"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalFilters;
