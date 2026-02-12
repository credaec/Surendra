import React, { useState } from 'react';
import ReportsLayout from '../../../components/admin/reports/ReportsLayout';
import EmployeeProductivityReport from '../../../components/admin/reports/tabs/EmployeeProductivityReport';
import ProjectPerformanceReport from '../../../components/admin/reports/tabs/ProjectPerformanceReport';
import ClientSummaryReport from '../../../components/admin/reports/tabs/ClientSummaryReport';
import CategoryBreakdownReport from '../../../components/admin/reports/tabs/CategoryBreakdownReport';
import TimesheetApprovalReport from '../../../components/admin/reports/tabs/TimesheetApprovalReport';
import { backendService } from '../../../services/backendService';


export type ReportTabId = 'productivity' | 'projects' | 'clients' | 'categories' | 'approvals';

const AdminReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReportTabId>('productivity');
    const DEFAULT_FILTERS = {
        dateRange: 'this-month', // 'today', 'this-week', 'this-month', 'custom'
        startDate: '',
        endDate: '',
        client: '',
        project: '',
        employee: '',
        // Keep these if they were intended for multi-select, but we'll use singular for the current UI
        clients: [],
        projects: [],
        employees: [],
        categories: [],
        status: 'all',
        quickFilters: [] as string[]
    };

    const [filters, setFilters] = useState<any>(DEFAULT_FILTERS);

    // Handle filter updates from the global panel
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        // In a real app, this would trigger a data refetch or refine the data passed to tabs
        console.log('Filters updated (pending apply):', newFilters);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'productivity':
                return <EmployeeProductivityReport filters={filtersWithActions} />;
            case 'projects':
                return <ProjectPerformanceReport filters={filtersWithActions} />;
            case 'clients':
                return <ClientSummaryReport filters={filtersWithActions} />;
            case 'categories':
                return <CategoryBreakdownReport filters={filtersWithActions} />;
            case 'approvals':
                return <TimesheetApprovalReport filters={filtersWithActions} onUpdateFilters={handleFilterChange} />;
            default:
                return <EmployeeProductivityReport filters={filtersWithActions} />;
        }
    };

    const handleRefresh = () => {
        // In a real app, re-fetch data
        const btn = document.activeElement as HTMLElement;
        if (btn) btn.classList.add('animate-spin');
        setTimeout(() => {
            if (btn) btn.classList.remove('animate-spin');
            handleResetFilters(); // Reset filters to simulate fresh view
        }, 800);
    };

    const handlePrint = () => {
        window.print();
    };

    // Load saved filters on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('admin_report_filters');
        if (saved) {
            try {
                setFilters(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved filters", e);
            }
        }
    }, []);

    const handleSaveFilter = () => {
        localStorage.setItem('admin_report_filters', JSON.stringify(filters));
        alert("Filter configuration saved!");
    };

    const handleExport = () => {
        // In a real app, this would fetch data from backend based on filters
        // For demo, we'll mock the export for the active tab

        let headers = '';
        let rows: string[] = [];
        let filename = `report-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;

        if (activeTab === 'productivity') {
            headers = 'ID,Employee Name,Total Hours,Billable,Non-Billable,Utilization,Status,Start Date,End Date\n';

            // Fetch and Calculate Data (Mirrors EmployeeProductivityReport logic)
            const users = backendService.getUsers().filter(u => u.role === 'EMPLOYEE');
            const entries = backendService.getEntries();


            // Determine Date Range
            const now = new Date();
            let start: Date | null = null;
            let end: Date | null = null;
            const { dateRange, startDate, endDate } = filters;

            if (dateRange === 'custom' && startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            } else if (dateRange === 'this-month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            } else if (dateRange === 'last-month') {
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
            } else if (dateRange === 'this-week') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                start = new Date(now.setDate(diff));
                end = new Date(now.setDate(start.getDate() + 6));
            } else if (dateRange === 'today') {
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
            }

            const data = users.map((user: any) => {
                const userEntries = entries.filter((e: any) => {
                    if (e.userId !== user.id) return false;
                    if (start && end) {
                        const entryDate = new Date(e.date);
                        if (entryDate < start || entryDate > end) return false;
                    }
                    return true;
                });

                let totalHours = 0;
                let billable = 0;
                let nonBillable = 0;
                let activeProjectIds = new Set();

                userEntries.forEach((e: any) => {
                    const h = e.durationMinutes / 60;
                    totalHours += h;
                    if (e.isBillable) billable += h;
                    else nonBillable += h;
                    if (e.projectId) activeProjectIds.add(e.projectId);
                });

                const utilization = totalHours > 0 ? Math.round((billable / totalHours) * 100) : 0;

                return {
                    id: user.id,
                    name: user.name,
                    totalHours: parseFloat(totalHours.toFixed(1)),
                    billable: parseFloat(billable.toFixed(1)),
                    nonBillable: parseFloat(nonBillable.toFixed(1)),
                    utilization,
                    status: totalHours > 0 ? 'Active' : 'Inactive'
                };
            }).filter((u: any) => u.totalHours > 0 || filters.status === 'all'); // Basic filter

            rows = data.map((d: any) =>
                `${d.id},"${d.name}",${d.totalHours},${d.billable},${d.nonBillable},${d.utilization}%,${d.status},${filters.startDate || '-'},${filters.endDate || '-'}`
            );
        } else if (activeTab === 'projects') {
            headers = 'Project Name,Client,Budget (Hrs),Actual (Hrs),Budget ($),Actual ($),Margin %,Status\n';
            const projects = backendService.getProjects();
            const entries = backendService.getEntries();

            // Reuse filter logic (simplified for export - global date range)
            const now = new Date();
            let start: Date | null = null;
            let end: Date | null = null;
            const { dateRange, startDate, endDate } = filters;

            if (dateRange === 'custom' && startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            } else if (dateRange === 'this-month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            } else if (dateRange === 'last-month') {
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
            } else if (dateRange === 'this-week') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                start = new Date(now.setDate(diff));
                end = new Date(now.setDate(start.getDate() + 6));
            } else if (dateRange === 'today') {
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
            }

            const data = projects.map((p: any) => {
                const projectEntries = entries.filter((e: any) => {
                    if (e.projectId !== p.id) return false;
                    if (start && end) {
                        const entryDate = new Date(e.date);
                        if (entryDate < start || entryDate > end) return false;
                    }
                    return true;
                });

                const actualHours = projectEntries.reduce((acc: number, e: any) => acc + (e.durationMinutes / 60), 0);
                const rate = p.globalRate || 50;
                const actualCost = actualHours * rate;
                const budgetCost = (p.estimatedHours || 0) * rate;
                const marginVal = budgetCost - actualCost;
                const marginPercent = budgetCost > 0 ? Math.round((marginVal / budgetCost) * 100) : 0;

                return {
                    name: p.name,
                    clientName: p.clientName,
                    estimatedHours: p.estimatedHours || 0,
                    actualHours: parseFloat(actualHours.toFixed(2)),
                    budgetAmount: p.budgetAmount || budgetCost,
                    actualCost: parseFloat(actualCost.toFixed(2)),
                    margin: marginPercent,
                    status: p.status
                };
            });

            rows = data.map((p: any) =>
                `"${p.name}","${p.clientName}",${p.estimatedHours},${p.actualHours},${p.budgetAmount},${p.actualCost},${p.margin}%,${p.status}`
            );
        } else if (activeTab === 'clients') {
            headers = 'Client Name,Projects,Billable Hours,Total Billed ($),Pending Invoice ($),Status\n';
            const invoices = backendService.getInvoices();
            const projects = backendService.getProjects();

            const clientMap = new Map<string, any>();

            projects.forEach((p: any) => {
                if (!clientMap.has(p.clientId)) {
                    clientMap.set(p.clientId, {
                        id: p.clientId,
                        name: p.clientName,
                        projects: 0,
                        billableHours: 0,
                        billedAmt: 0,
                        pendingAmt: 0,
                        status: 'Active',
                        projectIds: []
                    });
                }
                const c = clientMap.get(p.clientId);
                c.projects += 1;
                c.projectIds.push(p.id);
            });

            invoices.forEach((inv: any) => {
                if (!clientMap.has(inv.clientId)) {
                    clientMap.set(inv.clientId, {
                        id: inv.clientId,
                        name: inv.clientName,
                        projects: 0,
                        billableHours: 0,
                        billedAmt: 0,
                        pendingAmt: 0,
                        status: 'Active',
                        projectIds: []
                    });
                }
                const c = clientMap.get(inv.clientId);
                // Ensure billedAmt/pendingAmt are numbers
                c.billedAmt += (inv.totalAmount || 0);
                c.pendingAmt += (inv.balanceAmount || 0);
            });

            const data = Array.from(clientMap.values()).filter((c: any) => {
                // Simplified export filter: match client filter if set
                return !filters.client || c.id === filters.client;
            });

            rows = data.map((c: any) =>
                `"${c.name}",${c.projects},${c.billableHours},${c.billedAmt},${c.pendingAmt},${c.status}`
            );
        } else {
            // Generic export for other tabs
            headers = 'Report Type,Export Date,Filter Status\n';
            rows = [`${activeTab},${new Date().toLocaleDateString()},${filters.status}`];
        }

        const csvContent = headers + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleApplyFilters = () => {
        // No-op, real application might trigger fetch here
        console.log("Filters applied");
    };

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        localStorage.removeItem('admin_report_filters'); // Optional: clear saved on reset? Let's assume user wants clean slate.
    };

    const handleViewDetail = (type: string, id: string, name: string) => {
        // Placeholder for navigation or modal
        console.log(`View detail for ${type}: ${name} (${id})`);
        alert(`Navigating to details for ${type}: ${name}`);
    };

    const filtersWithActions = {
        ...filters,
        onViewDetail: handleViewDetail
    };

    return (
        <ReportsLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            onSaveFilter={handleSaveFilter}
            onExport={handleExport}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
        >
            {renderActiveTab()}
        </ReportsLayout>
    );
};

export default AdminReportsPage;
