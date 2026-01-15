import React from 'react';
import { cn } from '../../../lib/utils';
import { Image as ImageIcon, DollarSign, FileText, Calendar, Trash2, Edit2, Plus } from 'lucide-react';

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
    hasProof: boolean;
    status: string; // 'DRAFT' | 'SUBMITTED' | etc
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
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold text-slate-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                    Entries for {dateDisplay}
                </h3>
                <div className="text-sm font-medium text-slate-700">
                    Total: <span className="font-bold text-slate-900">{totalHours}h</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Time / Duration</th>
                            <th className="px-6 py-3 font-medium">Project / Task</th>
                            <th className="px-6 py-3 font-medium text-center">Attributes</th>
                            <th className="px-6 py-3 font-medium text-right">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No entries for this day.
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{entry.duration}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{entry.startTime} - {entry.endTime || 'Present'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{entry.project}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{entry.category}</div>
                                        {entry.notes && (
                                            <div className="mt-1 text-xs text-slate-400 flex items-center line-clamp-1 max-w-[200px]" title={entry.notes}>
                                                <FileText className="h-3 w-3 mr-1" /> {entry.notes}
                                            </div>
                                        )}
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
                                            {entry.hasProof && (
                                                <div className="text-purple-500" title="Proof Attached">
                                                    <ImageIcon className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
                                            entry.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                entry.status === 'SUBMITTED' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                    "bg-slate-50 text-slate-600 border-slate-200"
                                        )}>
                                            {entry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    className="w-full py-3 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-50 border-t border-slate-100 transition-colors flex items-center justify-center"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Entry for this day
                </button>
            )}
        </div>
    );
};

export default DailyEntriesTable;
