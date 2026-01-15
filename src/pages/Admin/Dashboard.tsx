import React from 'react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import HoursTrendChart from '../../components/dashboard/HoursTrendChart';
import ProjectBudgetBurnChart from '../../components/dashboard/ProjectBudgetBurnChart';
import UtilizationChart from '../../components/dashboard/UtilizationChart';
import LiveStatusTable from '../../components/dashboard/LiveStatusTable';
import ActiveProjectsTable from '../../components/dashboard/ActiveProjectsTable';

const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Overview of your organization's performance</p>
            </div>

            <StatsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HoursTrendChart />
                <UtilizationChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectBudgetBurnChart />
                <LiveStatusTable />
            </div>

            <ActiveProjectsTable />
        </div>
    );
};

export default AdminDashboard;
