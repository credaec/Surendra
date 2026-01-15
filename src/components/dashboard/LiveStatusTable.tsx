
import React, { useState, useEffect } from 'react';
import { mockBackend } from '../../services/mockBackend';
import type { TimeEntry } from '../../types/schema';

interface ActiveTimer extends TimeEntry {
    userName: string;
    projectName: string;
    taskCategory: string;
    durationSeconds: number;
}

const LiveStatusTable: React.FC = () => {
    const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);

    useEffect(() => {
        const fetchTimers = () => {
            const entries = mockBackend.getAllActiveTimers();
            const users = mockBackend.getUsers();
            const projects = mockBackend.getProjects();

            const enriched = entries.map(entry => {
                const user = users.find(u => u.id === entry.userId);
                const project = projects.find(p => p.id === entry.projectId);

                return {
                    ...entry,
                    userName: user?.name || 'Unknown User',
                    projectName: project?.name || 'Unknown Project',
                    taskCategory: entry.categoryId, // Fallback to ID for now, or lookup category
                    durationSeconds: entry.durationMinutes * 60 // Mock conversion
                } as ActiveTimer;
            });
            setActiveTimers(enriched);
        };

        fetchTimers();

        // Poll every 5 seconds
        const interval = setInterval(fetchTimers, 5000);

        return () => clearInterval(interval);
    }, []);

    // Helper to format duration HH:MM:SS
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} `;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Live Team Status</h3>
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Current Tracking</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeTimers.length > 0 ? (
                            activeTimers.map((timer) => (
                                <tr key={timer.userId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900">{timer.userName}</td>
                                    <td className="px-4 py-3 text-slate-500">
                                        <div>
                                            <div className="text-slate-900 font-medium">{timer.projectName}</div>
                                            <div className="text-xs text-slate-400">{timer.taskCategory}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                                                RUNNING
                                            </span>
                                            <span className="text-xs font-mono font-medium text-slate-600">
                                                {formatDuration(timer.durationSeconds)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                                    No active timers.
                                </td>
                            </tr>
                        )}
                        {/* Mock Offline Users for completeness if needed, or just show active */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default LiveStatusTable;
