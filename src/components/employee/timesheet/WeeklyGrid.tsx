import React from 'react';
import { cn } from '../../../lib/utils';

export interface DayStats {
    date: string; // YYYY-MM-DD
    dayName: string; // Mon, Tue...
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    isToday?: boolean;
}

interface WeeklyGridProps {
    days: DayStats[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ days, selectedDate, onSelectDate }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="grid grid-cols-7 divide-x divide-slate-100">
                {days.map((day) => {
                    const isSelected = day.date === selectedDate;
                    const hasHours = day.totalHours > 0;

                    return (
                        <div
                            key={day.date}
                            onClick={() => onSelectDate(day.date)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 cursor-pointer transition-colors relative h-32 group",
                                isSelected ? "bg-blue-50/50" : "hover:bg-slate-50",
                                day.isToday && !isSelected && "bg-slate-50/30"
                            )}
                        >
                            {/* Top Accent for Selection */}
                            {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />}

                            {/* Date Header */}
                            <div className="text-center mb-2">
                                <div className={cn("text-[11px] font-bold uppercase mb-0.5", isSelected ? "text-blue-600" : "text-slate-400")}>{day.dayName}</div>
                                {day.isToday ? (
                                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto shadow-sm">
                                        {parseInt(day.date.split('-')[2])}
                                    </div>
                                ) : (
                                    <div className={cn("text-lg font-medium", isSelected ? "text-slate-900" : "text-slate-600")}>
                                        {parseInt(day.date.split('-')[2])}
                                    </div>
                                )}
                            </div>

                            {/* Hours Display */}
                            <div className="flex flex-col items-center">
                                <span className={cn(
                                    "text-xl font-bold font-mono tracking-tight",
                                    hasHours ? "text-slate-900" : "text-slate-300"
                                )}>
                                    {hasHours ? `${Number.isInteger(day.totalHours) ? day.totalHours : day.totalHours.toFixed(1)}h` : '-'}
                                </span>

                                {hasHours && (
                                    <div className="flex items-center space-x-1 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {day.billableHours > 0 && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" title={`Billable: ${day.billableHours}h`} />
                                        )}
                                        {day.nonBillableHours > 0 && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" title={`Non-Billable: ${day.nonBillableHours}h`} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyGrid;
