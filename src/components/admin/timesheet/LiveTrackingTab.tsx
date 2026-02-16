import React, { useEffect, useState } from 'react';
import { PauseCircle, MonitorPlay, Clock } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import { formatDuration } from '../../../lib/utils';
import type { TimeEntry } from '../../../types/schema';

// Extended type for Live active timers which have extra UI metadata stored
interface ActiveTimer extends TimeEntry {
    userName: string;
    projectName: string;
    taskCategory: string;
}

const LiveTrackingTab: React.FC = () => {
    const [liveTimers, setLiveTimers] = useState<ActiveTimer[]>([]);

    useEffect(() => {
        // Poll for active timers
        const fetchTimers = () => {
            const timers = backendService.getAllActiveTimers();
            const categories = backendService.getTaskCategories();

            // Re-fetch all metadata to be safe
            const allUsers = backendService.getUsers();
            const allProjects = backendService.getProjects();

            const fullyEnriched = timers.map(t => {
                const user = allUsers.find(u => u.id === t.userId);
                const project = allProjects.find(p => p.id === t.projectId);
                const category = categories.find(c => c.id === t.categoryId);

                // Calculate live duration
                let duration = 0;
                if (t.startTime) {
                    const start = new Date(t.startTime);
                    const now = new Date();
                    const diffMs = now.getTime() - start.getTime();
                    duration = Math.max(0, Math.floor(diffMs / 60000));
                }

                return {
                    ...t,
                    userName: user?.name || 'Unknown User',
                    projectName: project?.name || 'Unknown Project',
                    taskCategory: category?.name || t.categoryId,
                    durationMinutes: duration // Override with calculated duration
                };
            });

            setLiveTimers(fullyEnriched as ActiveTimer[]);
        };

        fetchTimers();
        const interval = setInterval(fetchTimers, 5000); // Update every 5s

        return () => clearInterval(interval);
    }, []);

    const handleForceStop = (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to force stop ${userName}'s timer?`)) {
            backendService.stopTimer(userId, "Admin Force Stop");
            // Refresh logic is auto-handled by the interval, but we can force a fetch if we extracted it.
            // Since fetchTimers is inside useEffect, we can't call it easily without refactoring.
            // For now, the 5s interval will pick it up, or we can add a quick local state filter to make it snappy.
            setLiveTimers(prev => prev.filter(t => t.userId !== userId));
            alert("Timer stopped successfully.");
        }
    };

    return (
        <div className="p-6 transition-colors">
            {liveTimers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveTimers.map((timer) => (
                        <div key={timer.userId} className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden animate-in fade-in zoom-in-95 duration-300 group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 animate-pulse ring-1 ring-blue-200 dark:ring-blue-800">
                                    <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-1.5"></span>
                                    LIVE
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-5">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-inner ring-2 ring-blue-50 dark:ring-blue-950">
                                    {timer.userName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{timer.userName}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" /> Started at {new Date(timer.startTime || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">Project</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{timer.projectName}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">Activity</div>
                                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{timer.taskCategory}</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 -mx-5 -mb-5 px-5 pb-5">
                                <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                                    {formatDuration(timer.durationMinutes)}
                                </div>
                                <button
                                    onClick={() => handleForceStop(timer.userId, timer.userName)}
                                    className="text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-xl font-bold border border-rose-100 dark:border-rose-900/30 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all transform active:scale-95 shadow-sm flex items-center gap-2"
                                >
                                    <PauseCircle className="w-4 h-4" /> Stop
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
                    <div className="relative mb-6">
                        <MonitorPlay className="w-20 h-20 opacity-10 animate-pulse" />
                        <Clock className="w-8 h-8 absolute -bottom-2 -right-2 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Active Timers</h3>
                    <p className="text-sm mt-2 max-w-xs text-center opacity-70">The team is currently focused on offline tasks or taking a well-deserved break.</p>
                </div>
            )}
        </div>
    );
};

export default LiveTrackingTab;
