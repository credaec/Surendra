import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { backendService } from '../../../services/backendService';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { CalendarRange, Send, Clock3 } from 'lucide-react';

const TimesheetSnapshot: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Dynamic Data Calculation
    const { weekData, totalHours, weekRangeStr } = useMemo(() => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const end = endOfWeek(today, { weekStartsOn: 1 });

        const weekDays = eachDayOfInterval({ start, end });

        // Fetch entries
        const entries = user ? backendService.getEntries(user.id) : [];
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
        if (h === 0) return '—';
        return Number.isInteger(h) ? h : h.toFixed(1);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl">
                        <CalendarRange className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Timesheet Snapshot</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{weekRangeStr}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/employee/timesheet')}
                    className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                    <Send className="h-3.5 w-3.5 mr-2" /> Submit
                </button>
            </div>

            {/* Body: Weekly Grid Mini View */}
            <div className="p-6 flex-1">
                <div className="grid grid-cols-7 gap-3 h-full">
                    {weekData.map((day) => (
                        <div
                            key={day.date}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all relative group",
                                day.isToday
                                    ? "bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 ring-2 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                                    : "bg-slate-50/30 dark:bg-slate-950/30 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700"
                            )}
                        >
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest mb-2 transition-colors",
                                day.isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )}>
                                {day.dayName}
                            </span>
                            <div className="flex items-baseline">
                                <span className={cn(
                                    "text-xl font-black tracking-tighter transition-all",
                                    day.hours > 0
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-200 dark:text-slate-800 group-hover:text-slate-300 dark:group-hover:text-slate-700"
                                )}>
                                    {formatHours(day.hours)}
                                </span>
                            </div>
                            {day.billable && day.hours > 0 && (
                                <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" title="Contains Billable Hours" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <Clock3 className="h-3.5 w-3.5 mr-2 text-slate-300 dark:text-slate-700" />
                    Period Total
                </div>
                <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{formatHours(totalHours)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 italic">hrs</span>
                </div>
            </div>
        </div>
    );
};

export default TimesheetSnapshot;
