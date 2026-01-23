import React, { useState, useEffect } from 'react';
import { Calendar, Users, Briefcase, RotateCcw, Search } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
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
        const loadedProjects = mockBackend.getProjects();
        setProjects(loadedProjects);

        const employees = mockBackend.getUsers();
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 mb-6">

            {/* Row 1: Period & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Payroll Period
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={localFilters.period}
                        onChange={(e) => handleChange('period', e.target.value)}
                    >
                        <option value="Jan 2026">Jan 2026</option>
                        <option value="Dec 2025">Dec 2025</option>
                        <option value="Nov 2025">Nov 2025</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Search className="h-3 w-3 mr-1" /> Search Employee
                    </label>
                    <input
                        type="text"
                        placeholder="Name, ID..."
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={localFilters.searchQuery}
                        onChange={(e) => handleChange('searchQuery', e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" /> Department
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={localFilters.department || 'all'}
                        onChange={(e) => handleChange('department', e.target.value)}
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" /> Project
                    </label>
                    <select
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                </div>
            </div>

            {/* Row 2: Detailed Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-end border-t border-slate-100 pt-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Billing Type</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={localFilters.billingType}
                            onChange={(e) => handleChange('billingType', e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="BILLABLE">Billable Only</option>
                            <option value="NON_BILLABLE">Non-Billable Only</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Approval Status</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={localFilters.approvalStatus}
                            onChange={(e) => handleChange('approvalStatus', e.target.value)}
                        >
                            <option value="APPROVED">Approved (Default)</option>
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Cost Mode</label>
                        <select
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={localFilters.costMode}
                            onChange={(e) => handleChange('costMode', e.target.value)}
                        >
                            <option value="ACTUAL">Actual Cost</option>
                            <option value="ESTIMATED">Estimated Cost</option>
                        </select>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex items-center px-6 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollFilters;
