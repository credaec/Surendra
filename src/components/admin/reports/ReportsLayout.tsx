import React from 'react';
import {
    BarChart3, PieChart, Users, FileCheck, Layers, Download, Printer, RefreshCw, Save
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import ReportsFilterPanel from './ReportsFilterPanel';
import ReportsKPIGrid from './ReportsKPIGrid';
import type { ReportTabId } from '../../../pages/Admin/Reports/AdminReportsPage';

interface ReportsLayoutProps {
    children: React.ReactNode;
    activeTab: ReportTabId;
    onTabChange: (tab: ReportTabId) => void;
    filters: any;
    onFilterChange: (filters: any) => void;
    onRefresh?: () => void;
    onPrint?: () => void;
    onSaveFilter?: () => void;
    onExport?: () => void;
    onApplyFilters?: () => void;
    onResetFilters?: () => void;
}

const ReportsLayout: React.FC<ReportsLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    filters,
    onFilterChange,
    onRefresh,
    onPrint,
    onSaveFilter,
    onExport,
    onApplyFilters,
    onResetFilters
}) => {

    const tabs: { id: ReportTabId; label: string; icon: any }[] = [
        { id: 'productivity', label: 'Employee Productivity', icon: Users },
        { id: 'projects', label: 'Project Performance', icon: BarChart3 },
        { id: 'clients', label: 'Client Summary', icon: PieChart },
        { id: 'categories', label: 'Category Breakdown', icon: Layers },
        { id: 'approvals', label: 'Timesheet Approval', icon: FileCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-12 animate-in fade-in duration-500 transition-colors">
            {/* 1. Header Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-20 transition-colors">
                <div className="max-w-[1920px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Title & Breadcrumb */}
                        <div>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                                <span>Dashboard</span>
                                <span className="mx-2">/</span>
                                <span>Reports</span>
                                <span className="mx-2">/</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics & Reports</h1>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={onRefresh}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors tooltip"
                                title="Refresh Data"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                                onClick={onPrint}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors tooltip"
                                title="Print Report"
                            >
                                <Printer className="h-4 w-4" />
                            </button>
                            <button
                                onClick={onSaveFilter}
                                className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                <Save className="h-4 w-4 mr-2 text-slate-400 dark:text-slate-500" />
                                Save Filter
                            </button>
                            <button
                                onClick={onExport}
                                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/20"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center space-x-1 mt-6 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={cn(
                                        "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border border-transparent",
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800/50"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-4 w-4 mr-2", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. Global Filter Panel */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-[137px] z-10 shadow-sm">
                <div className="max-w-[1920px] mx-auto px-6 py-4">
                    <ReportsFilterPanel
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onApply={onApplyFilters}
                        onReset={onResetFilters}
                        activeTab={activeTab}
                    />
                </div>
            </div>

            {/* 3. Main Content Area */}
            <div className="max-w-[1920px] mx-auto px-6 py-8">
                {/* Only show global KPI grid for tabs that rely on it */}
                {['productivity', 'projects', 'categories'].includes(activeTab) && (
                    <ReportsKPIGrid reportType={activeTab} filters={filters} />
                )}
                {children}
            </div>
        </div>
    );
};

export default ReportsLayout;
