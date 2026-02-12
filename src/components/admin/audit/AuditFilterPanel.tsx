import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface AuditFilterPanelProps {
    filters: {
        dateRange: string;
        module: string;
        action: string;
        user: string;
        search: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onApply: () => void;
    onReset: () => void;
}

const AuditFilterPanel: React.FC<AuditFilterPanelProps> = ({
    filters,
    onFilterChange,
    onApply,
    onReset,
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">

            {/* Row 1: Date & Module */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Date Range</label>
                    <select
                        className="w-full text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.dateRange}
                        onChange={(e) => onFilterChange('dateRange', e.target.value)}
                    >
                        <option value="LAST_7_DAYS">Last 7 Days</option>
                        <option value="LAST_30_DAYS">Last 30 Days</option>
                        <option value="THIS_MONTH">This Month</option>
                        <option value="ALL">All Time</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Module</label>
                    <select
                        className="w-full text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.module}
                        onChange={(e) => onFilterChange('module', e.target.value)}
                    >
                        <option value="">All Modules</option>
                        <option value="TIMESHEET">Timesheet</option>
                        <option value="PROJECTS">Projects</option>
                        <option value="BILLING">Billing / Invoices</option>
                        <option value="PAYROLL">Payroll</option>
                        <option value="SETTINGS">Settings</option>
                        <option value="SECURITY">Security</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Action Type</label>
                    <select
                        className="w-full text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.action}
                        onChange={(e) => onFilterChange('action', e.target.value)}
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                        <option value="APPROVE">Approve</option>
                        <option value="REJECT">Reject</option>
                        <option value="LOGIN">Login / Logout</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Performed By</label>
                    <input
                        type="text"
                        placeholder="Search User..."
                        className="w-full text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.user}
                        onChange={(e) => onFilterChange('user', e.target.value)}
                    />
                </div>
            </div>

            {/* Row 2: Search & Apply */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Search Details</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                            placeholder="Search by ID, Notes, or Remarks..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={onReset}
                        className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium border border-slate-200 dark:border-slate-700"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={onApply}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditFilterPanel;
