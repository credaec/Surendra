import React from 'react';
import {
    FileText,
    Send,
    CheckCircle2,
    AlertCircle,
    PieChart,
    DollarSign,
    Briefcase
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Invoice } from '../../../services/backendService';

interface InvoiceKPICardsProps {
    invoices: Invoice[];
    onFilterStatus: (status: Invoice['status'] | 'ALL') => void;
    activeFilter: string;
}

const InvoiceKPICards: React.FC<InvoiceKPICardsProps> = ({ invoices, onFilterStatus, activeFilter }) => {

    // Stats Calculation
    const stats = {
        total: invoices.length,
        draft: invoices.filter(i => i.status === 'DRAFT').length,
        sent: invoices.filter(i => i.status === 'SENT').length,
        partial: invoices.filter(i => i.status === 'PARTIAL').length,
        paid: invoices.filter(i => i.status === 'PAID').length,
        overdue: invoices.filter(i => i.status === 'OVERDUE').length,

        // Sums (assuming mostly SINGLE currency or converted, ignoring currency mixing for mock MVP)
        totalBilled: invoices.reduce((acc, curr) => acc + curr.totalAmount, 0),
        pendingReceivable: invoices.reduce((acc, curr) => acc + curr.balanceAmount, 0),
    };

    const cards = [
        {
            title: 'Draft Invoices',
            value: stats.draft,
            icon: FileText,
            color: 'text-slate-600',
            bg: 'bg-slate-100',
            status: 'DRAFT'
        },
        {
            title: 'Sent',
            value: stats.sent,
            icon: Send,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            status: 'SENT'
        },
        {
            title: 'Partially Paid',
            value: stats.partial,
            icon: PieChart,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            status: 'PARTIAL'
        },
        {
            title: 'Paid',
            value: stats.paid,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            status: 'PAID'
        },
        {
            title: 'Overdue',
            value: stats.overdue,
            icon: AlertCircle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            status: 'OVERDUE'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Top Row: Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all duration-300 hover:shadow-md">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Total Billed Amount</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">${stats.totalBilled.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
                        <Briefcase className="h-8 w-8" />
                    </div>
                </div>
                <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all duration-300 hover:shadow-md">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Pending Receivable</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">${stats.pendingReceivable.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
                        <DollarSign className="h-8 w-8" />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Status Counts */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {cards.map((card) => {
                    const isActive = activeFilter === card.status;
                    return (
                        <div
                            key={card.title}
                            onClick={() => onFilterStatus(isActive ? 'ALL' : card.status as any)}
                            className={cn(
                                "p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border cursor-pointer transition-all duration-200 group/status",
                                isActive ? "ring-2 ring-blue-500 dark:ring-blue-400 border-blue-100 dark:border-blue-900/40 shadow-lg shadow-blue-500/10" : "border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.title}</p>
                                <div className={cn("p-1.5 rounded-lg transition-colors", card.bg, "dark:bg-opacity-10", isActive && "bg-opacity-100")}>
                                    <card.icon className={cn("h-4 w-4", card.color, "dark:brightness-110")} />
                                </div>
                            </div>
                            <h3 className={cn("text-3xl font-black tracking-tight", card.color, "dark:brightness-110")}>{card.value}</h3>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InvoiceKPICards;

