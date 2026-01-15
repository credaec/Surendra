import React from 'react';
import { cn } from '../../../lib/utils';
import { DollarSign, Search, Eye } from 'lucide-react';

import type { TimeEntry } from '../../../types/schema';

interface ExtendedTimeEntry extends TimeEntry {
    projectName: string;
    taskCategory: string;
    durationSeconds: number;
}

interface ReportsTableProps {
    entries: ExtendedTimeEntry[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ entries, searchQuery, onSearchChange }) => {
    // Filter by search query (Project or Task Category)
    const filteredEntries = entries.filter(e =>
        e.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.taskCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-semibold text-slate-900">Detailed Time Entries</h3>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search project/category..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Project</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3 text-right">Duration</th>
                            <th className="px-6 py-3 text-center">Attrs</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{entry.date}</td>
                                <td className="px-6 py-4 text-slate-700">{entry.projectName}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                        {entry.taskCategory}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                                    {formatDuration(entry.durationSeconds)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        {/* TODO: Add billable flag to TimeEntry if needed, assuming all project work is billable for now or based on category */}
                                        <div className="text-emerald-500" title="Billable">
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border",
                                        entry.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                            entry.status === 'REJECTED' ? "bg-red-50 text-red-700 border-red-100" :
                                                entry.status === 'SUBMITTED' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                    "bg-blue-50 text-blue-700 border-blue-100" // Running
                                    )}>
                                        {entry.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 p-1">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsTable;
