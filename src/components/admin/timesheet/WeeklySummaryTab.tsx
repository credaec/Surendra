import React, { useState } from 'react';
import { MoreHorizontal, FileText, CheckCircle, XCircle, Lock } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';

interface WeeklySummaryTabProps {
    onViewDetail: (employeeId: string) => void;
    filterEmployeeId: string;
    filterProjectId: string;
    filterClientId: string;
    filterStatus: string;
}

const WeeklySummaryTab: React.FC<WeeklySummaryTabProps> = ({
    onViewDetail,
    filterEmployeeId,
    filterProjectId,
    filterClientId,
    filterStatus
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Real Data Aggregation
    const employees = mockBackend.getUsers().filter(u => u.role === 'EMPLOYEE');
    // Filter Logic
    const allEntries = mockBackend.getEntries().filter(entry => {
        if (filterEmployeeId !== 'all' && entry.userId !== filterEmployeeId) return false;
        if (filterProjectId !== 'all' && entry.projectId !== filterProjectId) return false;
        if (filterClientId !== 'all') {
            // Need to lookup project for this entry to check client
            // Optimized: we could pre-fetch project map, but for mock data find is fine
            const project = mockBackend.getProjects().find(p => p.id === entry.projectId);
            if (project?.clientId !== filterClientId) return false;
        }
        if (filterStatus !== 'all' && entry.status !== filterStatus) return false;
        return true;
    });

    // Helper to filtered entries for this week (Mocking "This Week" filter logic)
    // In a real app, use date-fns startOfWeek/endOfWeek based on 'dateRange' prop if passed, 
    // but here we default to all entries since mock data might be sparse or old.
    // For strictly "This Week", usage would be: 
    // const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    // const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    // const entries = allEntries.filter(e => isWithinInterval(parseISO(e.date), { start, end }));

    const weeklySummaries = employees.map((emp) => {
        const userEntries = allEntries.filter(e => e.userId === emp.id);

        const totalMinutes = userEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
        const billableMinutes = userEntries.filter(e => e.isBillable).reduce((sum, e) => sum + e.durationMinutes, 0);
        const nonBillableMinutes = totalMinutes - billableMinutes;

        // Determine status based on entries
        let status = 'DRAFT';
        if (userEntries.length > 0) {
            if (userEntries.some(e => e.status === 'REJECTED')) status = 'REJECTED';
            else if (userEntries.every(e => e.status === 'APPROVED')) status = 'APPROVED';
            else if (userEntries.some(e => e.status === 'SUBMITTED')) status = 'SUBMITTED';
            else if (userEntries.every(e => e.status === 'LOCKED')) status = 'LOCKED';
        }

        return {
            id: emp.id,
            employeeName: emp.name,
            avatarInitials: emp.avatarInitials,
            department: emp.department,
            weekRange: 'Jan 13 - Jan 19', // Dynamic in future
            totalHours: totalMinutes / 60,
            billableHours: billableMinutes / 60,
            nonBillableHours: nonBillableMinutes / 60,
            proofMissingCount: 0, // Logic for proof missing could be added here
            status: status,
            submittedDate: '2026-01-19',
            approvedBy: status === 'APPROVED' ? 'Dhiraj Vasu' : '-',
        };
    });

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedIds.size === weeklySummaries.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(weeklySummaries.map(s => s.id)));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Approved</span>;
            case 'LOCKED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><Lock className="w-3 h-3 mr-1" /> Locked</span>;
            case 'SUBMITTED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Submitted</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 px-6 py-2 flex items-center justify-between border-b border-blue-100 animate-in fade-in slide-in-from-top-1">
                    <span className="text-sm font-medium text-blue-800">{selectedIds.size} Selected</span>
                    <div className="flex gap-2">
                        <button className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            Bulk Approve
                        </button>
                        <button className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            Bulk Lock
                        </button>
                    </div>
                </div>
            )}
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 w-12 text-center">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                checked={selectedIds.size === weeklySummaries.length && weeklySummaries.length > 0}
                                onChange={toggleAll}
                            />
                        </th>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Total Hours</th>
                        <th className="px-6 py-4">Billable</th>
                        <th className="px-6 py-4">Non-Billable</th>
                        <th className="px-6 py-4">Proof Missing</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {weeklySummaries.map((item) => (
                        <tr key={item.id} className={`hover:bg-slate-50 transition-colors group ${selectedIds.has(item.id) ? 'bg-blue-50/30' : ''}`}>
                            <td className="px-6 py-4 text-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedIds.has(item.id)}
                                    onChange={() => toggleSelection(item.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                        {item.avatarInitials}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{item.employeeName}</div>
                                        <div className="text-xs text-slate-500">{item.weekRange}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono font-medium text-slate-900">{item.totalHours.toFixed(2)}h</td>
                            <td className="px-6 py-4 font-mono text-slate-600">{item.billableHours.toFixed(2)}h</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{item.nonBillableHours.toFixed(2)}h</td>
                            <td className="px-6 py-4">
                                {item.proofMissingCount > 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                        {item.proofMissingCount} Missing
                                    </span>
                                ) : (
                                    <span className="text-slate-400 text-xs">All Good</span>
                                )}
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onViewDetail(item.id)}
                                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded bg-white hover:bg-slate-100 border border-slate-200"
                                        title="View Details"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:text-emerald-600 rounded bg-white hover:bg-slate-100 border border-slate-200" title="Approve">
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:text-rose-600 rounded bg-white hover:bg-slate-100 border border-slate-200" title="Reject">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:text-slate-800 rounded bg-white hover:bg-slate-100 border border-slate-200">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeeklySummaryTab;
