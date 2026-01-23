import React from 'react';
import { Clock, TrendingUp, DollarSign, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { mockBackend } from '../../../services/mockBackend';
import { isSameDay, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

const KPIStats: React.FC = () => {
    const { user } = useAuth();

    // Live Metrics
    const entries = user ? mockBackend.getEntries(user.id) : [];
    const today = new Date();

    // Today's Hours
    const todayEntries = entries.filter(e => isSameDay(parseISO(e.date), today));
    const todaySeconds = todayEntries.reduce((acc, e) => acc + (e.durationMinutes * 60 || 0), 0);
    const todayHours = Math.floor(todaySeconds / 3600);
    const todayMins = Math.floor((todaySeconds % 3600) / 60);

    // Week's Hours
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekEntries = entries.filter(e => isWithinInterval(parseISO(e.date), { start: weekStart, end: weekEnd }));
    const weekSeconds = weekEntries.reduce((acc, e) => acc + (e.durationMinutes * 60 || 0), 0);
    const weekHours = Math.floor(weekSeconds / 3600);
    const weekMins = Math.floor((weekSeconds % 3600) / 60);

    // Billable Percentage (Week)
    const weekBillableSeconds = weekEntries
        .filter(e => e.isBillable)
        .reduce((acc, e) => acc + (e.durationMinutes * 60 || 0), 0);

    const billablePct = weekSeconds > 0
        ? Math.round((weekBillableSeconds / weekSeconds) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {/* Card 1: Today Logged */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Today Logged</p>
                    <div className="text-2xl font-bold text-slate-900">{todayHours}h {todayMins}m</div>
                    <p className="text-xs text-slate-400 mt-1">Target 8h</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock className="h-5 w-5" />
                </div>
            </div>

            {/* Card 2: This Week */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">This Week</p>
                    <div className="text-2xl font-bold text-slate-900">{weekHours}h {weekMins}m</div>
                    <p className="text-xs text-slate-400 mt-1">Mon–Sun total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                </div>
            </div>

            {/* Card 3: Billable % */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Billable %</p>
                    <div className="text-2xl font-bold text-slate-900">{billablePct}%</div>
                    <p className="text-xs text-slate-400 mt-1">Billable vs Total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <DollarSign className="h-5 w-5" />
                </div>
            </div>

            {/* Card 4: Timesheet Status */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Timesheet Status</p>
                    <CalendarCheck className="h-5 w-5 text-purple-600" />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${(() => {
                        // 1. Determine Status Logic
                        // Check if an approval request exists for this user for this week
                        const approvals = mockBackend.getApprovals();
                        // Logic matches week range string format in backend (e.g., 'Jan 08 - Jan 14, 2026')
                        // Ideally we construct this string or check entries status. 
                        // For MVP simplicity: check if ANY pending approval exists, else 'Draft'
                        const userApproval = approvals.find(a =>
                            a.employeeId === user?.id &&
                            (a.status === 'PENDING' || a.status === 'SUBMITTED')
                        );

                        const status = userApproval ? userApproval.status : 'Draft';

                        switch (status) {
                            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                            case 'PENDING':
                            case 'SUBMITTED': return 'bg-amber-50 text-amber-700 border-amber-100';
                            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
                            default: return 'bg-purple-50 text-purple-700 border-purple-100'; // Draft
                        }
                    })()
                        }`}>
                        {(() => {
                            const approvals = mockBackend.getApprovals();
                            const userApproval = approvals.find(a =>
                                a.employeeId === user?.id &&
                                (a.status === 'PENDING' || a.status === 'SUBMITTED' || a.status === 'APPROVED')
                            );
                            return userApproval ? userApproval.status : 'Draft';
                        })()}
                    </span>
                    <button
                        onClick={() => window.location.href = '/employee/timesheet'}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        View
                    </button>
                </div>
            </div>

        </div>
    );
};

export default KPIStats;
