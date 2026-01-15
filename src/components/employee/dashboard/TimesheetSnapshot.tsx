import React, { useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { mockBackend } from '../../../services/mockBackend';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO, isWithinInterval } from 'date-fns';

const TimesheetSnapshot: React.FC = () => {
    const { user } = useAuth();

    // Dynamic Data Calculation
    const { weekData, totalHours, weekRangeStr } = useMemo(() => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const end = endOfWeek(today, { weekStartsOn: 1 });

        const weekDays = eachDayOfInterval({ start, end });

        // Fetch entries
        const entries = user ? mockBackend.getEntries(user.id) : [];
        const weekEntries = entries.filter(e => isWithinInterval(parseISO(e.date), { start, end }));

        let total = 0;

        const data = weekDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEntries = weekEntries.filter(e => e.date === dateStr);
            const dayHours = dayEntries.reduce((acc, e) => acc + (e.durationMinutes / 60), 0);

            total += dayHours;

            // Check if any entry is billable
            const anyBillable = dayEntries.some(e => e.isBillable);

            return {
                date: dateStr,
                dayName: format(day, 'EEE'), // Mon, Tue...
                hours: dayHours,
                billable: anyBillable,
                isToday: isSameDay(day, today)
            };
        });

        // Format Range String
        const rangeStr = `${format(start, 'MMM dd')} – ${format(end, 'MMM dd')}`;

        return { weekData: data, totalHours: total, weekRangeStr: rangeStr };
    }, [user]);

    // Format hours for display (e.g. 8.5)
    const formatHours = (h: number) => {
        if (h === 0) return '-';
        return Number.isInteger(h) ? h : h.toFixed(1);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">This Week Timesheet</h3>
                    <p className="text-xs text-slate-500 mt-1">{weekRangeStr}</p>
                </div>
                <button
                    onClick={() => window.location.href = '/employee/timesheet'}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
                >
                    Submit Timesheet
                </button>
            </div>

            {/* Body: Weekly Grid Mini View */}
            <div className="p-5 flex-1">
                <div className="grid grid-cols-7 gap-2 h-full">
                    {weekData.map((day) => (
                        <div
                            key={day.date}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                                day.isToday
                                    ? "bg-blue-50/50 border-blue-200"
                                    : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200"
                            )}
                        >
                            <span className={cn("text-[10px] font-semibold uppercase mb-1", day.isToday ? "text-blue-600" : "text-slate-400")}>
                                {day.dayName}
                            </span>
                            <div className="flex items-baseline">
                                <span className={cn("text-lg font-bold", day.hours > 0 ? "text-slate-900" : "text-slate-300")}>
                                    {formatHours(day.hours)}
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
                    {formatHours(totalHours)}h <span className="text-slate-400 font-normal text-xs">Total</span>
                </div>
            </div>
        </div>
    );
};

export default TimesheetSnapshot;
