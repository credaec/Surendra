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
import { ChevronLeft, ChevronRight, Palmtree, User } from 'lucide-react';
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
            // Simplified: Checking start date match for now. 
            // Better logic would be isWithinInterval, but start match is fine for single day events
            // For multi-day, we typically just show on start or span (span is harder in simple grid)
            // Let's stick to start date for simple visualization or simplistic range check
            const start = parseISO(e.startDate);
            const end = parseISO(e.endDate);
            return isSameDay(day, start) || (day > start && day <= end);
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[700px]">
            {/* Calendar Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-bold text-slate-900">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-white rounded-md transition-colors text-slate-500 hover:text-slate-900 shadow-sm">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={goToToday} className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-md transition-colors mx-1">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-white rounded-md transition-colors text-slate-500 hover:text-slate-900 shadow-sm">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        <span className="text-slate-600">Holidays</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-slate-600">Leaves</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {calendarDays.map((day) => {
                    const dayEvents = getDayEvents(day);
                    const isOtherMonth = !isSameMonth(day, currentMonth);
                    const isCurrentDay = isToday(day);

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "border-b border-r border-slate-100 p-2 min-h-[100px] flex flex-col transition-colors",
                                isOtherMonth ? "bg-slate-50/50 text-slate-400" : "bg-white",
                                // Remove bottom/right borders for last row/col if needed, but grid usually handles
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                    isCurrentDay ? "bg-blue-600 text-white" : "text-slate-700"
                                )}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {dayEvents.map(event => (
                                    <button
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick(event);
                                        }}
                                        className={cn(
                                            "w-full text-left px-2 py-1 rounded text-xs font-medium truncate flex items-center mb-0.5",
                                            event.type === 'HOLIDAY'
                                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                                                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100"
                                        )}
                                        title={event.title}
                                    >
                                        {event.type === 'HOLIDAY' ? (
                                            <Palmtree className="h-3 w-3 mr-1 flex-shrink-0" />
                                        ) : (
                                            <User className="h-3 w-3 mr-1 flex-shrink-0" />
                                        )}
                                        {event.title}
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
