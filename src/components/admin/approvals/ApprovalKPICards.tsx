import React from 'react';
import { Clock, XCircle, AlertTriangle, Timer, DollarSign, Send } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ApprovalRequest } from '../../../services/mockBackend';

interface ApprovalKPICardsProps {
    approvals: ApprovalRequest[];
    onStatusFilter: (status: ApprovalRequest['status'] | 'ALL') => void;
    activeStatusFilter: string;
}

const ApprovalKPICards: React.FC<ApprovalKPICardsProps> = ({ approvals, onStatusFilter, activeStatusFilter }) => {

    // Calculate metrics based on the passed approvals data
    // In a real app, these might come from a separate "stats" API to avoid calculating on client if data is huge
    const stats = {
        submitted: approvals.filter(a => a.status === 'SUBMITTED').length,
        pending: approvals.filter(a => a.status === 'PENDING').length,
        rejected: approvals.filter(a => a.status === 'REJECTED').length,
        overdue: approvals.filter(a => a.status === 'OVERDUE').length,
        totalHours: approvals.reduce((acc, curr) => acc + curr.totalHours, 0),
        billableHours: approvals.reduce((acc, curr) => acc + curr.billableHours, 0),
    };

    const cards = [
        {
            title: 'Submitted',
            value: stats.submitted,
            icon: Send,
            statusKey: 'SUBMITTED',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200'
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: Clock,
            statusKey: 'PENDING',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200'
        },
        {
            title: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            statusKey: 'REJECTED',
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-200'
        },
        {
            title: 'Overdue',
            value: stats.overdue,
            icon: AlertTriangle,
            statusKey: 'OVERDUE',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Status Cards */}
            {cards.map((card) => {
                const isActive = activeStatusFilter === card.statusKey;
                return (
                    <div
                        key={card.title}
                        onClick={() => onStatusFilter(isActive ? 'ALL' : card.statusKey as any)}
                        className={cn(
                            "p-4 bg-white rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md",
                            isActive ? `ring-2 ring-offset-1 ${card.border.replace('border-', 'ring-')}` : "border-slate-100",
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                            </div>
                            <div className={cn("p-2 rounded-lg", card.bg, card.color)}>
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Non-clickable Info Cards */}
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Total Hours</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.totalHours.toFixed(1)}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                        <Timer className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Billable</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.billableHours.toFixed(1)}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalKPICards;
