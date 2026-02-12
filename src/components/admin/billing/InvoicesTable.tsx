import React from 'react';
import { Eye, Send, CreditCard, Download, Trash2, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Invoice } from '../../../services/backendService';

interface InvoicesTableProps {
    data: Invoice[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onSelectAll: (ids: string[]) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onSend: (id: string) => void;
    onMarkPayment: (id: string) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
    isTrashMode?: boolean;
    onRestore?: (id: string) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
    data,
    selectedIds,
    onSelect,
    onSelectAll,
    onEdit,
    onSend,
    onMarkPayment,
    onDelete,
    onDownload,
    isTrashMode = false,
    onRestore
}) => {

    const getStatusBadge = (status: Invoice['status']) => {
        switch (status) {
            case 'DRAFT':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Draft</span>;
            case 'SENT':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Sent</span>;
            case 'PAID':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Paid</span>;
            case 'PARTIAL':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Partial</span>;
            case 'OVERDUE':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</span>;
            case 'CANCELLED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 line-through">Cancelled</span>;
            default:
                return null;
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-5 py-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onChange={(e) => onSelectAll(e.target.checked ? data.map(i => i.id) : [])}
                                />
                            </th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Invoice No</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Client</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Project</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Date</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Due Date</th>
                            <th className="px-5 py-4 text-right text-[10px] uppercase tracking-widest">Amount</th>
                            <th className="px-5 py-4 text-right text-[10px] uppercase tracking-widest">Balance</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-right text-[10px] uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.map((item) => (
                            <tr key={item.id} className={cn(
                                "group transition-all duration-200",
                                selectedIds.includes(item.id) ? "bg-blue-50/30 dark:bg-blue-500/5 shadow-inner" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                isTrashMode && 'opacity-60 grayscale-[0.5]'
                            )}>
                                <td className="px-5 py-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => onSelect(item.id)}
                                    />
                                </td>
                                <td className="px-5 py-4 font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.invoiceNo}</td>
                                <td className="px-5 py-4 font-bold text-slate-700 dark:text-slate-200">{item.clientName}</td>
                                <td className="px-5 py-4 font-medium text-slate-500 dark:text-slate-400">{item.projectName || '-'}</td>
                                <td className="px-5 py-4 font-medium text-slate-500 dark:text-slate-400">
                                    {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-4 font-medium text-slate-500 dark:text-slate-400">
                                    {new Date(item.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-4 text-right font-black text-slate-900 dark:text-white">{formatCurrency(item.totalAmount, item.currency)}</td>
                                <td className="px-5 py-4 text-right font-black">
                                    {item.status === 'PAID' ? (
                                        <span className="text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Paid</span>
                                    ) : (
                                        <span className={cn(item.status === 'OVERDUE' ? "text-rose-600 dark:text-rose-500" : "text-slate-700 dark:text-slate-200")}>
                                            {formatCurrency(item.balanceAmount, item.currency)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    {isTrashMode ? (
                                        <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">DELETED</span>
                                    ) : (
                                        getStatusBadge(item.status)
                                    )}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isTrashMode ? (
                                            <>
                                                <button
                                                    onClick={() => onRestore && onRestore(item.id)}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                                                    title="Restore Invoice"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => onEdit(item.id)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                                                    title="View/Edit"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                {(item.status === 'DRAFT' || item.status === 'SENT') && (
                                                    <button
                                                        onClick={() => onSend(item.id)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                                                        title="Send Invoice"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {(item.status === 'SENT' || item.status === 'PARTIAL' || item.status === 'OVERDUE') && (
                                                    <button
                                                        onClick={() => onMarkPayment(item.id)}
                                                        className="p-2 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"
                                                        title="Record Payment"
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => onDownload(item.id)}
                                                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                                    title="Download PDF"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={10} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                            <AlertCircle className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{isTrashMode ? 'Trash is empty.' : 'No invoices found matching your filters.'}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesTable;

