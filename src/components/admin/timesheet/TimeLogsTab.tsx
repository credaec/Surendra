import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';

import TimeEntryEditModal from './TimeEntryEditModal';

interface TimeLogsTabProps {
    filterEmployeeId: string;
    filterProjectId: string;
    filterClientId: string;
    filterStatus: string;
    dateRange: string;
}

const TimeLogsTab: React.FC<TimeLogsTabProps> = ({
    filterEmployeeId,
    filterProjectId,
    filterClientId,
    filterStatus,
    dateRange
}) => {
    const [logs, setLogs] = useState<any[]>([]); // Using any for UI friendly enriched object
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null); // Ideally import TimeEntry type
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadData = () => {
        let entries = backendService.getEntries();
        const users = backendService.getUsers();
        const projects = backendService.getProjects();

        // Determine Date Range
        const now = new Date();
        let startCurrent, endCurrent;

        if (dateRange === 'this_month') {
            startCurrent = startOfMonth(now);
            endCurrent = endOfMonth(now);
        } else if (dateRange === 'last_month') {
            startCurrent = startOfMonth(subMonths(now, 1));
            endCurrent = endOfMonth(subMonths(now, 1));
        } else if (dateRange === 'last_week') {
            startCurrent = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
            endCurrent = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        } else {
            // Default: this_week
            startCurrent = startOfWeek(now, { weekStartsOn: 1 });
            endCurrent = endOfWeek(now, { weekStartsOn: 1 });
        }

        // Apply Filters
        if (filterEmployeeId !== 'all') entries = entries.filter(e => e.userId === filterEmployeeId);
        if (filterProjectId !== 'all') entries = entries.filter(e => e.projectId === filterProjectId);
        if (filterClientId !== 'all') {
            const clientProjects = projects.filter(p => p.clientId === filterClientId).map(p => p.id);
            entries = entries.filter(e => clientProjects.includes(e.projectId));
        }
        if (filterStatus !== 'all') entries = entries.filter(e => e.status === filterStatus);

        // Date Filter
        entries = entries.filter(e => {
            const entryDate = parseISO(e.date);
            return isWithinInterval(entryDate, { start: startCurrent, end: endCurrent });
        });

        const enrichedLogs = entries.map(entry => {
            const user = users.find(u => u.id === entry.userId);
            const project = projects.find(p => p.id === entry.projectId);

            const hours = Math.floor(entry.durationMinutes / 60);
            const minutes = entry.durationMinutes % 60;

            return {
                id: entry.id,
                date: format(parseISO(entry.date), 'MMM dd'),
                employee: user ? user.name : 'Unknown User',
                project: project ? project.name : 'Unknown Project',
                task: entry.categoryId, // Using categoryId as task/category name
                duration: `${hours}h ${minutes}m`,
                billable: entry.isBillable,
                proof: !!entry.proofUrl,
                status: entry.status,
                notes: entry.description || '',
                originalEntry: entry // Keep reference to original for easy editing
            };
        });

        // specific sort logic if needed
        enrichedLogs.sort((a, b) => new Date(b.originalEntry.date).getTime() - new Date(a.originalEntry.date).getTime());

        setLogs(enrichedLogs);
    };

    useEffect(() => {
        loadData();
    }, [filterEmployeeId, filterProjectId, filterClientId, filterStatus, dateRange]);

    const handleEdit = (entry: any) => {
        // We stored originalEntry in the enriched object
        setSelectedEntry(entry.originalEntry);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this time log?')) {
            backendService.deleteEntry(id);
            loadData(); // Refresh
        }
    };

    const handleSave = () => {
        loadData(); // Refresh list after edit
        setIsEditModalOpen(false);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Project / Task</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Notes</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.employee}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 dark:text-white">{log.project}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{log.task}</div>
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-slate-700 dark:text-slate-300">{log.duration}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 cursor-pointer transition-colors" title={log.notes}>
                                        <MessageSquare className="w-4 h-4 mr-1.5" />
                                        <span className="truncate max-w-[150px]">{log.notes || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                                        log.status === 'SUBMITTED' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                                            log.status === 'REJECTED' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400' :
                                                'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-400'
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(log)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No time logs found for this period.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Edit Modal */}
            {selectedEntry && (
                <TimeEntryEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    entry={selectedEntry}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default TimeLogsTab;

