import React from 'react';
import { Calendar, Filter, Search, X } from 'lucide-react';
// import { cn } from '../../../lib/utils';

interface ReportsFilterPanelProps {
    filters: any;
    onFilterChange: (filters: any) => void;
    onApply?: () => void;
    onReset?: () => void;
    activeTab?: string;
}

const ReportsFilterPanel: React.FC<ReportsFilterPanelProps> = ({
    filters,
    onFilterChange,
    onApply,
    onReset,
    activeTab
}) => {

    // Helper to update a single filter
    const updateFilter = (key: string, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const toggleQuickFilter = (label: string) => {
        const current = filters.quickFilters || [];
        const updated = current.includes(label)
            ? current.filter((i: string) => i !== label)
            : [...current, label];
        updateFilter('quickFilters', updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">

                {/* Row 1: Date & Primary Filters */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* Date Range */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex items-center shadow-sm transition-colors">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 mr-2">
                            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <select
                            className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-200 w-full focus:ring-0 cursor-pointer"
                            value={filters.dateRange}
                            onChange={(e) => updateFilter('dateRange', e.target.value)}
                        >
                            <option value="today" className="bg-white dark:bg-slate-900">Today</option>
                            <option value="this-week" className="bg-white dark:bg-slate-900">This Week</option>
                            <option value="this-month" className="bg-white dark:bg-slate-900">This Month</option>
                            <option value="last-month" className="bg-white dark:bg-slate-900">Last Month</option>
                            <option value="custom" className="bg-white dark:bg-slate-900">Custom Range</option>
                        </select>
                    </div>

                    {/* Client Filter */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <select
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                            value={filters.client || ''}
                            onChange={(e) => updateFilter('client', e.target.value)}
                        >
                            <option value="" className="bg-white dark:bg-slate-900">All Clients</option>
                            <option value="1" className="bg-white dark:bg-slate-900">Apex Constructors</option>
                            <option value="2" className="bg-white dark:bg-slate-900">Urban Developers</option>
                            <option value="3" className="bg-white dark:bg-slate-900">Gov Infrastructure</option>
                            <option value="4" className="bg-white dark:bg-slate-900">Tech Corp</option>
                            <option value="5" className="bg-white dark:bg-slate-900">Private Client</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Filter className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                        </div>
                    </div>

                    {/* Project Filter */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <select
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                            value={filters.project || ''}
                            onChange={(e) => updateFilter('project', e.target.value)}
                        >
                            <option value="" className="bg-white dark:bg-slate-900">All Projects</option>
                            <option value="1" className="bg-white dark:bg-slate-900">Skyline Tower</option>
                            <option value="2" className="bg-white dark:bg-slate-900">City Bridge</option>
                            <option value="3" className="bg-white dark:bg-slate-900">Metro Station</option>
                            <option value="4" className="bg-white dark:bg-slate-900">Villa Renovation</option>
                            <option value="5" className="bg-white dark:bg-slate-900">Tech Park</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Filter className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                        </div>
                    </div>

                    {/* Employee Filter */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <select
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                            value={filters.employee || ''}
                            onChange={(e) => updateFilter('employee', e.target.value)}
                        >
                            <option value="" className="bg-white dark:bg-slate-900">All Employees</option>
                            <option value="1" className="bg-white dark:bg-slate-900">Alice Johnson</option>
                            <option value="2" className="bg-white dark:bg-slate-900">Bob Smith</option>
                            <option value="3" className="bg-white dark:bg-slate-900">Charlie Brown</option>
                            <option value="4" className="bg-white dark:bg-slate-900">Diana Prince</option>
                            <option value="5" className="bg-white dark:bg-slate-900">Ethan Hunt</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Filter className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onApply}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-colors whitespace-nowrap"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={onReset}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors whitespace-nowrap flex items-center"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Row 2: Secondary Filters */}
            <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Quick Filters:</span>

                {['Billable', 'Non-Billable', 'Overtime'].map(label => (
                    <label key={label} className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer select-none transition-colors">
                        <input
                            type="checkbox"
                            className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-blue-600 focus:ring-blue-500 mr-2 h-4 w-4"
                            checked={(filters.quickFilters || []).includes(label)}
                            onChange={() => toggleQuickFilter(label)}
                        />
                        {label}
                    </label>
                ))}

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Status:</span>
                <select
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 cursor-pointer transition-colors"
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                >
                    <option value="all" className="bg-white dark:bg-slate-900">All Statuses</option>
                    {activeTab === 'projects' ? (
                        <>
                            <option value="On Track" className="bg-white dark:bg-slate-900">On Track</option>
                            <option value="At Risk" className="bg-white dark:bg-slate-900">At Risk</option>
                            <option value="Over Budget" className="bg-white dark:bg-slate-900">Over Budget</option>
                            <option value="Completed" className="bg-white dark:bg-slate-900">Completed</option>
                        </>
                    ) : (activeTab === 'clients' || activeTab === 'categories') ? (
                        <>
                            <option value="Active" className="bg-white dark:bg-slate-900">Active</option>
                            <option value="Hold" className="bg-white dark:bg-slate-900">Hold</option>
                            <option value="Inactive" className="bg-white dark:bg-slate-900">Inactive</option>
                        </>
                    ) : (
                        <>
                            <option value="approved" className="bg-white dark:bg-slate-900">Approved</option>
                            <option value="pending" className="bg-white dark:bg-slate-900">Pending</option>
                            <option value="rejected" className="bg-white dark:bg-slate-900">Rejected</option>
                            <option value="overdue" className="bg-white dark:bg-slate-900">Overdue</option>
                        </>
                    )}
                </select>
            </div>
        </div>
    );
};

export default ReportsFilterPanel;
