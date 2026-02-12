import React from 'react';
import { Eye, Edit3, MoreVertical, Download, CheckCircle, PauseCircle, Users, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { PayrollRecord } from '../../../services/backendService';

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
                return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">Draft</span>;
            case 'APPROVED':
                return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">Approved</span>;
            case 'PAID':
                return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">Paid</span>;
            case 'HOLD':
                return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 shadow-sm">On Hold</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-5 w-10 pl-8">
                                <input
                                    type="checkbox"
                                    className="rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all cursor-pointer h-4 w-4"
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Employee</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Designation</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Hours</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Breakdown</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Rate</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Base Pay</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Extras</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Deductions</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right bg-slate-50/50 dark:bg-slate-950/20 pr-8">Total Payable</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.map((item) => (
                            <tr key={item.id} className={cn(
                                "group transition-all duration-300",
                                selectedIds.includes(item.id)
                                    ? "bg-blue-50/30 dark:bg-blue-500/5 shadow-inner"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                            )}>
                                <td className="px-6 py-5 pl-8">
                                    <input
                                        type="checkbox"
                                        className="rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all cursor-pointer h-4 w-4"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleSelectOne(item.id)}
                                    />
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center">
                                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/20 mr-4 group-hover:scale-110 transition-transform duration-300">
                                            {item.employeeName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.employeeName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{item.employeeId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-bold text-slate-600 dark:text-slate-400 text-xs">{item.designation}</td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="font-black text-slate-900 dark:text-white tracking-tighter text-lg">{item.totalHours}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{item.approvedHours} Appr</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex flex-col text-[9px] font-black uppercase tracking-widest space-y-1">
                                        <div className="flex justify-between w-20 mx-auto">
                                            <span className="text-slate-400 dark:text-slate-500">Bill</span>
                                            <span className="text-slate-900 dark:text-white">{item.billableHours}</span>
                                        </div>
                                        <div className="flex justify-between w-20 mx-auto">
                                            <span className="text-slate-400 dark:text-slate-500">Non</span>
                                            <span className="text-slate-900 dark:text-white">{item.nonBillableHours}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.hourlyRate)}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">/{item.rateType === 'HOURLY' ? 'hr' : 'mo'}</div>
                                </td>
                                <td className="px-6 py-5 text-right font-black text-slate-700 dark:text-slate-300 tracking-tight text-sm opacity-80">{formatCurrency(item.basePay)}</td>
                                <td className="px-6 py-5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                    +{formatCurrency(item.overtimeAmount + item.bonus)}
                                </td>
                                <td className="px-6 py-5 text-right font-bold text-rose-600 dark:text-rose-400 text-xs">
                                    -{formatCurrency(item.deductions)}
                                </td>
                                <td className="px-8 py-5 text-right bg-slate-50/30 dark:bg-slate-900/40 pr-8">
                                    <span className="font-black text-slate-900 dark:text-white text-lg tracking-tighter shadow-sm">
                                        {formatCurrency(item.totalPayable)}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {getStatusBadge(item.status)}
                                </td>
                                <td className="px-6 py-5 text-center pr-8">
                                    <div className="flex items-center justify-center space-x-1">
                                        <button
                                            onClick={() => onViewQuery(item.id)}
                                            className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {item.status !== 'PAID' && (
                                            <>
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
                                                    title="Edit Adjustments"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <div className="relative group/menu">
                                                    <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl hidden group-hover/menu:block z-50 p-2 animate-in fade-in slide-in-from-top-1">
                                                        <button
                                                            onClick={() => onStatusChange(item.id, 'PAID')}
                                                            className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl flex items-center transition-colors mb-1"
                                                        >
                                                            <CheckCircle className="h-3.5 w-3.5 mr-3" /> Mark Paid
                                                        </button>
                                                        <button
                                                            onClick={() => onStatusChange(item.id, 'HOLD')}
                                                            className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl flex items-center transition-colors"
                                                        >
                                                            <PauseCircle className="h-3.5 w-3.5 mr-3" /> Put On Hold
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {item.status === 'PAID' && (
                                            <button
                                                onClick={() => onDownloadSlip(item.id)}
                                                className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
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
                    <div className="px-6 py-24 text-center">
                        <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] mb-6 border border-slate-100 dark:border-slate-800 inline-block shadow-inner hover:scale-105 transition-transform duration-500">
                            <Users className="h-16 w-16 text-slate-200 dark:text-slate-800" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">No records found</h3>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3 max-w-sm mx-auto">Try adjusting the period or filters to see payroll data.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollSummaryTab;
