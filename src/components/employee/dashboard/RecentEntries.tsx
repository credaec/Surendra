import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, FileText, ArrowRight, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, formatDuration } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { backendService } from '../../../services/backendService';
import type { TimeEntry } from '../../../types/schema';

interface RecentActivityEntry extends TimeEntry {
    projectName: string;
    taskCategory: string;
    durationSeconds: number;
    notes?: string;
}

import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface RecentEntriesProps {
    dateFilter?: 'this-week' | 'this-month';
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ dateFilter = 'this-week' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState<RecentActivityEntry[]>([]);

    useEffect(() => {
        if (user) {
            const allEntries = backendService.getEntries(user.id);
            const projects = backendService.getProjects();
            const categories = backendService.getTaskCategories();

            // Filter based on Date Filter
            const today = new Date();
            let start, end;

            if (dateFilter === 'this-week') {
                start = startOfWeek(today, { weekStartsOn: 1 });
                end = endOfWeek(today, { weekStartsOn: 1 });
            } else {
                start = startOfMonth(today);
                end = endOfMonth(today);
            }

            const filteredEntries = allEntries.filter(e =>
                isWithinInterval(parseISO(e.date), { start, end })
            );

            // Sort: Newest first
            filteredEntries.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
                return dateB.getTime() - dateA.getTime();
            });

            // Enrich entries
            const enriched = filteredEntries.slice(0, 5).map(e => {
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
    }, [user, dateFilter]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            case 'SUBMITTED':
            case 'PENDING': return 'bg-amber-50/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
            case 'REJECTED': return 'bg-rose-50/50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
            case 'LOCKED': return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            default: return 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';
        }
    };



    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
                        <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Recent Activity</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95">
                        <Search className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/30 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-black">Project / Task</th>
                            <th className="px-6 py-4 font-black text-right">Duration</th>
                            <th className="px-6 py-4 font-black text-center">Info</th>
                            <th className="px-6 py-4 font-black text-right">Status</th>
                            <th className="px-6 py-4 font-black"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{entry.projectName}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 flex items-center">
                                            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg mr-3 shadow-sm text-xs">
                                                {new Date(entry.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                            {entry.taskCategory}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-slate-700 dark:text-slate-300 font-mono tracking-tighter">
                                        {entry.durationSeconds ? formatDuration(entry.durationSeconds, 'seconds') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm" title="Billable">
                                                <DollarSignIcon className="h-3.5 w-3.5" />
                                            </span>
                                            {entry.notes ? (
                                                <span className="p-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm" title="Has Notes">
                                                    <FileText className="h-3.5 w-3.5" />
                                                </span>
                                            ) : (
                                                <span className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700" title="No Notes">
                                                    <FileText className="h-3.5 w-3.5" />
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn("inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border", getStatusStyles(entry.status))}>
                                            {entry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right w-10">
                                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 inline-block mb-4">
                                        <History className="h-10 w-10 text-slate-200 dark:text-slate-800" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">No activity found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                <button
                    onClick={() => navigate('/employee/timesheet')}
                    className="w-full flex items-center justify-center py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-95 group"
                >
                    View All Entries <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

// Helper Icon for this component
const DollarSignIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" x2="12" y1="1" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
)

export default RecentEntries;
