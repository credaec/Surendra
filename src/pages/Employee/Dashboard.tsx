import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockBackend } from '../../services/mockBackend';
import TimerBanner from '../../components/employee/dashboard/TimerBanner';
import KPIStats from '../../components/employee/dashboard/KPIStats';
import TimesheetSnapshot from '../../components/employee/dashboard/TimesheetSnapshot';
import RecentEntries from '../../components/employee/dashboard/RecentEntries';
import { ProofPendingCard, MyProjectsCard, NotificationsCard } from '../../components/employee/dashboard/RightSidebarComponents';

const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTimer, setActiveTimer] = useState<any>(null); // Using any or TimeEntry

    // Check for active timer
    useEffect(() => {
        if (user) {
            const timer = mockBackend.getActiveTimer(user.id);
            setActiveTimer(timer);
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-surface pb-12">

            {/* 1) Top Header (Custom for Dashboard) */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Your work summary & timesheet status</p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Date Filter */}
                    <div className="relative">
                        <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <CalendarIcon className="h-4 w-4 text-slate-500" />
                            <span>This Month</span>
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/employee/timesheet')}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        + Add Time Entry
                    </button>

                    {!activeTimer ? (
                        <button
                            onClick={() => navigate('/employee/timer')}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                        >
                            Go to Timer
                        </button>
                    ) : (
                        <div className="text-sm font-medium text-slate-500 px-2 animate-pulse">
                            Timer Running...
                        </div>
                    )}
                </div>
            </div>

            {/* 2) Running Timer Banner (Sticky) */}
            <TimerBanner
                isActive={!!activeTimer}
                startTime={activeTimer?.startTime}
                project={activeTimer?.projectName}
                task={activeTimer?.categoryId} // Or task name if available
                onPause={() => navigate('/employee/timer')}
                onStop={() => navigate('/employee/timer')}
            />

            <div className="max-w-[1600px] mx-auto px-8 pt-8">

                {/* 3) KPI Summary Cards */}
                <KPIStats />

                {/* 4) Main Dashboard Grid */}
                <div className="grid grid-cols-12 gap-8">

                    {/* Left Column (Main Work Area) - 8 Cols */}
                    <div className="col-span-12 xl:col-span-8 space-y-8">
                        <div>
                            <TimesheetSnapshot />
                        </div>
                        <div>
                            <RecentEntries />
                        </div>
                    </div>

                    {/* Right Column (Controls & Alerts) - 4 Cols */}
                    <div className="col-span-12 xl:col-span-4 space-y-6">
                        <ProofPendingCard />
                        <MyProjectsCard />
                        <NotificationsCard />

                        {/* 9) Friendly Note */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-8">
                            <p className="text-xs text-blue-700 text-center">
                                💡 Only approved & locked hours are considered for billing.
                                Make sure to upload proofs where required.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
