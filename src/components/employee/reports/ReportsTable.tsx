import React from 'react';
import { cn } from '../../../lib/utils';
import { Image, DollarSign, Search, Eye } from 'lucide-react';

interface ReportsTableProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ searchQuery, onSearchChange }) => {
    // Mock Data for Table
    const entries = [
        { id: 1, date: 'Jan 14, 2026', project: 'BCS Skylights', category: 'Engineering', duration: '4h 30m', billable: true, proof: true, status: 'APPROVED' },
        { id: 2, date: 'Jan 14, 2026', project: 'Dr. Wade Residence', category: 'Drafting', duration: '2h 15m', billable: true, proof: false, status: 'SUBMITTED' },
        { id: 3, date: 'Jan 13, 2026', project: 'Internal', category: 'Meeting', duration: '1h 00m', billable: false, proof: false, status: 'APPROVED' },
        { id: 4, date: 'Jan 12, 2026', project: 'City Mall', category: 'Site Visit', duration: '3h 45m', billable: true, proof: true, status: 'LOCKED' },
    ];

    const filteredEntries = entries.filter(e =>
        e.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                <td className="px-6 py-4 text-slate-700">{entry.project}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                        {entry.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                                    {entry.duration}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        {entry.billable ? (
                                            <div className="text-emerald-500" title="Billable">
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                        ) : (
                                            <div className="text-slate-300" title="Non-Billable">
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                        )}
                                        {entry.proof && (
                                            <div className="text-purple-500" title="Proof Attached">
                                                <Image className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border",
                                        entry.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                            entry.status === 'LOCKED' ? "bg-slate-100 text-slate-600 border-slate-200" :
                                                entry.status === 'SUBMITTED' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                    "bg-white text-slate-700 border-slate-200"
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
