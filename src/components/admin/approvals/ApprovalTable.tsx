import React from 'react';
import { Eye, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ApprovalRequest } from '../../../services/backendService';

interface ApprovalTableProps {
    data: ApprovalRequest[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onView: (item: ApprovalRequest) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({
    data,
    selectedIds,
    onSelectionChange,
    onView,
    onApprove,
    onReject
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

    const getStatusBadge = (status: ApprovalRequest['status']) => {
        switch (status) {
            case 'SUBMITTED':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Submitted</span>;
            case 'PENDING':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
            case 'APPROVED':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
            case 'OVERDUE':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-800"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-5 py-4 w-12">
                                <input
                                    type="checkbox"
                                    className="rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all"
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Employee</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Week Range</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Total Hrs</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Billable</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Non-Billable</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Projects</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Submitted On</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px]">Status</th>
                            <th className="px-5 py-4 uppercase tracking-widest text-[10px] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className={cn("group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200", selectedIds.includes(item.id) && "bg-blue-50/30 dark:bg-blue-900/10")}>
                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelectOne(item.id)}
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 mr-4 border border-slate-200 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
                                                {item.avatarInitials}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.employeeName}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">{item.employeeId.split('/')[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-slate-600 dark:text-slate-400">{item.weekRange}</td>
                                    <td className="px-5 py-4">
                                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{item.totalHours.toFixed(1)}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">h</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.billableHours.toFixed(1)}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/50 ml-1">b</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-slate-500 dark:text-slate-500 font-medium">{item.nonBillableHours.toFixed(1)}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500/50 ml-1">nb</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col">
                                            <span className="truncate max-w-[150px] font-bold text-slate-700 dark:text-slate-300" title={item.projects.join(', ')}>
                                                {item.projects[0]}
                                                {item.projects.length > 1 && <span className="inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 ml-2 font-black">+{item.projects.length - 1}</span>}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest">{item.submittedOn}</td>
                                    <td className="px-5 py-4">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onView(item)}
                                                className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {item.status !== 'APPROVED' && item.status !== 'REJECTED' && (
                                                <>
                                                    <button
                                                        onClick={() => onApprove(item.id)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"
                                                        title="Quick Approve"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(item.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"
                                                        title="Quick Reject"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] mb-6 border border-slate-100 dark:border-slate-800 shadow-inner">
                                            <CheckCircle className="h-12 w-12 text-slate-200 dark:text-slate-800" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">No timesheets found</h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mt-3 max-w-sm">Everything is caught up! Try adjusting your filters to see historical results.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Logic (Simple Mock) */}
            <div className="bg-slate-50/50 dark:bg-slate-950/50 px-6 py-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Showing <span className="text-slate-900 dark:text-white underline decoration-blue-500/30 underline-offset-4">{data.length}</span> results</span>
                <div className="flex space-x-3">
                    <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 shadow-sm transition-all active:scale-95">Previous</button>
                    <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 shadow-sm transition-all active:scale-95">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalTable;

