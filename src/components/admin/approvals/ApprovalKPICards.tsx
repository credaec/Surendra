import React from 'react';
import { Clock, XCircle, AlertTriangle, Timer, DollarSign, CheckCircle } from 'lucide-react';
import { cn, formatDuration } from '../../../lib/utils';
import type { ApprovalRequest } from '../../../services/backendService';

interface ApprovalKPICardsProps {
    approvals: ApprovalRequest[];
    onStatusFilter: (status: ApprovalRequest['status'] | 'ALL') => void;
    activeStatusFilter: string;
}

const ApprovalKPICards: React.FC<ApprovalKPICardsProps> = ({ approvals, onStatusFilter, activeStatusFilter }) => {

    // Calculate metrics based on the passed approvals data
    // In a real app, these might come from a separate "stats" API to avoid calculating on client if data is huge
    const stats = {
        // Submitted now represents ALL requests (Total)
        submitted: approvals.length,
        // Pending now represents items waiting for approval (DB status 'SUBMITTED')
        pending: approvals.filter(a => a.status === 'SUBMITTED').length,
        approved: approvals.filter(a => a.status === 'APPROVED').length,
        rejected: approvals.filter(a => a.status === 'REJECTED').length,
        overdue: approvals.filter(a => a.status === 'OVERDUE').length,
        totalHours: approvals.reduce((acc, curr) => acc + curr.totalHours, 0),
        billableHours: approvals.reduce((acc, curr) => acc + curr.billableHours, 0),
    };

    const cards = [
        {
            title: 'Submitted',
            value: stats.approved,
            icon: CheckCircle,
            statusKey: 'APPROVED',
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            border: 'border-blue-200 dark:border-blue-800'
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: Clock,
            statusKey: 'SUBMITTED', // Filters for Submitted (which label says Pending)
            color: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-50 dark:bg-yellow-500/10',
            border: 'border-yellow-200 dark:border-yellow-800'
        },

        {
            title: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            statusKey: 'REJECTED',
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-500/10',
            border: 'border-rose-200 dark:border-rose-800'
        },
        {
            title: 'Overdue',
            value: stats.overdue,
            icon: AlertTriangle,
            statusKey: 'OVERDUE',
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-50 dark:bg-orange-500/10',
            border: 'border-orange-200 dark:border-orange-800'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* Status Cards */}
            {cards.map((card) => {
                const isActive = activeStatusFilter === card.statusKey;
                return (
                    <div
                        key={card.title}
                        onClick={() => onStatusFilter(isActive ? 'ALL' : card.statusKey as any)}
                        className={cn(
                            "p-6 bg-white dark:bg-slate-900 rounded-2xl border cursor-pointer transition-all duration-300 group hover:shadow-md",
                            isActive
                                ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/10"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700",
                        )}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.title}</h3>
                            <div className={cn("p-2.5 rounded-xl shadow-inner group-hover:scale-110 transition-transform", card.bg, card.color)}>
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{card.value}</span>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Requests</p>
                        </div>
                    </div>
                );
            })}

            {/* Non-clickable Info Cards */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Hours</h3>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-inner group-hover:scale-110 transition-transform">
                        <Timer className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{formatDuration(stats.totalHours * 60)}</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Hours tracked</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Billable</h3>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{formatDuration(stats.billableHours * 60)}</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Billable hours</p>
                </div>
            </div>
        </div>
    );
};

export default ApprovalKPICards;

