import React, { useState, useEffect } from 'react';
import { Calendar, Users, Briefcase, RotateCcw, Search, Filter } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import type { Project } from '../../../types/schema';

export interface PayrollFilterState {
    period: string; // e.g. "2026-01" or custom
    employeeIds: string[];
    projectIds: string[];
    clientIds: string[];
    billingType: 'ALL' | 'BILLABLE' | 'NON_BILLABLE';
    approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'OVERDUE' | 'ALL';
    costMode: 'ACTUAL' | 'ESTIMATED';
    searchQuery: string;
    department?: string; // Add department to state
}

interface PayrollFiltersProps {
    filters: PayrollFilterState;
    onFilterChange: (newFilters: PayrollFilterState) => void;
}

const PayrollFilters: React.FC<PayrollFiltersProps> = ({ filters, onFilterChange }) => {
    // Local state for deferred filtering
    const [localFilters, setLocalFilters] = useState<PayrollFilterState>(filters);

    // Data options
    const [projects, setProjects] = useState<Project[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);

    useEffect(() => {
        // Sync local state if props change externally (e.g. initial load)
        setLocalFilters(filters);
    }, [filters]);

    useEffect(() => {
        // Load filter options
        const loadedProjects = backendService.getProjects();
        setProjects(loadedProjects);

        const employees = backendService.getUsers();
        const uniqueDepts = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
        setDepartments(uniqueDepts as string[]);
    }, []);

    const handleChange = (key: keyof PayrollFilterState, value: any) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onFilterChange(localFilters);
    };

    const handleReset = () => {
        const defaultFilters: PayrollFilterState = {
            period: 'Jan 2026',
            employeeIds: [],
            projectIds: [],
            clientIds: [],
            billingType: 'ALL',
            approvalStatus: 'APPROVED',
            costMode: 'ACTUAL',
            searchQuery: '',
            department: 'all'
        };
        setLocalFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8 mb-8 transition-all duration-300">

            {/* Header / Title */}
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <Filter className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Data Filters</h3>
            </div>

            {/* Row 1: Period & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center group">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" /> Payroll Period
                    </label>
                    <div className="relative group">
                        <select
                            className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-4 appearance-none cursor-pointer"
                            value={localFilters.period}
                            onChange={(e) => handleChange('period', e.target.value)}
                        >
                            <option value="Jan 2026">Jan 2026</option>
                            <option value="Dec 2025">Dec 2025</option>
                            <option value="Nov 2025">Nov 2025</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center group">
                        <Search className="h-3.5 w-3.5 mr-2 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" /> Search Employee
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Name, ID..."
                            className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 pl-4"
                            value={localFilters.searchQuery}
                            onChange={(e) => handleChange('searchQuery', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center group">
                        <Users className="h-3.5 w-3.5 mr-2 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" /> Department
                    </label>
                    <div className="relative group">
                        <select
                            className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-4 appearance-none cursor-pointer"
                            value={localFilters.department || 'all'}
                            onChange={(e) => handleChange('department', e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center group">
                        <Briefcase className="h-3.5 w-3.5 mr-2 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" /> Project
                    </label>
                    <div className="relative group">
                        <select
                            className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-4 appearance-none cursor-pointer"
                            value={localFilters.projectIds[0] || 'all'}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange('projectIds', val === 'all' ? [] : [val]);
                            }}
                        >
                            <option value="all">All Projects</option>
                            {projects.map(proj => (
                                <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Detailed Filters */}
            <div className="flex flex-col md:flex-row gap-8 items-end border-t border-slate-100 dark:border-slate-800 pt-8">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Billing Type</label>
                        <div className="relative group">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-4 appearance-none cursor-pointer"
                                value={localFilters.billingType}
                                onChange={(e) => handleChange('billingType', e.target.value)}
                            >
                                <option value="ALL">All Types</option>
                                <option value="BILLABLE">Billable Only</option>
                                <option value="NON_BILLABLE">Non-Billable Only</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Approval Status</label>
                        <div className="relative group">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-4 appearance-none cursor-pointer"
                                value={localFilters.approvalStatus}
                                onChange={(e) => handleChange('approvalStatus', e.target.value)}
                            >
                                <option value="APPROVED">Approved (Default)</option>
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Cost Mode</label>
                        <div className="relative group">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-4 appearance-none cursor-pointer"
                                value={localFilters.costMode}
                                onChange={(e) => handleChange('costMode', e.target.value)}
                            >
                                <option value="ACTUAL">Actual Cost</option>
                                <option value="ESTIMATED">Estimated Cost</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleReset}
                        className="flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all h-12 active:scale-95"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex items-center px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 h-12"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollFilters;
