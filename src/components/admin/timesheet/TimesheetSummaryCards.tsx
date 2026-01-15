import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, PieChart, Briefcase } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks, parseISO } from 'date-fns';

const TimesheetSummaryCards: React.FC = () => {
    const [stats, setStats] = useState({
        totalHours: 0,
        billableHours: 0,
        nonBillableHours: 0,
        billablePercentage: 0,
        pendingApproval: 0,
        proofMissing: 0,
        weekOverWeekTrend: 0
    });

    useEffect(() => {
        const calculateStats = () => {
            const allEntries = mockBackend.getEntries();

            // Current Week Range
            const now = new Date();
            const startCurrent = startOfWeek(now, { weekStartsOn: 1 });
            const endCurrent = endOfWeek(now, { weekStartsOn: 1 });

            // Last Week Range for Trend
            const startLast = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
            const endLast = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

            let currentTotalMinutes = 0;
            let lastTotalMinutes = 0;
            let currentBillableMinutes = 0;
            let currentPending = 0;
            let currentProofMissing = 0;

            allEntries.forEach(entry => {
                const entryDate = parseISO(entry.date);

                // Check if entry is in current week
                if (isWithinInterval(entryDate, { start: startCurrent, end: endCurrent })) {
                    currentTotalMinutes += entry.durationMinutes;
                    if (entry.isBillable) currentBillableMinutes += entry.durationMinutes;

                    if (entry.status === 'SUBMITTED') {
                        currentPending++;
                    }

                    // Check for proof missing (Billable but no proof URL)
                    if (entry.isBillable && !entry.proofUrl) {
                        currentProofMissing++;
                    }
                }

                // Check if entry is in last week
                if (isWithinInterval(entryDate, { start: startLast, end: endLast })) {
                    lastTotalMinutes += entry.durationMinutes;
                }
            });

            const totalHours = currentTotalMinutes / 60;
            const billableHours = currentBillableMinutes / 60;
            const nonBillableHours = totalHours - billableHours;
            const percentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

            // Simplified trend calculation
            const trend = lastTotalMinutes > 0
                ? ((currentTotalMinutes - lastTotalMinutes) / lastTotalMinutes) * 100
                : 0;

            setStats({
                totalHours,
                billableHours,
                nonBillableHours,
                billablePercentage: percentage,
                pendingApproval: currentPending,
                proofMissing: currentProofMissing,
                weekOverWeekTrend: trend
            });
        };

        calculateStats();
        // Set up an interval or listener if we had a real backend, but for now re-calc on mount 
        // effectively works. To handle updates from other components (like Add Entry), 
        // we might rely on parent re-renders or short polling.
        const interval = setInterval(calculateStats, 2000);
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

            {/* Total Hours */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-12 h-12 text-blue-600" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Hours</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalHours.toFixed(1)} <span className="text-sm font-normal text-slate-400">h</span></h3>
                <div className={`mt-2 flex items-center text-xs font-medium ${stats.weekOverWeekTrend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stats.weekOverWeekTrend >= 0 ? '+' : ''}{stats.weekOverWeekTrend.toFixed(0)}% <span className="text-slate-400 ml-1 font-normal">vs last week</span>
                </div>
            </div>

            {/* Billable Hours */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="w-12 h-12 text-emerald-600" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Billable Hours</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.billableHours.toFixed(1)} <span className="text-sm font-normal text-slate-400">h</span></h3>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(stats.billablePercentage, 100)}%` }}></div>
                </div>
            </div>

            {/* Billable % */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PieChart className="w-12 h-12 text-indigo-600" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Billable %</p>
                <h3 className="text-2xl font-bold text-indigo-600">{stats.billablePercentage.toFixed(1)}%</h3>
                <p className="text-xs text-slate-400 mt-1">Target: 75%</p>
            </div>

            {/* Non-Billable */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-all">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Non-Billable</p>
                <h3 className="text-2xl font-bold text-slate-700">{stats.nonBillableHours.toFixed(1)} <span className="text-sm font-normal text-slate-400">h</span></h3>
                <p className="text-xs text-slate-400 mt-2">Internal meetings, training</p>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="w-12 h-12 text-amber-500" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Pending Approval</p>
                <h3 className="text-2xl font-bold text-amber-500">{stats.pendingApproval} <span className="text-sm font-normal text-slate-400">Items</span></h3>
                <p className="text-xs text-slate-400 mt-2">Requires PM/Admin review</p>
            </div>

            {/* Proof Missing */}
            <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm relative overflow-hidden bg-rose-50/30 group hover:border-rose-300 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                </div>
                <p className="text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1">Proof Missing</p>
                <h3 className="text-2xl font-bold text-rose-600">{stats.proofMissing} <span className="text-sm font-normal text-rose-400/80">Entries</span></h3>
                <p className="text-xs text-rose-500 mt-2 font-medium">Action required</p>
            </div>

        </div>
    );
};

export default TimesheetSummaryCards;
