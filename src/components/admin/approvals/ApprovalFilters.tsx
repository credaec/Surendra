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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Date Range */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Date Range
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" /> Employee
                    </label>
                    <select className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Employees</option>
                        <option value="emp1">Naresh Prajapati</option>
                        <option value="emp2">Abhishek J</option>
                        {/* Mock options */}
                    </select>
                </div>

                {/* Project */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" /> Project
                    </label>
                    <select className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Projects</option>
                        <option value="p1">Skylights</option>
                        <option value="p2">City Mall</option>
                        {/* Mock options */}
                    </select>
                </div>

                {/* Search */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Search className="h-3 w-3 mr-1" /> Search
                    </label>
                    <input
                        type="text"
                        placeholder="Search employee, project..."
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.searchQuery}
                        onChange={(e) => handleChange('searchQuery', e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Row 2 - Status & Types */}
            <div className="flex flex-col md:flex-row gap-4 items-end border-t border-slate-100 pt-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Status</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Billable Type</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={filters.billableType}
                            onChange={(e) => handleChange('billableType', e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="BILLABLE">Billable</option>
                            <option value="NON_BILLABLE">Non-Billable</option>
                        </select>
                    </div>
                    {/* Extra filters could go here */}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onReset}
                        className="flex items-center px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={onSaveView}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition-colors font-medium"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save View
                    </button>
                    <button
                        onClick={onApply}
                        className="flex items-center px-6 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalFilters;
