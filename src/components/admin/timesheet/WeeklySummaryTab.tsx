import React, { useState } from 'react';
import { MoreHorizontal, FileText, CheckCircle, XCircle, Lock } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import { startOfWeek, endOfWeek, format, parseISO, startOfMonth, endOfMonth, subMonths, subWeeks, isWithinInterval } from 'date-fns';

interface WeeklySummaryTabProps {
    onViewDetail: (employeeId: string) => void;
    onApprove: (employeeId: string) => void;
    onReject: (employeeId: string) => void;
    onMenuAction: (employeeId: string, action: string) => void;
    filterEmployeeId: string;
    filterProjectId: string;
    filterClientId: string;
    filterStatus: string;
    dateRange: string;
}

const WeeklySummaryTab: React.FC<WeeklySummaryTabProps> = ({
    onViewDetail,
    onApprove,
    onReject,
    onMenuAction,
    filterEmployeeId,
    filterProjectId,
    filterClientId,
    filterStatus,
    dateRange
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Determine Date Range
    const now = new Date();
    let startCurrent, endCurrent;

    if (dateRange === 'this_month') {
        startCurrent = startOfMonth(now);
        endCurrent = endOfMonth(now);
    } else if (dateRange === 'last_month') {
        startCurrent = startOfMonth(subMonths(now, 1));
        endCurrent = endOfMonth(subMonths(now, 1));
    } else if (dateRange === 'last_week') {
        startCurrent = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        endCurrent = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    } else {
        // Default: this_week
        startCurrent = startOfWeek(now, { weekStartsOn: 1 });
        endCurrent = endOfWeek(now, { weekStartsOn: 1 });
    }

    const weekDisplay = `${format(startCurrent, 'MMM dd')} - ${format(endCurrent, 'MMM dd')}`;

    // Real Data Aggregation
    const employees = backendService.getUsers().filter(u => u.role === 'EMPLOYEE');
    // Filter Logic
    const allEntries = backendService.getEntries().filter(entry => {
        if (filterEmployeeId !== 'all' && entry.userId !== filterEmployeeId) return false;
        if (filterProjectId !== 'all' && entry.projectId !== filterProjectId) return false;
        if (filterClientId !== 'all') {
            const project = backendService.getProjects().find(p => p.id === entry.projectId);
            if (project?.clientId !== filterClientId) return false;
        }
        if (filterStatus !== 'all' && entry.status !== filterStatus) return false;

        // Date Filter
        const entryDate = parseISO(entry.date);
        if (!isWithinInterval(entryDate, { start: startCurrent, end: endCurrent })) return false;

        return true;
    });

    const weeklySummaries = employees.map((emp) => {
        const userEntries = allEntries.filter(e => e.userId === emp.id);

        // Skip employees with no entries if we are filtering, unless filtering for specific employee
        // But usually we want to show rows for all if we haven't filtered by employee, 
        // OR only show those with time? Table usually implies showing active.
        // Let's filter out empty rows if they have 0 hours to reduce noise, akin to the screenshot showing one row.
        if (userEntries.length === 0 && filterEmployeeId === 'all') return null;
        if (filterEmployeeId !== 'all' && emp.id !== filterEmployeeId) return null;

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
        } else {
            // If no entries, status is irrelevant, but we filtered them out above mostly.
            status = '-';
        }

        // Try to find a relevant approval request
        const approvals = backendService.getApprovals();
        const approvalReq = approvals.find(a => a.employeeId === emp.id && (a.status as string) === status);

        let submittedDate = '-';
        if (status === 'SUBMITTED' || status === 'APPROVED') {
            if (approvalReq?.submittedOn) {
                submittedDate = approvalReq.submittedOn;
            } else if (userEntries.length > 0) {
                const sorted = [...userEntries].sort((a, b) => b.date.localeCompare(a.date));
                submittedDate = sorted[0].date;
            }
        }

        let approvedById = '-';
        if (status === 'APPROVED') {
            approvedById = approvalReq?.approvedBy || 'Admin';
            if (approvalReq?.approvedBy) {
                const approver = backendService.getUsers().find(u => u.id === approvalReq.approvedBy);
                if (approver) approvedById = approver.name;
            }
        }

        return {
            id: emp.id,
            employeeName: emp.name,
            avatarInitials: emp.avatarInitials,
            department: emp.department,
            weekRange: weekDisplay,
            totalHours: totalMinutes / 60,
            billableHours: billableMinutes / 60,
            nonBillableHours: nonBillableMinutes / 60,
            status: status,
            submittedDate: submittedDate,
            approvedBy: approvedById,
        };
    }).filter(item => item !== null); // Filter out nulls

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
            setSelectedIds(new Set(weeklySummaries.map(s => s!.id)));
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
            case '-':
                return <span className="text-slate-400">-</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/10 px-6 py-2.5 flex items-center justify-between border-b border-blue-100 dark:border-blue-900/30 animate-in fade-in slide-in-from-top-1 transition-colors">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{selectedIds.size} Selected</span>
                    <div className="flex gap-2">
                        <button className="text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all active:scale-95 shadow-sm">
                            Bulk Approve
                        </button>
                        <button className="text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all active:scale-95 shadow-sm">
                            Bulk Lock
                        </button>
                    </div>
                </div>
            )}
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4 w-12 text-center">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500"
                                checked={selectedIds.size === weeklySummaries.length && weeklySummaries.length > 0}
                                onChange={toggleAll}
                            />
                        </th>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Total Hours</th>
                        <th className="px-6 py-4">Billable</th>
                        <th className="px-6 py-4">Non-Billable</th>

                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {weeklySummaries.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                                No time entries found for this period.
                            </td>
                        </tr>
                    ) : weeklySummaries.map((item) => (
                        <tr key={item!.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${selectedIds.has(item!.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                            <td className="px-6 py-4 text-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 focus:ring-blue-500"
                                    checked={selectedIds.has(item!.id)}
                                    onChange={() => toggleSelection(item!.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                        {item!.avatarInitials}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">{item!.employeeName}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{item!.weekRange}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">{item!.totalHours.toFixed(2)}h</td>
                            <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{item!.billableHours.toFixed(2)}h</td>
                            <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-500">{item!.nonBillableHours.toFixed(2)}h</td>

                            <td className="px-6 py-4">{getStatusBadge(item!.status)}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onViewDetail(item!.id)}
                                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                        title="View Details"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onApprove(item!.id)}
                                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                        title="Approve"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onReject(item!.id)}
                                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                        title="Reject"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onMenuAction(item!.id, 'more')}
                                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                        title="More Actions"
                                    >
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

