import React from 'react';
import { Palmtree, User, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
// import { cn } from '../../../lib/utils';
import type { AvailabilityEvent } from '../../../types/schema';

interface AvailabilityListProps {
    events: AvailabilityEvent[];
    onEdit: (event: AvailabilityEvent) => void;
    onDelete: (id: string) => void;
}

const AvailabilityList: React.FC<AvailabilityListProps> = ({ events, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 w-12">Type</th>
                        <th className="px-4 py-3">Event / Employee</th>
                        <th className="px-4 py-3">Dates</th>
                        <th className="px-4 py-3">Notes</th>
                        <th className="px-4 py-3">Created By</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                No events found for the selected period.
                            </td>
                        </tr>
                    ) : (
                        events.map((event) => (
                            <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                    {event.type === 'HOLIDAY' ? (
                                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg inline-flex" title="Holiday">
                                            <Palmtree className="h-4 w-4" />
                                        </div>
                                    ) : (
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg inline-flex" title="Employee Leave">
                                            <User className="h-4 w-4" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-slate-900">{event.title}</div>
                                    {event.subType && (
                                        <div className="text-xs text-slate-500 capitalize">{event.subType.toLowerCase().replace('_', ' ')}</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    {format(parseISO(event.startDate), 'MMM d, yyyy')}
                                    {event.startDate !== event.endDate && (
                                        <> - {format(parseISO(event.endDate), 'MMM d, yyyy')}</>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                                    {event.notes || '-'}
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs">
                                    {event.createdBy}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onEdit(event)}
                                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(event.id)}
                                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AvailabilityList;
