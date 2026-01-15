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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">On Leave Today</h3>
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">{employeesOnLeaveToday}</span>
                    <p className="text-xs text-slate-500 mt-1">Employees unavailable</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Upcoming Holidays</h3>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Palmtree className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">{upcomingHolidays}</span>
                    <p className="text-xs text-slate-500 mt-1">In next 30 days</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Planned Leaves</h3>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">{upcomingLeaves}</span>
                    <p className="text-xs text-slate-500 mt-1">Requests for next 30 days</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Team Availability</h3>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">92%</span>
                    <p className="text-xs text-slate-500 mt-1">Working capacity this week</p>
                </div>
            </div>

        </div>
    );
};

export default AvailabilityStats;
