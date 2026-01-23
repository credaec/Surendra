import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { mockBackend } from '../../../services/mockBackend';
import type { TimeEntry } from '../../../types/schema';

interface RecentActivityEntry extends TimeEntry {
    projectName: string;
    taskCategory: string;
    durationSeconds: number;
    notes?: string;
}

const RecentEntries: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState<RecentActivityEntry[]>([]);

    useEffect(() => {
        if (user) {
            const allEntries = mockBackend.getEntries(user.id);
            const projects = mockBackend.getProjects();
            const categories = mockBackend.getTaskCategories();

            // Sort: Newest first
            allEntries.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
                return dateB.getTime() - dateA.getTime();
            });

            // Enrich entries
            const enriched = allEntries.slice(0, 5).map(e => {
                const project = projects.find(p => p.id === e.projectId);
                const category = categories.find(c => c.id === e.categoryId);
                return {
                    ...e,
                    projectName: project?.name || 'Unknown Project',
                    taskCategory: category?.name || e.categoryId, // Display Name or fallback to ID
                    durationSeconds: e.durationMinutes * 60,
                    notes: e.description
                };
            });
            setEntries(enriched as any);
        }
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'SUBMITTED':
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'LOCKED': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-white text-slate-600 border-slate-200';
        }
    };

    // Helper to format seconds to duration string
    const formatDuration = (seconds?: number) => {
        if (!seconds) return '-';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
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
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="font-medium text-slate-900">{entry.projectName}</div>
                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                                            <span className="text-blue-600 bg-blue-50 px-1.5 rounded-[3px] mr-2">{entry.date}</span>
                                            {entry.taskCategory}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-700">
                                        {formatDuration(entry.durationSeconds)}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <div className="flex items-center justify-center space-x-1.5">
                                            <span className="text-emerald-500" title="Billable">
                                                <DollarSignIcon className="h-3.5 w-3.5" />
                                            </span>
                                            {/* Mock proof attached check based on notes for flavor */}
                                            {entry.notes ? (
                                                <span className="text-purple-500" title="Has Notes">
                                                    <FileText className="h-3.5 w-3.5" />
                                                </span>
                                            ) : (
                                                <span className="text-slate-200" title="No Notes">
                                                    <FileText className="h-3.5 w-3.5" />
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                                    No recent entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-3 border-t border-slate-100 text-center">
                <button
                    onClick={() => navigate('/employee/timesheet')}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
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
