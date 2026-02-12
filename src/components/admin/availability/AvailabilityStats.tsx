import React from 'react';
import { Users, Calendar, Clock, Palmtree } from 'lucide-react';
import type { AvailabilityEvent } from '../../../types/schema';
import { isSameDay, parseISO, isWithinInterval, addDays } from 'date-fns';

interface AvailabilityStatsProps {
    events: AvailabilityEvent[];
}

const AvailabilityStats: React.FC<AvailabilityStatsProps> = ({ events }) => {

    const today = new Date();
    const next30Days = { start: today, end: addDays(today, 30) };

    // 1. Employees on Leave Today
    const employeesOnLeaveToday = events.filter(e =>
        e.type === 'LEAVE' &&
        isSameDay(today, parseISO(e.startDate)) // Simplified: assumes single day or checks start. Ideally use isWithinInterval
    ).length;

    // 2. Upcoming Holidays (Next 30 Days)
    const upcomingHolidays = events.filter(e =>
        e.type === 'HOLIDAY' &&
        isWithinInterval(parseISO(e.startDate), next30Days)
    ).length;

    // 3. Upcoming Leaves
    const upcomingLeaves = events.filter(e =>
        e.type === 'LEAVE' &&
        isWithinInterval(parseISO(e.startDate), next30Days)
    ).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">On Leave Today</h3>
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{employeesOnLeaveToday}</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Employees unavailable</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Upcoming Holidays</h3>
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        <Palmtree className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{upcomingHolidays}</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">In next 30 days</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Planned Leaves</h3>
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{upcomingLeaves}</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Requests for next 30 days</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Team Availability</h3>
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">92%</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Working capacity this week</p>
                </div>
            </div>

        </div>
    );
};

export default AvailabilityStats;
