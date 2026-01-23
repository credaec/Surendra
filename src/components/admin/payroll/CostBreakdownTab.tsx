import React, { useState, useMemo } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import type { PayrollRecord } from '../../../services/mockBackend';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';
import { mockBackend } from '../../../services/mockBackend';

export interface CostingEntry {
    id: string;
    employeeName: string;
    date: string;
    project: string;
    category: string;
    hours: number;
    isBillable: boolean;
    hourlyRate: number;
    costAmount: number;
    status: 'APPROVED' | 'PENDING';
}

interface CostBreakdownTabProps {
    records: PayrollRecord[];
}

const CostBreakdownTab: React.FC<CostBreakdownTabProps> = ({ records }) => {
    const { showToast } = useToast();
    const [groupBy, setGroupBy] = useState<'Employee' | 'Project' | 'Date'>('Employee');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Generate specific line items derived from the Payroll Records
    // In a real app, this would be fetched from an API endpoint: /api/payroll/{runId}/costing


    // Generate specific line items derived from real Time Entries
    const costingData = useMemo(() => {
        const entries: CostingEntry[] = [];
        const timeEntries = mockBackend.getEntries();
        const projects = mockBackend.getProjects();
        // Optimize: Create maps
        const projectMap = new Map(projects.map(p => [p.id, p]));

        // Filter entries to only include those for employees in the current payroll records
        const employeeIds = new Set(records.map(r => r.employeeId));

        // In a real app, we must also filter timeEntries by the Payroll Run's Date Range!
        // For MVP, we'll just show ALL entries for these employees to demonstrate data flow,
        // (or maybe filter by 'pending'/'approved' matching the run status?)
        // Let's assume we show all APPROVED entries for these users as that's what likely makes up the payroll.

        const relevantEntries = timeEntries.filter(e =>
            employeeIds.has(e.userId) && e.status === 'APPROVED'
        );

        relevantEntries.forEach(e => {
            const empName = records.find(r => r.employeeId === e.userId)?.employeeName || 'Unknown';
            const projName = projectMap.get(e.projectId || '')?.name || 'Internal/Other';

            // Cost calculation: Hours * User Rate
            // We can get rate from the record (snapshot) or current user rate.
            // Using record rate for consistency with payroll.
            const record = records.find(r => r.employeeId === e.userId);
            const rate = record?.hourlyRate || 0;
            const hours = e.durationMinutes / 60;

            entries.push({
                id: e.id,
                employeeName: empName,
                date: e.date,
                project: projName,
                category: e.categoryId || 'General', // We'd need category name lookup really
                hours: parseFloat(hours.toFixed(1)),
                isBillable: e.isBillable,
                hourlyRate: rate,
                costAmount: parseFloat((hours * rate).toFixed(2)),
                status: 'APPROVED'
            });
        });

        return entries;
    }, [records]);

    const sortedData = useMemo(() => {
        return [...costingData].sort((a, b) => {
            let valA, valB;
            switch (groupBy) {
                case 'Employee': valA = a.employeeName; valB = b.employeeName; break;
                case 'Project': valA = a.project; valB = b.project; break;
                case 'Date': valA = a.date; valB = b.date; break;
                default: valA = a.employeeName; valB = b.employeeName;
            }
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [costingData, groupBy, sortDirection]);

    const handleExport = () => {
        if (!sortedData.length) {
            showToast('No data to export', 'error');
            return;
        }

        const headers = ['Employee', 'Date', 'Project', 'Category', 'Hours', 'Billable', 'Rate', 'Cost', 'Status'];
        const rows = sortedData.map(r => [
            r.employeeName,
            r.date,
            r.project,
            r.category,
            r.hours,
            r.isBillable ? 'Yes' : 'No',
            r.hourlyRate,
            r.costAmount,
            r.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost_breakdown_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        showToast('Cost sheet exported successfully', 'success');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar for this tab */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-600 pl-2">Group By:</span>
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value as any)}
                        className="text-xs border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50 p-2"
                    >
                        <option value="Employee">Employee</option>
                        <option value="Project">Project</option>
                        <option value="Date">Date</option>
                    </select>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Export Cost Sheet
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th
                                    className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => { setGroupBy('Employee'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                                >
                                    <div className="flex items-center">
                                        Employee {groupBy === 'Employee' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
                                    </div>
                                </th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Project</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-center">Hours</th>
                                <th className="px-4 py-3 text-center">Billable?</th>
                                <th className="px-4 py-3 text-right">Rate</th>
                                <th className="px-4 py-3 text-right">Cost</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-900">{item.employeeName}</td>
                                    <td className="px-4 py-3 text-slate-500">{item.date}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.project}</td>
                                    <td className="px-4 py-3 text-slate-500">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs border",
                                            item.category === 'Engineering' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                item.category === 'Drafting' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                                    "bg-slate-50 text-slate-600 border-slate-200"
                                        )}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium">{item.hours}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.isBillable ? (
                                            <span className="text-emerald-600 text-xs font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">No</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500">{formatCurrency(item.hourlyRate)}</td>
                                    <td className="px-4 py-3 text-right font-medium text-slate-700">{formatCurrency(item.costAmount)}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 font-medium border-t border-slate-200">
                            <tr>
                                <td colSpan={4} className="px-4 py-3 text-right text-slate-600">Totals:</td>
                                <td className="px-4 py-3 text-center text-slate-900">
                                    {sortedData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)}
                                </td>
                                <td colSpan={2}></td>
                                <td className="px-4 py-3 text-right text-slate-900">
                                    {formatCurrency(sortedData.reduce((acc, curr) => acc + curr.costAmount, 0))}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdownTab;
