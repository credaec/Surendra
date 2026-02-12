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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-all duration-300">
            {/* Row 1: Primary Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-2" /> Invoice Date
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
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

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-2" /> Client
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                        value={filters.clientIds.length > 0 ? filters.clientIds[0] : 'all'}
                        onChange={handleClientChange}
                    >
                        <option value="all">All Clients</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.companyName || client.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Briefcase className="h-3 w-3 mr-2" /> Project
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                        value={filters.projectIds.length > 0 ? filters.projectIds[0] : 'all'}
                        onChange={handleProjectChange}
                    >
                        <option value="all">All Projects</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                        <Search className="h-3 w-3 mr-2" /> Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Invoice #, Client..."
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 pl-3"
                            value={filters.searchQuery}
                            onChange={(e) => handleChange('searchQuery', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Row 2: Status & Types */}
            <div className="flex flex-col md:flex-row gap-6 items-end border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Invoice Status</label>
                        <select
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
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
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Payment Status</label>
                        <select
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                            value={filters.paymentStatus}
                            onChange={(e) => handleChange('paymentStatus', e.target.value)}
                        >
                            <option value="ALL">All Payments</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="PARTIAL">Partial</option>
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Currency</label>
                        <select
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                            value={filters.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                        >
                            <option value="ALL">All Currencies</option>
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Billing Type</label>
                        <select
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-10 px-3"
                            value={filters.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="TIMESHEET">Timesheet Based</option>
                            <option value="FIXED">Fixed Amount</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onReset}
                        className="flex items-center px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={onSaveView}
                        className="flex items-center px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save View
                    </button>
                    <button
                        onClick={onApply}
                        className="flex items-center px-8 py-2.5 text-sm font-bold text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFilters;
