import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
import { format, parseISO } from 'date-fns';

import TimeEntryEditModal from './TimeEntryEditModal';

interface TimeLogsTabProps {
    filterEmployeeId: string;
    filterProjectId: string;
    filterClientId: string;
    filterStatus: string;
}

const TimeLogsTab: React.FC<TimeLogsTabProps> = ({
    filterEmployeeId,
    filterProjectId,
    filterClientId,
    filterStatus
}) => {
    const [logs, setLogs] = useState<any[]>([]); // Using any for UI friendly enriched object
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null); // Ideally import TimeEntry type
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadData = () => {
        let entries = mockBackend.getEntries();
        const users = mockBackend.getUsers();
        const projects = mockBackend.getProjects();

        // Apply Filters
        if (filterEmployeeId !== 'all') entries = entries.filter(e => e.userId === filterEmployeeId);
        if (filterProjectId !== 'all') entries = entries.filter(e => e.projectId === filterProjectId);
        if (filterClientId !== 'all') {
            const clientProjects = projects.filter(p => p.clientId === filterClientId).map(p => p.id);
            entries = entries.filter(e => clientProjects.includes(e.projectId));
        }
        if (filterStatus !== 'all') entries = entries.filter(e => e.status === filterStatus);

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
    }, [filterEmployeeId, filterProjectId, filterClientId, filterStatus]);

    const handleEdit = (entry: any) => {
        // We stored originalEntry in the enriched object
        setSelectedEntry(entry.originalEntry);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this time log?')) {
            mockBackend.deleteEntry(id);
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
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Project / Task</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Notes</th>
                        {/* <th className="px-6 py-4">Proof</th> Removed */}
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{log.employee}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{log.project}</div>
                                    <div className="text-xs text-slate-500">{log.task}</div>
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-slate-700">{log.duration}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-slate-500 group-hover:text-slate-700 cursor-pointer" title={log.notes}>
                                        <MessageSquare className="w-4 h-4 mr-1.5" />
                                        <span className="truncate max-w-[150px]">{log.notes || '-'}</span>
                                    </div>
                                </td>
                                {/* Proof column removed */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                        log.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                                            log.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                                'bg-gray-100 text-gray-800' // DRAFT
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(log)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
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
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
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
