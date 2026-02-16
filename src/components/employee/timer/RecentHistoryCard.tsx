import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import type { TimeEntry } from '../../../types/schema';
import { backendService, type User } from '../../../services/backendService';
import { formatDuration } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

const RecentHistoryCard: React.FC<{
    onEdit?: (entry: TimeEntry) => void;
    currentUserId?: string;
    entries?: TimeEntry[];
}> = ({ onEdit, currentUserId, entries: propEntries }) => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);

    // Fetch entries
    const fetchEntries = () => {
        if (propEntries) {
            setEntries(propEntries);
            setLoading(false);
            // Still need to check active entry for UI state
            const active = backendService.getActiveTimer(currentUserId || 'currentUser');
            setActiveEntry(active || null);
            return;
        }

        setLoading(true);
        // If currentUserId is provided (employee dashboard), filter by it.
        // Otherwise (admin), show all? Typically recent history is personal.
        // Let's assume this component is for the logged-in user's history.
        const all = backendService.getEntries(currentUserId);
        // Sort by date desc
        const sorted = [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(sorted.slice(0, 5)); // Top 5

        // Check for active
        const active = backendService.getActiveTimer(currentUserId || 'currentUser');
        setActiveEntry(active || null);

        setLoading(false);
    };

    useEffect(() => {
        fetchEntries();
        // Poll for updates (e.g. if timer stops via another tab)
        const interval = setInterval(fetchEntries, 5000);
        return () => clearInterval(interval);
    }, [currentUserId, propEntries]);

    const handleRestart = async (entry: TimeEntry) => {
        if (activeEntry) {
            alert('Please stop the current timer before starting a new one.');
            return;
        }
        // Start new timer with same details
        await backendService.startTimer(
            entry.userId,
            'Me', // Mock name, backend resolves name usually
            entry.projectId,
            entry.categoryId
        );
        fetchEntries();
    };

    const handleStop = async (userId: string) => {
        await backendService.stopTimer(userId);
        fetchEntries();
    };

    // Helper to resolve category name
    const getCategoryName = (id: string) => backendService.getTaskCategories().find(c => c.id === id)?.name || id;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-slate-400" /> Recent Activity
                </h3>
                <button
                    onClick={() => navigate('/employee/timesheet')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                    View All
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {loading && entries.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm">Loading...</div>
                ) : entries.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm">No recent activity</div>
                ) : (
                    entries.map(entry => {
                        const project = backendService.getProjects().find(p => p.id === entry.projectId);
                        const isActive = activeEntry?.id === entry.id;

                        // Mock "Overrun" check for UI visual (optional, but good for feedback)
                        const isOverrun = project?.estimatedHours && project.usedHours >= project.estimatedHours;

                        return (
                            <div
                                key={entry.id}
                                className={`group p-3 rounded-lg border transition-all ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="min-w-0">
                                        <div className="font-medium text-slate-900 dark:text-white text-sm truncate" title={project?.name}>
                                            {project?.name || 'Unknown Project'}
                                            {isOverrun && (
                                                <span className="ml-2 inline-flex items-center text-[10px] text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full" title="Project Budget Exceeded">
                                                    <AlertTriangle className="w-3 h-3 mr-0.5" /> Overrun
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {getCategoryName(entry.categoryId)} • {formatDuration(entry.durationMinutes)} • {new Date(entry.date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {isActive ? (
                                        <div className="flex items-center gap-2 animate-pulse">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                            </span>
                                            <button
                                                onClick={() => handleStop(entry.userId)}
                                                className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                                title="Stop Timer"
                                            >
                                                <Square className="w-3.5 h-3.5 fill-current" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRestart(entry)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                            title="Resume this task"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                    {entry.description || 'No description'}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentHistoryCard;
