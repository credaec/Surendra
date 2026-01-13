import React from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle2, Circle, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

const RecentEntries: React.FC = () => {
    const entries = [
        { id: 1, date: 'Today', project: 'Skyline Tower', category: 'Design', duration: '2h 15m', billable: true, proof: true, status: 'DRAFT' },
        { id: 2, date: 'Today', project: 'Riverfront Park', category: 'Meeting', duration: '1h 00m', billable: true, proof: false, status: 'SUBMITTED' },
        { id: 3, date: 'Yesterday', project: 'Internal Training', category: 'Learning', duration: '4h 30m', billable: false, proof: false, status: 'APPROVED' },
        { id: 4, date: 'Jan 12', project: 'Skyline Tower', category: 'Drafting', duration: '3h 45m', billable: true, proof: true, status: 'LOCKED' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'LOCKED': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-white text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                <div className="flex items-center space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md">
                        <Search className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-5 py-3 font-medium">Project / Task</th>
                            <th className="px-5 py-3 font-medium text-right">Duration</th>
                            <th className="px-5 py-3 font-medium text-center">Info</th>
                            <th className="px-5 py-3 font-medium text-right">Status</th>
                            <th className="px-5 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-5 py-3.5">
                                    <div className="font-medium text-slate-900">{entry.project}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                                        <span className="text-blue-600 bg-blue-50 px-1.5 rounded-[3px] mr-2">{entry.date}</span>
                                        {entry.category}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-700">
                                    {entry.duration}
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                    <div className="flex items-center justify-center space-x-1.5">
                                        {entry.billable ? (
                                            <span className="text-emerald-500" title="Billable">
                                                <DollarSignIcon className="h-3.5 w-3.5" />
                                            </span>
                                        ) : (
                                            <span className="text-slate-300" title="Non-Billable">
                                                <DollarSignIcon className="h-3.5 w-3.5" />
                                            </span>
                                        )}
                                        {entry.proof ? (
                                            <span className="text-purple-500" title="Proof Attached">
                                                <ImageIcon className="h-3.5 w-3.5" />
                                            </span>
                                        ) : (
                                            <span className="text-slate-200" title="No Proof">
                                                <ImageIcon className="h-3.5 w-3.5" />
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border", getStatusColor(entry.status))}>
                                        {entry.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 border-t border-slate-100 text-center">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                    View All Entries
                </button>
            </div>
        </div>
    );
};

// Helper Icon for this component
const DollarSignIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" x2="12" y1="1" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
)

export default RecentEntries;
