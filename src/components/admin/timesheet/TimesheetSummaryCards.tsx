import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, PieChart, Briefcase } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { formatDuration } from '../../../lib/utils';

interface TimesheetSummaryCardsProps {
    dateRange: string;
    filterEmployeeId: string;
    filterProjectId: string;
    filterClientId: string;
}

const TimesheetSummaryCards: React.FC<TimesheetSummaryCardsProps> = ({
    dateRange,
    filterEmployeeId,
    filterProjectId,
    filterClientId
}) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalHours: 0,
        billableHours: 0,
        nonBillableHours: 0,
        billablePercentage: 0,
        pendingApproval: 0,
        weekOverWeekTrend: 0
    });

    useEffect(() => {
        const calculateStats = () => {
            const allEntries = backendService.getEntries();

            // Determine Date Range
            const now = new Date();
            let startCurrent, endCurrent, startLast, endLast;

            if (dateRange === 'this_month') {
                startCurrent = startOfMonth(now);
                endCurrent = endOfMonth(now);
                startLast = startOfMonth(subMonths(now, 1));
                endLast = endOfMonth(subMonths(now, 1));
            } else if (dateRange === 'last_month') {
                startCurrent = startOfMonth(subMonths(now, 1));
                endCurrent = endOfMonth(subMonths(now, 1));
                startLast = startOfMonth(subMonths(now, 2));
                endLast = endOfMonth(subMonths(now, 2));
            } else if (dateRange === 'last_week') {
                startCurrent = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                endCurrent = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                startLast = startOfWeek(subWeeks(now, 2), { weekStartsOn: 1 });
                endLast = endOfWeek(subWeeks(now, 2), { weekStartsOn: 1 });
            } else {
                // Default: this_week
                startCurrent = startOfWeek(now, { weekStartsOn: 1 });
                endCurrent = endOfWeek(now, { weekStartsOn: 1 });
                startLast = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                endLast = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
            }

            let currentTotalMinutes = 0;
            let lastTotalMinutes = 0;
            let currentBillableMinutes = 0;
            let currentPending = 0;

            allEntries.forEach(entry => {
                // Apply Filters
                if (filterEmployeeId !== 'all' && entry.userId !== filterEmployeeId) return;
                if (filterProjectId !== 'all' && entry.projectId !== filterProjectId) return;
                // Client filter would require resolving project -> client, assuming simplified check or skipping for now if distinct

                const entryDate = parseISO(entry.date);

                // Check if entry is in current range
                if (isWithinInterval(entryDate, { start: startCurrent, end: endCurrent })) {
                    currentTotalMinutes += entry.durationMinutes;
                    if (entry.isBillable) currentBillableMinutes += entry.durationMinutes;

                    if (entry.status === 'SUBMITTED') {
                        currentPending++;
                    }
                }

                // Check if entry is in last range (for trend)
                if (isWithinInterval(entryDate, { start: startLast, end: endLast })) {
                    lastTotalMinutes += entry.durationMinutes;
                }
            });

            const totalHours = currentTotalMinutes / 60;
            const billableHours = currentBillableMinutes / 60;
            const nonBillableHours = totalHours - billableHours;
            const percentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

            const trend = lastTotalMinutes > 0
                ? ((currentTotalMinutes - lastTotalMinutes) / lastTotalMinutes) * 100
                : 0;

            setStats({
                totalHours,
                billableHours,
                nonBillableHours,
                billablePercentage: percentage,
                pendingApproval: currentPending,
                weekOverWeekTrend: trend
            });
        };

        calculateStats();
        const interval = setInterval(calculateStats, 2000);
        return () => clearInterval(interval);

    }, [dateRange, filterEmployeeId, filterProjectId, filterClientId]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

            {/* Total Hours */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Hours</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatDuration(stats.totalHours * 60)}</h3>
                <div className={`mt-2 flex items-center text-xs font-medium ${stats.weekOverWeekTrend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {stats.weekOverWeekTrend >= 0 ? '+' : ''}{stats.weekOverWeekTrend.toFixed(0)}% <span className="text-slate-400 ml-1 font-normal">vs last period</span>
                </div>
            </div>

            {/* Billable Hours */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Billable Hours</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatDuration(stats.billableHours * 60)}</h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(stats.billablePercentage, 100)}%` }}></div>
                </div>
            </div>

            {/* Billable % */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PieChart className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Billable %</p>
                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.billablePercentage.toFixed(1)}%</h3>
                <p className="text-xs text-slate-400 mt-1">Target: 75%</p>
            </div>

            {/* Non-Billable */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Non-Billable</p>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">{formatDuration(stats.nonBillableHours * 60)}</h3>
                <p className="text-xs text-slate-400 mt-2">Internal meetings, training</p>
            </div>

            {/* Pending Approvals */}
            <div
                onClick={() => navigate('/admin/approvals')}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer"
            >
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="w-12 h-12 text-amber-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Pending Approval</p>
                <h3 className="text-2xl font-bold text-amber-500">{stats.pendingApproval} <span className="text-sm font-normal text-slate-400">Items</span></h3>
                <p className="text-xs text-slate-400 mt-2">Requires PM/Admin review</p>
            </div>

        </div>
    );
};

export default TimesheetSummaryCards;
