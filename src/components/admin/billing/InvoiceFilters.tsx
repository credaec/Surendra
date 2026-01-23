import React from 'react';
import { Calendar, Users, Briefcase, Search, RotateCcw, Save } from 'lucide-react';
import type { Client, Project } from '../../../types/schema';

export interface InvoiceFilterState {
    dateRange: string;
    clientIds: string[];
    projectIds: string[];
    status: 'ALL' | 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    paymentStatus: 'ALL' | 'UNPAID' | 'PARTIAL' | 'PAID';
    currency: 'ALL' | 'USD' | 'INR';
    type: 'ALL' | 'TIMESHEET' | 'FIXED';
    searchQuery: string;
}

interface InvoiceFiltersProps {
    filters: InvoiceFilterState;
    clients: Client[];
    projects: Project[];
    onFilterChange: (newFilters: InvoiceFilterState) => void;
    onReset: () => void;
    onSaveView: () => void;
    onApply: () => void;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
    filters,
    clients,
    projects,
    onFilterChange,
    onReset,
    onSaveView,
    onApply
}) => {

    const handleChange = (key: keyof InvoiceFilterState, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange({
            ...filters,
            clientIds: val === 'all' ? [] : [val]
        });
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange({
            ...filters,
            projectIds: val === 'all' ? [] : [val]
        });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            {/* Row 1: Primary Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Invoice Date
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.dateRange}
                        onChange={(e) => handleChange('dateRange', e.target.value)}
                    >
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="this_quarter">This Quarter</option>
                        <option value="this_year">This Fiscal Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" /> Client
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.clientIds.length > 0 ? filters.clientIds[0] : 'all'}
                        onChange={handleClientChange}
                    >
                        <option value="all">All Clients</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.companyName || client.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" /> Project
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.projectIds.length > 0 ? filters.projectIds[0] : 'all'}
                        onChange={handleProjectChange}
                    >
                        <option value="all">All Projects</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Search className="h-3 w-3 mr-1" /> Search
                    </label>
                    <input
                        type="text"
                        placeholder="Invoice #, Client..."
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={filters.searchQuery}
                        onChange={(e) => handleChange('searchQuery', e.target.value)}
                    />
                </div>
            </div>

            {/* Row 2: Status & Types */}
            <div className="flex flex-col md:flex-row gap-4 items-end border-t border-slate-100 pt-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Invoice Status</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={filters.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="SENT">Sent</option>
                            <option value="PARTIAL">Partially Paid</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Payment Status</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={filters.paymentStatus}
                            onChange={(e) => handleChange('paymentStatus', e.target.value)}
                        >
                            <option value="ALL">All</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="PARTIAL">Partial</option>
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Currency</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={filters.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                        >
                            <option value="ALL">All</option>
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Type</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={filters.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                        >
                            <option value="ALL">All</option>
                            <option value="TIMESHEET">Timesheet Based</option>
                            <option value="FIXED">Fixed Amount</option>
                        </select>
                    </div>
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
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFilters;
