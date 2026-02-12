import React from 'react';
import { cn } from '../../../lib/utils';
import { DollarSign, FileText, Calendar, Trash2, Edit2, Plus } from 'lucide-react';

// Define interface for Entry
export interface TimeEntryRow {
    id: string;
    startTime: string;
    endTime?: string;
    duration: string;
    project: string;
    category: string;
    notes?: string;
    isBillable: boolean;
    status: string; // 'DRAFT' | 'SUBMITTED' | etc
    activityLogs?: string; // JSON String
}

interface DailyEntriesTableProps {
    dateDisplay: string; // "Tuesday, Jan 14"
    totalHours: number;
    entries: TimeEntryRow[];
    isLocked: boolean; // If true, hide add/edit/delete
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
    onAdd: () => void;
}

const DailyEntriesTable: React.FC<DailyEntriesTableProps> = ({
    dateDisplay,
    totalHours,
    entries,
    isLocked,
    onEdit,
    onDelete,
    onView,
    onAdd
}) => {
    // Simple state for viewing logs
    const [viewingLogs, setViewingLogs] = React.useState<string | null>(null);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            {/* Log Viewer Modal (Internal for simplicity) */}
            {viewingLogs && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setViewingLogs(null)} />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                            <h4 className="font-semibold text-slate-800">Activity Log</h4>
                            <button onClick={() => setViewingLogs(null)} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">Close</span>
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {(entries.find(e => e.id === viewingLogs) as any)?.activityLogs?.map((log: string, i: number) => (
                                <div key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                    {log}
                                </div>
                            )) || <p className="text-sm text-slate-500">No logs found.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                    Entries for {dateDisplay}
                </h3>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Total: <span className="font-bold text-slate-900 dark:text-white">{Number(totalHours).toFixed(2)}h</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3 font-medium">Time / Duration</th>
                            <th className="px-6 py-3 font-medium">Project / Task</th>
                            <th className="px-6 py-3 font-medium text-center">Attributes</th>
                            <th className="px-6 py-3 font-medium text-right">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No entries for this day.
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{entry.duration}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{entry.startTime} - {entry.endTime || 'Present'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{entry.project}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{entry.category}</div>
                                        {entry.notes && (
                                            <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 flex items-center line-clamp-1 max-w-[200px]" title={entry.notes}>
                                                <FileText className="h-3 w-3 mr-1" /> {entry.notes}
                                            </div>
                                        )}
                                        {/* Activity Log Hidden for Employees */}
                                        {/* {(entry as any).activityLogs && (entry as any).activityLogs.length > 0 && (
                                            <button
                                                onClick={() => setViewingLogs(entry.id)}
                                                className="mt-1.5 flex items-center text-[10px] font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                            >
                                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                View Activity Log
                                            </button>
                                        )} */}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            {entry.isBillable ? (
                                                <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100" title="Billable">
                                                    <DollarSign className="h-3 w-3 mr-0.5" /> BILLABLE
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200" title="Non-Billable">
                                                    Non-Billable
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
                                            entry.status === 'APPROVED' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30" :
                                                entry.status === 'SUBMITTED' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/30" :
                                                    "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                        )}>
                                            {entry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {!isLocked ? (
                                                <>
                                                    <button onClick={() => onEdit(entry.id)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => onDelete(entry.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => onView(entry.id)} className="text-xs font-medium text-blue-600 hover:underline">
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Inline Add Button */}
            {!isLocked && (
                <button
                    onClick={onAdd}
                    className="w-full py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-center"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Entry for this day
                </button>
            )}
        </div>
    );
};

export default DailyEntriesTable;
