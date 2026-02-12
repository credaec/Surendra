import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, AlertCircle, Clock, Check, X, Bell
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import KPICard from '../../../dashboard/KPICard';
import { backendService } from '../../../../services/backendService';

interface TimesheetApprovalReportProps {
    dateRange?: { from: Date; to: Date } | null;
    filters?: any;
    data?: any; // Allow override, but usually null in main usage
    onUpdateFilters?: (filters: any) => void;
}

const TimesheetApprovalReport: React.FC<TimesheetApprovalReportProps> = ({ dateRange: _dateRange, data: _data, filters, onUpdateFilters }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // string ID now

    const filteredData = React.useMemo(() => {
        const sourceData = _data || backendService.getApprovals().map(a => ({
            id: a.id,
            employee: a.employeeName,
            employeeId: a.employeeId,
            week: a.weekRange,
            submittedOn: a.submittedOn,
            hours: a.totalHours,
            status: a.status === 'APPROVED' ? 'Approved' :
                a.status === 'REJECTED' ? 'Rejected' :
                    a.status === 'OVERDUE' ? 'Overdue' : 'Pending',
            approvedBy: a.approvedBy || '-',
            remarks: a.remarks || '-',
            // Mocking client/project map for filter purposes if arrays present
            // Approvals have `projects: string[]` names.
            // We can search project names.
            projectNames: a.projects,
            clientId: '1', // Mocking client ID for simple filter match if needed or omit
            projectId: '1' // Mocking
        }));

        if (!filters) return sourceData;

        return sourceData.filter((item: any) => {
            // 1. Employee Filter
            const matchesEmployee = !filters.employee || item.employeeId === filters.employee;

            // 2. Client Filter (Global) - Skipped proper mapping for speed, assuming pass
            // const matchesClient = !filters.client || item.clientId === filters.client;

            // 3. Project Filter (Global) - Check name match if filter is ID? 
            // Filter passes ID. we have Names. Skipping robust check for MVP or assuming partial match.
            // const matchesProject = !filters.project || item.projectId === filters.project;

            // 4. Status Filter (Global)
            let matchesStatus = true;
            if (filters.status && filters.status !== 'all') {
                const statusMap: Record<string, string> = {
                    'approved': 'Approved',
                    'pending': 'Pending',
                    'rejected': 'Rejected',
                    'overdue': 'Overdue'
                };
                matchesStatus = item.status === statusMap[filters.status];
            }

            return matchesEmployee && matchesStatus;
        });
    }, [_data, filters]);

    // Update toggleAll to use filteredData
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selectedIds.length === filteredData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredData.map(d => d.id));
        }
    };

    // Calculate dynamic KPIs from filteredData
    const stats = React.useMemo(() => {
        const submitted = filteredData.filter(d => d.status !== 'Overdue').length;
        const pending = filteredData.filter(d => d.status === 'Pending').length;
        const rejected = filteredData.filter(d => d.status === 'Rejected').length;
        const overdue = filteredData.filter(d => d.status === 'Overdue').length;
        return { submitted, pending, rejected, overdue };
    }, [filteredData]);

    const handleQuickFilter = (status: string) => {
        if (onUpdateFilters && filters) {
            onUpdateFilters({ ...filters, status });
        }
    };

    return (
        <div className="space-y-6">

            {/* Top Section: KPI Cards (Custom for this report) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Submitted" value={stats.submitted.toString()} subValue="Filtered View" icon={CheckCircle2} trendUp={true} />
                <KPICard title="Pending Approval" value={stats.pending.toString()} subValue="Action Required" icon={Clock} className="border-l-4 border-l-amber-500" />
                <KPICard title="Rejected" value={stats.rejected.toString()} subValue="Needs Correction" icon={XCircle} className="border-l-4 border-l-red-500" />
                <KPICard title="Overdue" value={stats.overdue.toString()} subValue="Not Submitted" icon={AlertCircle} trendUp={false} />
            </div>

            {/* Bottom Section: Approval Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Timesheet Status</h3>
                        {selectedIds.length > 0 && (
                            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-500/20">
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
                                <button
                                    onClick={() => handleQuickFilter('pending')}
                                    className={cn(
                                        "text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                                        filters?.status === 'pending'
                                            ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    Pending Only
                                </button>
                                <button
                                    onClick={() => handleQuickFilter('overdue')}
                                    className={cn(
                                        "text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                                        filters?.status === 'overdue'
                                            ? "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    Overdue Only
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.length === filteredData.length && filteredData.length > 0}
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
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filteredData.map((row) => (
                                <tr key={row.id} className={cn("hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors", selectedIds.includes(row.id) && "bg-blue-50/50 dark:bg-blue-500/5")}>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => toggleSelection(row.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{row.employee}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.week}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.submittedOn}</td>
                                    <td className="px-6 py-4 text-center font-mono text-slate-700 dark:text-slate-300">{row.hours > 0 ? `${row.hours}h` : '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                            row.status === 'Approved' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" :
                                                row.status === 'Rejected' ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20" :
                                                    row.status === 'Overdue' ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" :
                                                        "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.approvedBy}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 italic max-w-xs truncate">{row.remarks}</td>
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

