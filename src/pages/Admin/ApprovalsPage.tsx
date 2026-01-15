import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Download, Bell } from 'lucide-react';
import { mockBackend, type ApprovalRequest } from '../../services/mockBackend';
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

    // Filters State
    const [filters, setFilters] = useState<ApprovalFilterState>({
        dateRange: 'this_week',
        employeeIds: [],
        projectIds: [],
        status: 'ALL',
        approvalType: 'ALL',
        billableType: 'ALL',
        minHours: '',
        delayDays: '',
        searchQuery: ''
    });

    // Fetch Data
    const refreshData = () => {
        const data = mockBackend.getApprovals();
        setApprovals(data);
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


    // Handlers
    const handleStatusFilterChange = (status: ApprovalRequest['status'] | 'ALL') => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleViewDetail = (item: ApprovalRequest) => {
        setSelectedApproval(item);
        setIsDrawerOpen(true);
    };

    const handleApprove = (id: string) => {
        // In real app, call backend
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
        // In real app, call backend
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

        const updated = approvals.map(a => selectedIds.includes(a.id) ? { ...a, status: 'APPROVED' as const } : a);
        setApprovals(updated);
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        if (!confirm(`Reject ${selectedIds.length} timesheets?`)) return;

        const updated = approvals.map(a => selectedIds.includes(a.id) ? { ...a, status: 'REJECTED' as const } : a);
        setApprovals(updated);
        setSelectedIds([]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center text-xs text-slate-500 mb-1">
                        <span>Admin</span>
                        <span className="mx-2">/</span>
                        <span>Time Tracking</span>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-slate-900">Timesheet Approval</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Timesheet Approval</h1>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    {selectedIds.length > 0 && (
                        <>
                            <button
                                onClick={handleBulkApprove}
                                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm animate-in fade-in slide-in-from-top-2"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve ({selectedIds.length})
                            </button>
                            <button
                                onClick={handleBulkReject}
                                className="flex items-center px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors shadow-sm animate-in fade-in slide-in-from-top-2"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject ({selectedIds.length})
                            </button>
                            <div className="w-px h-6 bg-slate-300 mx-2"></div>
                        </>
                    )}

                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                        <Bell className="h-4 w-4 mr-2" />
                        Send Reminder
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                    <button
                        onClick={refreshData}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors tooltip"
                        title="Refresh Data"
                    >
                        <RefreshCw className="h-4 w-4" />
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
