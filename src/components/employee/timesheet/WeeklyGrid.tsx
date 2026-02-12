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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 transition-all duration-300">
            <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
                {days.map((day) => {
                    const isSelected = day.date === selectedDate;
                    const hasHours = day.totalHours > 0;

                    return (
                        <div
                            key={day.date}
                            onClick={() => onSelectDate(day.date)}
                            className={cn(
                                "flex flex-col items-center justify-center p-5 cursor-pointer transition-all relative h-36 group",
                                isSelected ? "bg-blue-50/50 dark:bg-blue-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                day.isToday && !isSelected && "bg-slate-50/30 dark:bg-slate-800/30"
                            )}
                        >
                            {/* Top Accent for Selection */}
                            {isSelected && (
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600 dark:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-in fade-in slide-in-from-top-1" />
                            )}

                            {/* Date Header */}
                            <div className="text-center mb-3">
                                <div className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors",
                                    isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                )}>
                                    {day.dayName}
                                </div>
                                {day.isToday ? (
                                    <div className="h-8 w-8 rounded-xl bg-blue-600 dark:bg-blue-500 text-white text-sm font-black flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-transform">
                                        {parseInt(day.date.split('-')[2])}
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "text-xl font-black tracking-tighter transition-all",
                                        isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                                    )}>
                                        {parseInt(day.date.split('-')[2])}
                                    </div>
                                )}
                            </div>

                            {/* Hours Display */}
                            <div className="flex flex-col items-center">
                                <span className={cn(
                                    "text-2xl font-black tracking-tighter transition-all",
                                    hasHours
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-200 dark:text-slate-600 group-hover:text-slate-300 dark:group-hover:text-slate-500"
                                )}>
                                    {hasHours ? `${Number.isInteger(day.totalHours) ? day.totalHours : day.totalHours.toFixed(1)}h` : '—'}
                                </span>

                                {hasHours && (
                                    <div className="flex items-center space-x-1.5 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                        {day.billableHours > 0 && (
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" title={`Billable: ${day.billableHours}h`} />
                                        )}
                                        {day.nonBillableHours > 0 && (
                                            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" title={`Non-Billable: ${day.nonBillableHours}h`} />
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
