import React, { useState, useMemo } from 'react';
import { Download, ChevronDown, ChevronUp, Layers, Calendar, Briefcase, User as UserIcon } from 'lucide-react';
import type { PayrollRecord } from '../../../services/backendService';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';
import { backendService } from '../../../services/backendService';

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

    // Generate specific line items derived from real Time Entries
    const costingData = useMemo(() => {
        const entries: CostingEntry[] = [];
        const timeEntries = backendService.getEntries();
        const projects = backendService.getProjects();
        // Optimize: Create maps
        const projectMap = new Map(projects.map(p => [p.id, p]));

        // Filter entries to only include those for employees in the current payroll records
        const employeeIds = new Set(records.map(r => r.employeeId));

        const relevantEntries = timeEntries.filter(e =>
            employeeIds.has(e.userId) && e.status === 'APPROVED'
        );

        relevantEntries.forEach(e => {
            const empName = records.find(r => r.employeeId === e.userId)?.employeeName || 'Unknown';
            const projName = projectMap.get(e.projectId || '')?.name || 'Internal/Other';

            // Cost calculation using record rate
            const record = records.find(r => r.employeeId === e.userId);
            const rate = record?.hourlyRate || 0;
            const hours = e.durationMinutes / 60;

            entries.push({
                id: e.id,
                employeeName: empName,
                date: e.date,
                project: projName,
                category: e.categoryId || 'General',
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
        <div className="space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-6 w-full md:w-auto mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Group By</span>
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as any)}
                            className="text-xs font-black uppercase tracking-wider bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                        >
                            <option value="Employee">Employee</option>
                            <option value="Project">Project</option>
                            <option value="Date">Date</option>
                        </select>
                    </div>

                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden md:block" />

                    <div className="flex space-x-2">
                        {/* Visual Filters / Toggles could go here */}
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-slate-900/10 dark:shadow-blue-500/20 active:scale-95"
                >
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Export CSV
                </button>
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th
                                    className="px-8 py-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group first:rounded-tl-[2.5rem]"
                                    onClick={() => { setGroupBy('Employee'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                                >
                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        <UserIcon className="h-3.5 w-3.5 mr-2 opacity-50" />
                                        Employee
                                        {groupBy === 'Employee' && (
                                            <span className="ml-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-0.5 rounded">
                                                {sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest"><div className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-2 opacity-50" /> Date</div></th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest"><div className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-2 opacity-50" /> Project</div></th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Hours</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Billable</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Rate</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedData.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.employeeName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-medium text-slate-500 dark:text-slate-400 text-xs">{item.date}</td>
                                    <td className="px-6 py-5 font-bold text-slate-700 dark:text-slate-300">{item.project}</td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                            item.category === 'Engineering' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" :
                                                item.category === 'Drafting' ? "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20" :
                                                    "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                        )}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center font-black text-slate-900 dark:text-white tracking-tighter text-base">{item.hours}</td>
                                    <td className="px-6 py-5 text-center">
                                        {item.isBillable ? (
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 mx-auto shadow-[0_0_8px_rgba(16,185,129,0.6)]" title="Billable" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.hourlyRate)}</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">/hr</div>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-slate-900 dark:text-white tracking-tighter text-base">
                                        {formatCurrency(item.costAmount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 z-10">
                            <tr>
                                <td colSpan={4} className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Total Calculation</td>
                                <td className="px-6 py-6 text-center text-slate-900 dark:text-white font-black tracking-tighter text-lg bg-white dark:bg-slate-900 border-x border-slate-100 dark:border-slate-800 shadow-sm">
                                    {sortedData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)} <span className="text-xs font-bold text-slate-400">h</span>
                                </td>
                                <td colSpan={2}></td>
                                <td className="px-8 py-6 text-right text-emerald-600 dark:text-emerald-400 font-black tracking-tighter text-xl bg-emerald-50/30 dark:bg-emerald-500/5">
                                    {formatCurrency(sortedData.reduce((acc, curr) => acc + curr.costAmount, 0))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdownTab;
