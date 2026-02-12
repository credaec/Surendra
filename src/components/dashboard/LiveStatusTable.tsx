import React, { useState, useEffect } from 'react';
import { backendService } from '../../services/backendService';
import type { TimeEntry } from '../../types/schema';
import { cn } from '../../lib/utils';
import { Clock, Activity, User } from 'lucide-react';

interface ActiveTimer extends TimeEntry {
    userName: string;
    projectName: string;
    taskCategory: string;
    durationSeconds: number;
    dailyMinutes: number;
}

const LiveStatusTable: React.FC = () => {
    const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);

    useEffect(() => {
        const fetchTimers = () => {
            const entries = backendService.getAllActiveTimers();
            const users = backendService.getUsers();
            const projects = backendService.getProjects();
            const categories = backendService.getTaskCategories();
            const allEntries = backendService.getEntries();
            const todayStr = new Date().toISOString().split('T')[0];

            const enriched = entries.map(entry => {
                const user = users.find(u => u.id === entry.userId);
                const project = projects.find(p => p.id === entry.projectId);
                const category = categories.find(c => c.id === entry.categoryId);

                // Calc Daily Total (Fix Date Comparison)
                const userDaily = allEntries
                    .filter(e => e.userId === entry.userId && e.date.split('T')[0] === todayStr && e.status !== 'REJECTED')
                    .reduce((sum, e) => sum + e.durationMinutes, 0);

                // Calc Current Session Duration
                let accumulated = 0;
                if (entry.activityLogs) {
                    try {
                        const logs = JSON.parse(entry.activityLogs);
                        accumulated = logs.accumulatedSeconds || 0;
                    } catch (e) { }
                }
                // Fallback
                if (!accumulated) accumulated = (entry as any).accumulatedSeconds || 0;

                let currentDuration = accumulated;
                if (entry.startTime) {
                    const start = new Date(entry.startTime).getTime();
                    const now = Date.now();
                    currentDuration += Math.floor((now - start) / 1000);
                }

                return {
                    ...entry,
                    userName: user?.name || 'Unknown User',
                    projectName: project?.name || 'Unknown Project',
                    taskCategory: category?.name || entry.categoryId,
                    durationSeconds: currentDuration, // Use calculated duration
                    dailyMinutes: userDaily
                } as ActiveTimer;
            });
            setActiveTimers(enriched);
        };

        fetchTimers();

        const interval = setInterval(fetchTimers, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full transition-all duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl">
                        <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Live Team Status</h3>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Live Updating</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Employee</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Current Tracking</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Daily Total</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeTimers.length > 0 ? (
                            activeTimers.map((timer) => {
                                const isOvertime = timer.dailyMinutes > 570; // 9.5h
                                const hours = Math.floor(timer.dailyMinutes / 60);
                                const mins = timer.dailyMinutes % 60;

                                return (
                                    <tr key={timer.userId} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 dark:text-white leading-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{timer.userName}</div>
                                                    {isOvertime && (
                                                        <div className="mt-1 flex items-center">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 animate-pulse" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">Overtime Warning</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                    <span>{timer.projectName}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                                                        <Clock className="h-3 w-3 mr-1.5" />
                                                        {timer.taskCategory}
                                                    </div>
                                                    <div className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold">
                                                        {Math.floor(timer.durationSeconds / 3600)}h {Math.floor((timer.durationSeconds % 3600) / 60)}m {Math.floor(timer.durationSeconds % 60)}s
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-start">
                                                <span className="font-black text-slate-900 dark:text-white tracking-tighter text-lg">{hours}h {mins}m</span>
                                                <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            isOvertime ? "bg-purple-500" : "bg-blue-500"
                                                        )}
                                                        style={{ width: `${Math.min((timer.dailyMinutes / 600) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                                                Active Now
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-24">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-slate-800">
                                            <Activity className="h-10 w-10 text-slate-200 dark:text-slate-800" />
                                        </div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">No Active Timers</h4>
                                        <p className="text-xs font-semibold text-slate-300 dark:text-slate-700 mt-2">Team is currently offline</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveStatusTable;
