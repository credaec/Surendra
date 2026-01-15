import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, AlertCircle, Clock, Check, X, Bell
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import KPICard from '../../../dashboard/KPICard';

const mockApprovalData = [
    { id: 1, employee: 'Alice Johnson', week: 'Jan 8 - Jan 14', submittedOn: 'Jan 15', hours: 40, status: 'Approved', approvedBy: 'John Doe', remarks: '-' },
    { id: 2, employee: 'Bob Smith', week: 'Jan 8 - Jan 14', submittedOn: 'Jan 15', hours: 38, status: 'Pending', approvedBy: '-', remarks: 'Missing proof for OT' },
    { id: 3, employee: 'Charlie Brown', week: 'Jan 8 - Jan 14', submittedOn: 'Jan 16', hours: 42, status: 'Pending', approvedBy: '-', remarks: '-' },
    { id: 4, employee: 'Diana Prince', week: 'Jan 1 - Jan 7', submittedOn: 'Jan 8', hours: 35, status: 'Rejected', approvedBy: 'John Doe', remarks: 'Client mismatch' },
    { id: 5, employee: 'Ethan Hunt', week: 'Jan 8 - Jan 14', submittedOn: '-', hours: 0, status: 'Overdue', approvedBy: '-', remarks: 'Not submitted yet' },
];

interface TimesheetApprovalReportProps {
    dateRange?: { from: Date; to: Date } | null;
    data?: typeof mockApprovalData;
}

const TimesheetApprovalReport: React.FC<TimesheetApprovalReportProps> = ({ dateRange: _dateRange, data: _data }) => {
    // Default to mock data if not provided
    const data = _data || mockApprovalData;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelection = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selectedIds.length === mockApprovalData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(mockApprovalData.map(d => d.id));
        }
    };

    return (
        <div className="space-y-6">

            {/* Top Section: KPI Cards (Custom for this report) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Submitted" value="12" subValue="This Week" icon={CheckCircle2} trendUp={true} />
                <KPICard title="Pending Approval" value="5" subValue="Action Required" icon={Clock} className="border-l-4 border-l-amber-500" />
                <KPICard title="Rejected" value="2" subValue="Needs Correction" icon={XCircle} className="border-l-4 border-l-red-500" />
                <KPICard title="Overdue" value="3" subValue="Not Submitted" icon={AlertCircle} trendUp={false} />
            </div>

            {/* Bottom Section: Approval Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-slate-800">Timesheet Status</h3>
                        {selectedIds.length > 0 && (
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                {selectedIds.length} Selected
                            </span>
                        )}
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex space-x-2">
                        {selectedIds.length > 0 ? (
                            <>
                                <button className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">
                                    <Check className="h-3 w-3 mr-1.5" /> Approve Selected
                                </button>
                                <button className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors">
                                    <X className="h-3 w-3 mr-1.5" /> Reject Selected
                                </button>
                                <button className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                                    <Bell className="h-3 w-3 mr-1.5" /> Remind
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-2">
                                <button className="text-sm text-slate-500 hover:text-blue-600 font-medium px-2">Pending Only</button>
                                <button className="text-sm text-slate-500 hover:text-blue-600 font-medium px-2">Overdue Only</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.length === data.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Week Range</th>
                                <th className="px-6 py-4">Submitted On</th>
                                <th className="px-6 py-4 text-center">Hours</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Approved By</th>
                                <th className="px-6 py-4">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row) => (
                                <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", selectedIds.includes(row.id) && "bg-blue-50/50")}>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => toggleSelection(row.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{row.employee}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.week}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.submittedOn}</td>
                                    <td className="px-6 py-4 text-center font-mono">{row.hours > 0 ? `${row.hours}h` : '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            row.status === 'Approved' ? "bg-emerald-50 text-emerald-700" :
                                                row.status === 'Rejected' ? "bg-red-50 text-red-700" :
                                                    row.status === 'Overdue' ? "bg-slate-100 text-slate-600" :
                                                        "bg-amber-50 text-amber-700"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{row.approvedBy}</td>
                                    <td className="px-6 py-4 text-slate-500 italic max-w-xs truncate">{row.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimesheetApprovalReport;
