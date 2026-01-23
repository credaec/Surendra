import React from 'react';
import { Eye, Edit3, MoreVertical, Download, CheckCircle, PauseCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { PayrollRecord } from '../../../services/mockBackend';

interface PayrollSummaryTabProps {
    data: PayrollRecord[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onViewQuery: (id: string) => void;
    onEdit: (record: PayrollRecord) => void;
    onStatusChange: (id: string, status: 'PAID' | 'HOLD' | 'APPROVED') => void;
    onDownloadSlip: (id: string) => void;
}

const PayrollSummaryTab: React.FC<PayrollSummaryTabProps> = ({
    data,
    selectedIds,
    onSelectionChange,
    onViewQuery,
    onEdit,
    onStatusChange,
    onDownloadSlip
}) => {
    // ... existing code ...

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onSelectionChange(data.map(item => item.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(sid => sid !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusBadge = (status: PayrollRecord['status']) => {
        switch (status) {
            case 'DRAFT':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Draft</span>;
            case 'APPROVED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Approved</span>;
            case 'PAID':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Paid</span>;
            case 'HOLD':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">On Hold</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-4">Employee</th>
                            <th className="px-4 py-4">Designation</th>
                            <th className="px-4 py-4 text-center">Total Hrs</th>
                            <th className="px-4 py-4 text-center">Approved</th>
                            <th className="px-4 py-4 text-center">Billable</th>
                            <th className="px-4 py-4 text-right">Rate</th>
                            <th className="px-4 py-4 text-right">Base Pay</th>
                            <th className="px-4 py-4 text-right">OT + Bonus</th>
                            <th className="px-4 py-4 text-right">Deductions</th>
                            <th className="px-4 py-4 text-right bg-slate-100/50">Total Payable</th>
                            <th className="px-4 py-4 text-center">Status</th>
                            <th className="px-4 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item.id} className={cn("hover:bg-slate-50 transition-colors", selectedIds.includes(item.id) && "bg-blue-50/30")}>
                                <td className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleSelectOne(item.id)}
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                                            {item.employeeName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{item.employeeName}</p>
                                            <p className="text-xs text-slate-500">{item.employeeId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-slate-600">{item.designation}</td>
                                <td className="px-4 py-4 text-center text-slate-500">{item.totalHours}</td>
                                <td className="px-4 py-4 text-center font-medium text-slate-700">{item.approvedHours}</td>
                                <td className="px-4 py-4 text-center text-slate-500">
                                    <div className="flex flex-col text-xs">
                                        <span className="text-emerald-600">{item.billableHours} Bill</span>
                                        <span className="text-slate-400">{item.nonBillableHours} Non</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right text-slate-600">
                                    {formatCurrency(item.hourlyRate)}
                                    <span className="text-xs text-slate-400 block">/{item.rateType === 'HOURLY' ? 'hr' : 'mo'}</span>
                                </td>
                                <td className="px-4 py-4 text-right font-medium text-slate-700">{formatCurrency(item.basePay)}</td>
                                <td className="px-4 py-4 text-right text-emerald-600">
                                    +{formatCurrency(item.overtimeAmount + item.bonus)}
                                </td>
                                <td className="px-4 py-4 text-right text-rose-600">
                                    -{formatCurrency(item.deductions)}
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-slate-900 bg-slate-50/50">
                                    {formatCurrency(item.totalPayable)}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {getStatusBadge(item.status)}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <button
                                            onClick={() => onViewQuery(item.id)}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {/* Actions for drafted/approved items */}
                                        {item.status !== 'PAID' && (
                                            <>
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                                    title="Edit Adjustments"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <div className="relative group">
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    {/* Quick Actions Dropdown */}
                                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-100 shadow-lg rounded-lg hidden group-hover:block z-10 p-1">
                                                        <button
                                                            onClick={() => onStatusChange(item.id, 'PAID')}
                                                            className="w-full text-left px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded flex items-center"
                                                        >
                                                            <CheckCircle className="h-3 w-3 mr-2" /> Mark Paid
                                                        </button>
                                                        <button
                                                            onClick={() => onStatusChange(item.id, 'HOLD')}
                                                            className="w-full text-left px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 rounded flex items-center"
                                                        >
                                                            <PauseCircle className="h-3 w-3 mr-2" /> Hold
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {item.status === 'PAID' && (
                                            <button
                                                onClick={() => onDownloadSlip(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                                                title="Download Slip"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <p>No payroll records found for this period.</p>
                        <p className="text-sm mt-2">Generate payroll or adjust filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollSummaryTab;
