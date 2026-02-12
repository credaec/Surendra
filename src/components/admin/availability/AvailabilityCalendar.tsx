import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isToday,
    isSameDay,
    addMonths,
    subMonths,
    parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Palmtree, User, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { AvailabilityEvent } from '../../../types/schema';

interface AvailabilityCalendarProps {
    events: AvailabilityEvent[];
    onEventClick: (event: AvailabilityEvent) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ events, onEventClick }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const getDayEvents = (day: Date) => {
        return events.filter(e => {
            const start = parseISO(e.startDate);
            const end = parseISO(e.endDate);
            return isSameDay(day, start) || (day > start && day <= end);
        });
    };

    return (
        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-border rounded-[2.5rem] shadow-sm flex flex-col h-[750px] overflow-hidden transition-all duration-300">
            {/* Calendar Toolbar */}
            <div className="flex items-center justify-between p-8 border-b border-slate-200 dark:border-border bg-slate-50/50 dark:bg-background/20">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20">
                            <CalendarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                {format(currentMonth, 'MMMM')}
                            </h2>
                            <p className="text-sm font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">{format(currentMonth, 'yyyy')}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden lg:flex items-center space-x-6 mr-6 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center group cursor-help">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2 shadow-[0_0_10px_rgba(16,185,129,0.4)] group-hover:scale-125 transition-transform"></span>
                            <span className="text-slate-500 dark:text-slate-400">Holidays</span>
                        </div>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                        <div className="flex items-center group cursor-help">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400 mr-2 shadow-[0_0_10px_rgba(59,130,246,0.4)] group-hover:scale-125 transition-transform"></span>
                            <span className="text-slate-500 dark:text-slate-400">Leaves</span>
                        </div>
                    </div>

                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
                        <button onClick={prevMonth} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white active:scale-90">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={goToToday} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all mx-1 active:scale-95 border-x border-slate-100 dark:border-slate-800">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white active:scale-90">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-border bg-white dark:bg-surface shadow-sm relative z-10">
                {weekDays.map(day => (
                    <div key={day} className="py-6 text-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.25em]">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-100 dark:bg-background gap-px border-b border-l border-slate-200 dark:border-border">
                {calendarDays.map((day) => {
                    const dayEvents = getDayEvents(day);
                    const isOtherMonth = !isSameMonth(day, currentMonth);
                    const isCurrentDay = isToday(day);

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "relative p-4 flex flex-col transition-all duration-300 group/day overflow-hidden",
                                isOtherMonth ? "bg-slate-50/60 dark:bg-background/60" : "bg-white dark:bg-surface hover:bg-slate-50 dark:hover:bg-slate-800/20",
                            )}
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <span className={cn(
                                    "text-sm font-black w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300",
                                    isCurrentDay
                                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110"
                                        : "text-slate-400 dark:text-slate-500 group-hover/day:text-slate-900 dark:group-hover/day:text-white group-hover/day:bg-slate-100 dark:group-hover/day:bg-slate-800"
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {dayEvents.length > 0 && !isOtherMonth && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mt-3 mr-1 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                )}
                            </div>

                            <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar relative z-10">
                                {dayEvents.map(event => (
                                    <button
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick(event);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tight truncate flex items-center transition-all duration-200 active:scale-[0.98] border shadow-sm group/event",
                                            event.type === 'HOLIDAY'
                                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border-emerald-100 dark:border-emerald-500/20"
                                                : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 border-blue-100 dark:border-blue-500/20"
                                        )}
                                        title={event.title}
                                    >
                                        {event.type === 'HOLIDAY' ? (
                                            <Palmtree className="h-3 w-3 mr-2 flex-shrink-0 opacity-70 group-hover/event:opacity-100 transition-opacity" />
                                        ) : (
                                            <User className="h-3 w-3 mr-2 flex-shrink-0 opacity-70 group-hover/event:opacity-100 transition-opacity" />
                                        )}
                                        <span className="truncate">{event.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
