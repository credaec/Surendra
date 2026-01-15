import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const AuditFilterPanel: React.FC = () => {
    // Mocking filter actions for visual representation
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">

            {/* Row 1: Date & Module */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Date Range</label>
                    <select className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                        <option>Custom Range</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Module</label>
                    <select className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
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
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Action Type</label>
                    <select className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Actions</option>
                        <option>Create</option>
                        <option>Update</option>
                        <option>Delete</option>
                        <option>Approve</option>
                        <option>Reject</option>
                        <option>Login / Logout</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Performed By</label>
                    <input
                        type="text"
                        placeholder="Search User..."
                        className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Row 2: Search & Apply */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Search Details</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search by ID, Notes, or Remarks..."
                        />
                    </div>
                </div>

                <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium">
                        <Filter className="h-4 w-4 mr-2" />
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditFilterPanel;
