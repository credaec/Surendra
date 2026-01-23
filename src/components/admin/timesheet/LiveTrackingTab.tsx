import React, { useEffect, useState } from 'react';
import { PauseCircle, MonitorPlay, Clock } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
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
            const timers = mockBackend.getAllActiveTimers();
            const categories = mockBackend.getTaskCategories();

            // Enrich with category name
            const enriched = timers.map(t => {
                const category = categories.find(c => c.id === t.categoryId);
                return {
                    ...t,
                    userName: t.userName, // Already coming from getAllActiveTimers? 
                    // Wait, getAllActiveTimers in mockBackend returns ActiveTimer mock which has userName? 
                    // Let's check mockBackend.getAllActiveTimers return type implementation if needed.
                    // Assuming getAllActiveTimers returns enriched user/project but not category name yet based on previous file read.
                    // Actually previous file read of LiveStatusTable showed it calls getAllActiveTimers() and THEN manual enrichment.
                    // But LiveTrackingTab.tsx (lines 19-20) just casts it.
                    // Let's be safe and re-map.

                    // Actually, looking at LiveTrackingTab.tsx lines 19-20: 
                    // const timers = mockBackend.getAllActiveTimers();
                    // setLiveTimers(timers as unknown as ActiveTimer[]);

                    // distinct naming collision: ActiveTimer interface in this file vs mockBackend?
                    // The interface in this file (lines 7-11) expects userName, projectName, taskCategory.

                    // mockBackend.getAllActiveTimers() likely returns objects with userId, projectId, categoryId, etc.
                    // and maybe 'userName' / 'projectName' if the mock function is fancy, but usually it returns basic info.
                    // I should explicitly enrich it here like I did in LiveStatusTable.

                    ...t,
                    // If mockBackend returns userName/projectName, keep them. 
                    // If not, I might need to fetch users/projects too.
                    // Let's assume for now I need to enrich everything to be safe, standard pattern.
                };
            });

            // Re-fetch all metadata to be safe
            const allUsers = mockBackend.getUsers();
            const allProjects = mockBackend.getProjects();

            const fullyEnriched = timers.map(t => {
                const user = allUsers.find(u => u.id === t.userId);
                const project = allProjects.find(p => p.id === t.projectId);
                const category = categories.find(c => c.id === t.categoryId);

                return {
                    ...t,
                    userName: user?.name || 'Unknown User', // active timer might typically have this, but let's ensure
                    projectName: project?.name || 'Unknown Project',
                    taskCategory: category?.name || t.categoryId
                };
            });

            setLiveTimers(fullyEnriched as ActiveTimer[]);
        };

        fetchTimers();
        const interval = setInterval(fetchTimers, 5000); // Update every 5s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">
            {liveTimers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveTimers.map((timer) => (
                        <div key={timer.userId} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                            <div className="absolute top-0 right-0 p-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 animate-pulse">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
                                    LIVE
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                    {timer.userName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{timer.userName}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Since {new Date(timer.startTime || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Project</div>
                                    <div className="text-sm font-medium text-slate-900 truncate">{timer.projectName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Task</div>
                                    <div className="text-sm text-slate-700">{timer.taskCategory}</div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                <div className="text-xl font-mono font-bold text-blue-600">
                                    {Math.floor(timer.durationMinutes / 60)}h {timer.durationMinutes % 60}m
                                </div>
                                <button className="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg font-medium border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-1">
                                    <PauseCircle className="w-3.5 h-3.5" /> Force Stop
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <MonitorPlay className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-600">No Active Timers</h3>
                    <p className="text-sm mt-1">Everyone is currently offline or idle.</p>
                </div>
            )}
        </div>
    );
};

export default LiveTrackingTab;
