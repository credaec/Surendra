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
    const [filters, setFilters] = useState<any>({
        dateRange: 'this-month', // 'today', 'this-week', 'this-month', 'custom'
        startDate: '',
        endDate: '',
        clients: [],
        projects: [],
        employees: [],
        categories: [],
        status: 'all',
    });

    // Handle filter updates from the global panel
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        // In a real app, this would trigger a data refetch or refine the data passed to tabs
        console.log('Filters applied:', newFilters);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'productivity':
                return <EmployeeProductivityReport filters={filters} />;
            case 'projects':
                return <ProjectPerformanceReport filters={filters} />;
            case 'clients':
                return <ClientSummaryReport filters={filters} />;
            case 'categories':
                return <CategoryBreakdownReport filters={filters} />;
            case 'approvals':
                return <TimesheetApprovalReport />;
            default:
                return <EmployeeProductivityReport filters={filters} />;
        }
    };

    return (
        <ReportsLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            filters={filters}
            onFilterChange={handleFilterChange}
        >
            {renderActiveTab()}
        </ReportsLayout>
    );
};

export default AdminReportsPage;
