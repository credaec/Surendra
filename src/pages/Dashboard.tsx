import React from 'react';
import StatsGrid from '../components/dashboard/StatsGrid';
import HoursTrendChart from '../components/dashboard/HoursTrendChart';
import UtilizationChart from '../components/dashboard/UtilizationChart';
import ActiveProjectsTable from '../components/dashboard/ActiveProjectsTable';
import LiveStatusTable from '../components/dashboard/LiveStatusTable';
import ProjectBudgetBurnChart from '../components/dashboard/ProjectBudgetBurnChart';
import EmployeeUtilizationChart from '../components/dashboard/EmployeeUtilizationChart';
import { Plus, Download } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 pb-8 animate-in fade-in duration-500">
            {/* Page Header */}
            {/* Quick Actions (Updated) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your agency's performance.</p>
                </div>

                <div className="flex items-center space-x-3 overflow-x-auto pb-2 sm:pb-0">
                    <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm ring-offset-2 focus:ring-2 ring-blue-500 whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <section>
                <StatsGrid />
            </section>

            {/* Main Charts Row 1 */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HoursTrendChart />
                </div>
                <div className="lg:col-span-1">
                    <UtilizationChart />
                </div>
            </section>

            {/* Secondary Charts Row 2 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectBudgetBurnChart />
                <EmployeeUtilizationChart />
            </section>

            {/* Tables Section */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <ActiveProjectsTable />
                </div>
                <div className="xl:col-span-1 h-full">
                    <LiveStatusTable />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
