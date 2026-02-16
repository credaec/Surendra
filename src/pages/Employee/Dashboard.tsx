import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { backendService } from '../../services/backendService';
import TimerBanner from '../../components/employee/dashboard/TimerBanner';
import KPIStats from '../../components/employee/dashboard/KPIStats';
import TimesheetSnapshot from '../../components/employee/dashboard/TimesheetSnapshot';
import RecentEntries from '../../components/employee/dashboard/RecentEntries';
import { MyProjectsCard, NotificationsCard } from '../../components/employee/dashboard/RightSidebarComponents';
import { format } from 'date-fns';

const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTimer, setActiveTimer] = useState<any>(null); // Using any or TimeEntry
    const [dateFilter, setDateFilter] = useState<'this-week' | 'this-month'>('this-week');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check for active timer
    useEffect(() => {
        const fetchTimer = () => {
            if (user) {
                const timer = backendService.getActiveTimer(user.id);
                if (timer) {
                    // Enrich with Category Name
                    const categories = backendService.getTaskCategories();
                    const category = categories.find(c => c.id === timer.categoryId);

                    // Enrich with Project Name
                    const projects = backendService.getProjects();
                    const project = projects.find(p => p.id === timer.projectId);

                    // Extract accumulated seconds from activityLogs if available
                    // DEBUG: Log timer state
                    console.log("Dashboard Timer Fetch:", {
                        id: timer.id,
                        logs: timer.activityLogs,
                        type: typeof timer.activityLogs
                    });

                    let acc = 0;
                    if (timer.activityLogs) {
                        try {
                            const logs = typeof timer.activityLogs === 'string' ? JSON.parse(timer.activityLogs) : timer.activityLogs;
                            acc = logs.accumulatedSeconds || 0;
                            console.log("Parsed Acc:", acc);
                        } catch (e) { console.error("Parse Error:", e); }
                    }
                    // Fallback to legacy prop
                    acc = acc || (timer as any).accumulatedSeconds || 0;

                    setActiveTimer({
                        ...timer,
                        taskName: category?.name || timer.categoryId,
                        projectName: project?.name || 'Unknown Project',
                        accumulatedSeconds: acc
                    });
                } else {
                    setActiveTimer(null);
                }
            }
        };

        fetchTimer(); // Initial check

        // Poll for updates (in case timer changes in another tab or background)
        const interval = setInterval(fetchTimer, 2000);
        return () => clearInterval(interval);
    }, [user]);

    const currentMonthLabel = format(new Date(), 'MMM yyyy');

    return (
        <div className="space-y-8">

            {/* 1) Top Header (Custom for Dashboard) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between relative z-[60] transition-all duration-300">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Your work summary & timesheet status</p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Date Filter */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            <span>{dateFilter === 'this-week' ? 'This Week' : `This Month (${currentMonthLabel})`}</span>
                            <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={() => { setDateFilter('this-week'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 ${dateFilter === 'this-week' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-600 dark:text-slate-400'}`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => { setDateFilter('this-month'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 ${dateFilter === 'this-month' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-600 dark:text-slate-400'}`}
                                >
                                    This Month <span className="text-[9px] opacity-70 ml-1">({currentMonthLabel})</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/employee/timesheet')}
                        className="flex items-center space-x-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Entry</span>
                    </button>

                    {!activeTimer ? (
                        <button
                            onClick={() => navigate('/employee/timer')}
                            className="flex items-center space-x-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 hover:-translate-y-0.5"
                        >
                            <Clock className="h-4 w-4" />
                            <span>Go to Timer</span>
                        </button>
                    ) : (
                        <div className="flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                            Timer Running...
                        </div>
                    )}
                </div>
            </div>

            {/* 2) Running Timer Banner (Sticky or prominent) */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none">
                <TimerBanner
                    isActive={!!activeTimer}
                    startTime={activeTimer?.startTime}
                    accumulatedSeconds={(activeTimer as any)?.accumulatedSeconds || 0}
                    project={activeTimer?.projectName}
                    task={activeTimer?.taskName || activeTimer?.categoryId}
                    onPause={() => navigate('/employee/timer')}
                    onStop={() => navigate('/employee/timer')}
                />
            </div>

            {/* 3) KPI Summary Cards */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <KPIStats dateFilter={dateFilter} />
            </div>

            {/* 4) Main Dashboard Grid */}
            <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

                {/* Left Column (Main Work Area) - 8 Cols */}
                <div className="col-span-12 xl:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-1 shadow-sm overflow-hidden">
                        <TimesheetSnapshot />
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-1 shadow-sm overflow-hidden">
                        <RecentEntries dateFilter={dateFilter} />
                    </div>
                </div>

                {/* Right Column (Controls & Alerts) - 4 Cols */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <MyProjectsCard />
                    <NotificationsCard />

                    {/* 9) Friendly Note */}
                    <div className="bg-blue-50 dark:bg-blue-500/5 rounded-[2rem] p-6 border border-blue-100 dark:border-blue-500/20 mt-8 text-center shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                            💡 Pro Tip
                        </p>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2">
                            Only approved & locked hours are considered for billing. Make sure to submit your timesheets on Fridays!
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;
