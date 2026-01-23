import React from 'react';
import { Eye, Edit3, Send, CreditCard, Download, Trash2, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Invoice } from '../../../services/mockBackend';

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
    onView,
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onChange={(e) => onSelectAll(e.target.checked ? data.map(i => i.id) : [])}
                                />
                            </th>
                            <th className="px-4 py-4">Invoice No</th>
                            <th className="px-4 py-4">Client</th>
                            <th className="px-4 py-4">Project</th>
                            <th className="px-4 py-4">Date</th>
                            <th className="px-4 py-4">Due Date</th>
                            <th className="px-4 py-4 text-right">Amount</th>
                            <th className="px-4 py-4 text-right">Balance</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item.id} className={cn("hover:bg-slate-50 transition-colors", selectedIds.includes(item.id) && "bg-blue-50/30", isTrashMode && 'bg-slate-50/50 grayscale-[0.5]')}>
                                <td className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => onSelect(item.id)}
                                    />
                                </td>
                                <td className="px-4 py-4 font-medium text-slate-900">{item.invoiceNo}</td>
                                <td className="px-4 py-4 text-slate-700">{item.clientName}</td>
                                <td className="px-4 py-4 text-slate-500">{item.projectName}</td>
                                <td className="px-4 py-4 text-slate-500">{item.date}</td>
                                <td className="px-4 py-4 text-slate-500">{item.dueDate}</td>
                                <td className="px-4 py-4 text-right font-medium text-slate-900">{formatCurrency(item.totalAmount, item.currency)}</td>
                                <td className="px-4 py-4 text-right font-medium text-slate-700">
                                    {item.balanceAmount > 0 ? (
                                        <span className={cn(item.status === 'OVERDUE' ? "text-rose-600" : "")}>{formatCurrency(item.balanceAmount, item.currency)}</span>
                                    ) : (
                                        <span className="text-emerald-600">Paid</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    {isTrashMode ? (
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-500">DELETED</span>
                                    ) : (
                                        getStatusBadge(item.status)
                                    )}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-1">
                                        {isTrashMode ? (
                                            <>
                                                <button
                                                    onClick={() => onRestore && onRestore(item.id)}
                                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                                                    title="Restore Invoice"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => onEdit(item.id)}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View/Edit"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                {(item.status === 'DRAFT' || item.status === 'SENT') && (
                                                    <button
                                                        onClick={() => onSend(item.id)}
                                                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                                                        title="Send Invoice"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {(item.status === 'SENT' || item.status === 'PARTIAL' || item.status === 'OVERDUE') && (
                                                    <button
                                                        onClick={() => onMarkPayment(item.id)}
                                                        className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded"
                                                        title="Record Payment"
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => onDownload(item.id)}
                                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                                                    title="Download PDF"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
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
                                <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                                    <p>{isTrashMode ? 'Trash is empty.' : 'No invoices found matching your filters.'}</p>
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
