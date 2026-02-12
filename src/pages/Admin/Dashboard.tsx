import React from 'react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import HoursTrendChart from '../../components/dashboard/HoursTrendChart';
import ProjectBudgetBurnChart from '../../components/dashboard/ProjectBudgetBurnChart';
import UtilizationChart from '../../components/dashboard/UtilizationChart';
import LiveStatusTable from '../../components/dashboard/LiveStatusTable';
import ActiveProjectsTable from '../../components/dashboard/ActiveProjectsTable';
import { Calendar, Filter } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-8 pb-12">


            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Dashboard</h1>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Organization Overview & Performance</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all shadow-sm active:scale-95">
                        <Calendar className="h-4 w-4 mr-2" />
                        This Month
                    </button>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid - Automatically inherits updated KPICard styles */}
            <StatsGrid />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
                    <HoursTrendChart />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
                    <UtilizationChart />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
                    <ProjectBudgetBurnChart />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
                    <LiveStatusTable />
                </div>
            </div>

            {/* Active Projects Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-2 shadow-sm overflow-hidden">
                <ActiveProjectsTable />
            </div>
        </div>
    );
};

export default AdminDashboard;
