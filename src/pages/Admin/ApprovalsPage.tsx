import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Download, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { backendService, type ApprovalRequest } from '../../services/backendService';
import ApprovalKPICards from '../../components/admin/approvals/ApprovalKPICards';
import ApprovalFilters, { type ApprovalFilterState } from '../../components/admin/approvals/ApprovalFilters';
import ApprovalTable from '../../components/admin/approvals/ApprovalTable';
import TimesheetReviewDrawer from '../../components/admin/approvals/TimesheetReviewDrawer';

const ApprovalsPage: React.FC = () => {
    // State
    const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
    const [filteredApprovals, setFilteredApprovals] = useState<ApprovalRequest[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);

    const DEFAULT_FILTERS: ApprovalFilterState = {
        dateRange: 'this_week',
        employeeIds: [],
        projectIds: [],
        status: 'ALL',
        approvalType: 'ALL',
        billableType: 'ALL',
        minHours: '',
        delayDays: '',
        searchQuery: ''
    };

    // Filters State
    const [filters, setFilters] = useState<ApprovalFilterState>(DEFAULT_FILTERS);

    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch Data
    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            const data = await backendService.refreshApprovals();
            setApprovals([...data]);
            setSelectedIds([]);
            setFilters(DEFAULT_FILTERS);
        } catch (error) {
            console.error("Failed to refresh approvals:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Apply Filters
    useEffect(() => {
        let result = [...approvals];

        if (filters.status !== 'ALL') {
            result = result.filter(item => item.status === filters.status);
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(item =>
                item.employeeName.toLowerCase().includes(query) ||
                item.projects.some(p => p.toLowerCase().includes(query))
            );
        }

        // Add more filter logic here as needed (date, employee, etc.)

        setFilteredApprovals(result);
    }, [approvals, filters]);

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const handleSaveView = () => {
        // Mock save functionality
        alert("Current filter view saved successfully.");
    };

    const handleApplyFilters = () => {
        // Visual confirmation since filters are reactive
        alert("Filters applied active!");
    };


    // Handlers
    const handleStatusFilterChange = (status: ApprovalRequest['status'] | 'ALL') => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleViewDetail = (item: ApprovalRequest) => {
        setSelectedApproval(item);
        setIsDrawerOpen(true);
    };

    const handleApprove = (id: string) => {
        // Call backend to persist
        backendService.updateApprovalStatus(id, 'APPROVED');

        const updated = approvals.map(a => a.id === id ? { ...a, status: 'APPROVED' as const } : a);
        setApprovals(updated);
        // If drawer open, update that too
        if (selectedApproval?.id === id) {
            setSelectedApproval({ ...selectedApproval, status: 'APPROVED' });
            setIsDrawerOpen(false);
        }
        // Remove from selection if bulk
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(sid => sid !== id));
        }
    };

    const handleReject = (id: string) => {
        // Call backend to persist
        backendService.updateApprovalStatus(id, 'REJECTED');

        const updated = approvals.map(a => a.id === id ? { ...a, status: 'REJECTED' as const } : a);
        setApprovals(updated);
        if (selectedApproval?.id === id) {
            setSelectedApproval({ ...selectedApproval, status: 'REJECTED' });
            setIsDrawerOpen(false);
        }
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(sid => sid !== id));
        }
    };

    const handleBulkApprove = () => {
        if (!confirm(`Approve ${selectedIds.length} timesheets?`)) return;

        // Persist all
        selectedIds.forEach(id => backendService.updateApprovalStatus(id, 'APPROVED'));

        const updated = approvals.map(a => selectedIds.includes(a.id) ? { ...a, status: 'APPROVED' as const } : a);
        setApprovals(updated);
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        if (!confirm(`Reject ${selectedIds.length} timesheets?`)) return;

        // Persist all
        selectedIds.forEach(id => backendService.updateApprovalStatus(id, 'REJECTED'));

        const updated = approvals.map(a => selectedIds.includes(a.id) ? { ...a, status: 'REJECTED' as const } : a);
        setApprovals(updated);
        setSelectedIds([]);
    };

    const handleSendReminder = () => {
        alert("Reminder sent successfully to pending employees.");
    };

    const handleExport = () => {
        const headers = ['Employee', 'Week', 'Submitted On', 'Projects', 'Total Hours', 'Billable', 'Non-Billable', 'Status'];
        const rows = filteredApprovals.map(a => [
            `"${a.employeeName}"`,
            `"${a.weekRange}"`,
            new Date(a.submittedOn).toLocaleDateString(),
            `"${a.projects.join(', ')}"`,
            a.totalHours.toFixed(2),
            a.billableHours.toFixed(2),
            a.nonBillableHours.toFixed(2),
            a.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Approvals_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10 transition-all duration-300 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Timesheet Approval</h1>
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2">
                        <span>Admin</span>
                        <span className="mx-2 opacity-30">/</span>
                        <span>Time Tracking</span>
                        <span className="mx-2 opacity-30">/</span>
                        <span className="text-blue-600 dark:text-blue-400 font-black">Approval</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                    {selectedIds.length > 0 && (
                        <>
                            <button
                                onClick={handleBulkApprove}
                                className="flex items-center px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all text-sm font-bold active:scale-95 animate-in fade-in slide-in-from-top-2"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve ({selectedIds.length})
                            </button>
                            <button
                                onClick={handleBulkReject}
                                className="flex items-center px-5 py-2.5 bg-rose-600 dark:bg-rose-500 text-white rounded-xl hover:bg-rose-700 dark:hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all text-sm font-bold active:scale-95 animate-in fade-in slide-in-from-top-2"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject ({selectedIds.length})
                            </button>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                        </>
                    )}

                    <button
                        onClick={handleSendReminder}
                        className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm whitespace-nowrap"
                    >
                        <Bell className="h-4 w-4 mr-2 text-blue-500" />
                        Send Reminder
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm whitespace-nowrap"
                    >
                        <Download className="h-4 w-4 mr-2 text-slate-400" />
                        Export
                    </button>
                    <button
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className={cn(
                            "p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95",
                            isRefreshing && "opacity-50 cursor-not-allowed"
                        )}
                        title="Refresh Data"
                    >
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <ApprovalKPICards
                approvals={approvals}
                activeStatusFilter={filters.status}
                onStatusFilter={handleStatusFilterChange}
            />

            {/* Filters */}
            <ApprovalFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                onSaveView={handleSaveView}
                onApply={handleApplyFilters}
            />

            {/* Table */}
            <ApprovalTable
                data={filteredApprovals}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onView={handleViewDetail}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {/* Review Drawer */}
            <TimesheetReviewDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                approval={selectedApproval}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

export default ApprovalsPage;

