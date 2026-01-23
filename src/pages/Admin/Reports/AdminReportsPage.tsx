import React, { useState } from 'react';
import ReportsLayout from '../../../components/admin/reports/ReportsLayout';
import EmployeeProductivityReport from '../../../components/admin/reports/tabs/EmployeeProductivityReport';
import ProjectPerformanceReport from '../../../components/admin/reports/tabs/ProjectPerformanceReport';
import ClientSummaryReport from '../../../components/admin/reports/tabs/ClientSummaryReport';
import CategoryBreakdownReport from '../../../components/admin/reports/tabs/CategoryBreakdownReport';
import TimesheetApprovalReport from '../../../components/admin/reports/tabs/TimesheetApprovalReport';


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
            // Mock data mirroring the report component
            const data = [
                { id: 1, name: 'Alice Johnson', totalHours: 160, billable: 140, nonBillable: 20, utilization: 88, status: 'All Approved' },
                { id: 2, name: 'Bob Smith', totalHours: 155, billable: 120, nonBillable: 35, utilization: 77, status: 'Pending' },
                { id: 3, name: 'Charlie Brown', totalHours: 168, billable: 160, nonBillable: 8, utilization: 95, status: 'All Approved' },
                { id: 4, name: 'Diana Prince', totalHours: 140, billable: 100, nonBillable: 40, utilization: 71, status: 'Rejected Entries' },
                { id: 5, name: 'Ethan Hunt', totalHours: 175, billable: 150, nonBillable: 25, utilization: 85, status: 'Pending' },
            ];
            rows = data.map(d =>
                `${d.id},"${d.name}",${d.totalHours},${d.billable},${d.nonBillable},${d.utilization}%,${d.status},${filters.startDate || '-'},${filters.endDate || '-'}`
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
