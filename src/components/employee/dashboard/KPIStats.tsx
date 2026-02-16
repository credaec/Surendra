import React from 'react';
import { Clock, TrendingUp, DollarSign, CalendarCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { backendService } from '../../../services/backendService';
import { isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface KPIStatsProps {
    dateFilter?: 'this-week' | 'this-month';
}

const KPIStats: React.FC<KPIStatsProps> = ({ dateFilter = 'this-week' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Live Metrics
    const entries = (user ? backendService.getEntries(user.id) : []).filter(e => e.status !== 'REJECTED');
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

    // Month's Hours
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const monthEntries = entries.filter(e => isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd }));
    const monthSeconds = monthEntries.reduce((acc, e) => acc + (e.durationMinutes * 60 || 0), 0);
    const monthHours = Math.floor(monthSeconds / 3600);
    const monthMins = Math.floor((monthSeconds % 3600) / 60);

    // Billable Percentage (Dynamic)
    const targetEntries = dateFilter === 'this-week' ? weekEntries : monthEntries;
    const targetSeconds = dateFilter === 'this-week' ? weekSeconds : monthSeconds;

    const targetBillableSeconds = targetEntries
        .filter(e => e.isBillable)
        .reduce((acc, e) => acc + (e.durationMinutes * 60 || 0), 0);

    const billablePct = targetSeconds > 0
        ? Math.round((targetBillableSeconds / targetSeconds) * 100)
        : 0;

    const cards = [
        {
            title: 'Today Logged',
            value: `${todayHours}h ${todayMins}m`,
            subtitle: 'Target 8h',
            icon: Clock,
            color: 'blue'
        },
        {
            title: dateFilter === 'this-week' ? 'This Week' : 'This Month',
            value: dateFilter === 'this-week' ? `${weekHours}h ${weekMins}m` : `${monthHours}h ${monthMins}m`,
            subtitle: dateFilter === 'this-week' ? 'Mon–Sun total' : 'Month total',
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            title: 'Billable %',
            value: `${billablePct}%`,
            subtitle: 'Billable vs Total',
            icon: DollarSign,
            color: 'amber'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{card.title}</p>
                        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{card.value}</div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tight">{card.subtitle}</p>
                    </div>
                    <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                        card.color === 'blue' && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10",
                        card.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10",
                        card.color === 'amber' && "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10"
                    )}>
                        <card.icon className="h-7 w-7" />
                    </div>
                </div>
            ))}

            {/* Card 4: Timesheet Status */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Timesheet Status</p>
                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                    <span className={cn(
                        "inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                        (() => {
                            const approvals = backendService.getApprovals();
                            const userApproval = approvals.find(a =>
                                a.employeeId === user?.id &&
                                (a.status === 'PENDING' || a.status === 'SUBMITTED' || a.status === 'APPROVED')
                            );
                            const status = userApproval ? userApproval.status : 'Draft';
                            switch (status) {
                                case 'APPROVED': return 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
                                case 'PENDING':
                                case 'SUBMITTED': return 'bg-amber-50/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
                                case 'REJECTED': return 'bg-rose-50/50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
                                default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'; // Draft
                            }
                        })()
                    )}>
                        {(() => {
                            const approvals = backendService.getApprovals();
                            const userApproval = approvals.find(a =>
                                a.employeeId === user?.id &&
                                (a.status === 'PENDING' || a.status === 'SUBMITTED' || a.status === 'APPROVED')
                            );
                            return userApproval ? userApproval.status : 'Draft';
                        })()}
                    </span>
                    <button
                        onClick={() => navigate('/employee/timesheet')}
                        className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 hover:translate-x-1 transition-all"
                    >
                        Review <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KPIStats;
