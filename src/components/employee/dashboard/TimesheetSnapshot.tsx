import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const TimesheetSnapshot: React.FC = () => {
    // Mock week data matching the spec
    const weekData = [
        { day: 'Mon', hours: 8.5, billable: true, isToday: false },
        { day: 'Tue', hours: 7.2, billable: true, isToday: false },
        { day: 'Wed', hours: 3.5, billable: true, isToday: true }, // Current day (partial)
        { day: 'Thu', hours: 0, billable: false, isToday: false },
        { day: 'Fri', hours: 0, billable: false, isToday: false },
        { day: 'Sat', hours: 0, billable: false, isToday: false },
        { day: 'Sun', hours: 0, billable: false, isToday: false },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">This Week Timesheet</h3>
                    <p className="text-xs text-slate-500 mt-1">Jan 13 – Jan 19</p>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all">
                    Submit Timesheet
                </button>
            </div>

            {/* Body: Weekly Grid Mini View */}
            <div className="p-5 flex-1">
                <div className="grid grid-cols-7 gap-2 h-full">
                    {weekData.map((day, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                                day.isToday
                                    ? "bg-blue-50/50 border-blue-200"
                                    : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200"
                            )}
                        >
                            <span className={cn("text-[10px] font-semibold uppercase mb-1", day.isToday ? "text-blue-600" : "text-slate-400")}>
                                {day.day}
                            </span>
                            <div className="flex items-baseline">
                                <span className={cn("text-lg font-bold", day.hours > 0 ? "text-slate-900" : "text-slate-300")}>
                                    {day.hours > 0 ? day.hours : '-'}
                                </span>
                            </div>
                            {day.billable && day.hours > 0 && (
                                <div className="h-1 w-1 rounded-full bg-emerald-500 mt-1" title="Contains Billable Hours" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mr-2" />
                    After submit, editing is locked.
                </div>
                <div className="text-sm font-bold text-slate-900">
                    19.2h <span className="text-slate-400 font-normal text-xs">Total</span>
                </div>
            </div>
        </div>
    );
};

export default TimesheetSnapshot;
