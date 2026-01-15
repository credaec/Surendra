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
import type { Invoice } from '../../../services/mockBackend';

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
        <div className="space-y-4">
            {/* Top Row: Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Billed Amount</p>
                        <h3 className="text-3xl font-bold text-slate-900">${stats.totalBilled.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                        <Briefcase className="h-8 w-8" />
                    </div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Pending Receivable</p>
                        <h3 className="text-3xl font-bold text-slate-900">${stats.pendingReceivable.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
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
                                "p-4 bg-white rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md",
                                isActive ? "ring-2 ring-blue-500 border-blue-500" : "border-slate-100"
                            )}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-slate-500 uppercase">{card.title}</p>
                                <card.icon className={cn("h-4 w-4", card.color)} />
                            </div>
                            <h3 className={cn("text-2xl font-bold", card.color)}>{card.value}</h3>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InvoiceKPICards;
