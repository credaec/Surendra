import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Calendar, X } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import type { Client } from '../../../types/schema';
import { startOfWeek, endOfWeek, subWeeks, format, subMonths } from 'date-fns';

interface TimesheetFiltersProps {
    dateRange: string;
    onDateRangeChange: (range: string) => void;
    // New Props for Filters
    employeeId: string;
    onEmployeeChange: (id: string) => void;
    projectId: string;
    onProjectChange: (id: string) => void;
    clientId: string;
    onClientChange: (id: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

const TimesheetFilters: React.FC<TimesheetFiltersProps> = ({
    dateRange,
    onDateRangeChange,
    employeeId,
    onEmployeeChange,
    projectId,
    onProjectChange,
    clientId,
    onClientChange,
    statusFilter,
    onStatusChange
}) => {
    const [clients, setClients] = useState<Client[]>([]);

    // Mock data for dropdowns
    const employees = backendService.getUsers().filter(u => u.role === 'EMPLOYEE');
    const projects = backendService.getProjects();

    useEffect(() => {
        setClients(backendService.getClients());
    }, []);

    const handleClearAll = () => {
        onDateRangeChange('this_week');
        onEmployeeChange('all');
        onProjectChange('all');
        onClientChange('all');
        onStatusChange('all');
    };

    // Dynamic Date Calculation for Labels
    const now = new Date();

    // This Week
    const startThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endThisWeek = endOfWeek(now, { weekStartsOn: 1 });
    const labelThisWeek = `This Week (${format(startThisWeek, 'MMM dd')} - ${format(endThisWeek, 'MMM dd')})`;

    // Last Week
    const startLastWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const endLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const labelLastWeek = `Last Week (${format(startLastWeek, 'MMM dd')} - ${format(endLastWeek, 'MMM dd')})`;

    // This Month
    const labelThisMonth = `This Month (${format(now, 'MMM yyyy')})`;

    // Last Month
    const lastMonth = subMonths(now, 1);
    const labelLastMonth = `Last Month (${format(lastMonth, 'MMM yyyy')})`;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mb-6 transition-all">
            {/* Row 1: Primary Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">

                {/* Date Range - 3 Cols */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Date Range</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                            value={dateRange}
                            onChange={(e) => onDateRangeChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                        >
                            <option value="this_week">{labelThisWeek}</option>
                            <option value="last_week">{labelLastWeek}</option>
                            <option value="this_month">{labelThisMonth}</option>
                            <option value="last_month">{labelLastMonth}</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                </div>

                {/* Employee - 3 Cols */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Employee</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                            value={employeeId}
                            onChange={(e) => onEmployeeChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                        >
                            <option value="all">All Employees</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Project - 3 Cols */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Project</label>
                    <select
                        value={projectId}
                        onChange={(e) => onProjectChange(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                        <option value="all">All Projects</option>
                        {projects.map(proj => (
                            <option key={proj.id} value={proj.id}>{proj.name}</option>
                        ))}
                    </select>
                </div>

                {/* Client - 3 Cols */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Client</label>
                    <select
                        value={clientId}
                        onChange={(e) => onClientChange(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                        <option value="all">All Clients</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 2: Advanced (Chips) */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" /> Filters:
                </span>

                {/* Status Chips */}
                {['DRAFT', 'SUBMITTED', 'APPROVED'].map(status => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(statusFilter === status ? 'all' : status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${statusFilter === status
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {status === 'DRAFT' ? 'Draft' : status === 'SUBMITTED' ? 'Submitted' : 'Approved'}
                    </button>
                ))}

                <button
                    onClick={() => onStatusChange(statusFilter === 'PENDING' ? 'all' : 'PENDING')}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusFilter === 'PENDING'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                        }`}
                >
                    Approval Pending
                </button>



                <div className="ml-auto">
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimesheetFilters;

