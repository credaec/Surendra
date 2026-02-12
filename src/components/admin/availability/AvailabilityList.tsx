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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-5 py-4 w-16 text-[10px] uppercase tracking-widest">Type</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Event / Employee</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Dates</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Notes</th>
                            <th className="px-5 py-4 text-[10px] uppercase tracking-widest">Created By</th>
                            <th className="px-5 py-4 text-right text-[10px] uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                    No events found for the selected period.
                                </td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                                    <td className="px-5 py-4">
                                        {event.type === 'HOLIDAY' ? (
                                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl inline-flex shadow-inner" title="Holiday">
                                                <Palmtree className="h-4 w-4" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl inline-flex shadow-inner" title="Employee Leave">
                                                <User className="h-4 w-4" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.title}</div>
                                        {event.subType && (
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">{event.subType.toLowerCase().replace('_', ' ')}</div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">
                                        {format(parseISO(event.startDate), 'MMM d, yyyy')}
                                        {event.startDate !== event.endDate && (
                                            <span className="text-slate-400 dark:text-slate-600 mx-1"> - </span>
                                        )}
                                        {event.startDate !== event.endDate && (
                                            <>{format(parseISO(event.endDate), 'MMM d, yyyy')}</>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate font-medium">
                                        {event.notes || '-'}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold">
                                        {event.createdBy}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(event)}
                                                className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(event.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-90"
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
        </div>
    );
};

export default AvailabilityList;
