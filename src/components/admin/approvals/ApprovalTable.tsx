import React from 'react';
import { Eye, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ApprovalRequest } from '../../../services/mockBackend';

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
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Submitted</span>;
            case 'PENDING':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
            case 'APPROVED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
            case 'OVERDUE':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</span>;
            default:
                return null;
        }
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
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-4">Employee</th>
                            <th className="px-4 py-4">Week Range</th>
                            <th className="px-4 py-4">Total Hrs</th>
                            <th className="px-4 py-4">Billable</th>
                            <th className="px-4 py-4">Non-Billable</th>
                            <th className="px-4 py-4">Projects</th>
                            <th className="px-4 py-4">Submitted On</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length > 0 ? (
                            data.map((item) => (
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
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                                {item.avatarInitials}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{item.employeeName}</div>
                                                <div className="text-xs text-slate-400">{item.employeeId.split('/')[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">{item.weekRange}</td>
                                    <td className="px-4 py-4 font-mono font-medium text-slate-900">{item.totalHours.toFixed(1)}</td>
                                    <td className="px-4 py-4 text-emerald-600 font-medium">{item.billableHours.toFixed(1)}</td>
                                    <td className="px-4 py-4 text-slate-500">{item.nonBillableHours.toFixed(1)}</td>
                                    <td className="px-4 py-4 text-slate-600">
                                        <div className="flex flex-col">
                                            <span className="truncate max-w-[150px]" title={item.projects.join(', ')}>
                                                {item.projects[0]}
                                                {item.projects.length > 1 && <span className="text-xs text-slate-400 ml-1">+{item.projects.length - 1} more</span>}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">{item.submittedOn}</td>
                                    <td className="px-4 py-4">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onView(item)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {item.status !== 'APPROVED' && item.status !== 'REJECTED' && (
                                                <>
                                                    <button
                                                        onClick={() => onApprove(item.id)}
                                                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                        title="Quick Approve"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(item.id)}
                                                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
                                <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                                            <CheckCircle className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-base font-medium text-slate-600">No timesheets found</p>
                                        <p className="text-sm mt-1">Try adjusting your filters to see more results.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Logic (Simple Mock) */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">{data.length}</span> results</span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalTable;
