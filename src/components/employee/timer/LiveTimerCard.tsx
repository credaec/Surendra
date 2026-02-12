import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface LiveTimerCardProps {
    isRunning: boolean;
    isPaused?: boolean;
    elapsedSeconds: number;
    project?: string;
    task?: string;
    onStart: () => void;
    onPause: () => void;
    onStop: () => void;
    disabled?: boolean;
}

const LiveTimerCard: React.FC<LiveTimerCardProps> = ({
    isRunning,
    isPaused,
    elapsedSeconds,
    project,
    task,
    onStart,
    onPause,
    onStop,
    disabled
}) => {

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
            <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-800 dark:to-slate-900">

                {/* Status Badge */}
                <div className={cn(
                    "mb-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center border",
                    isRunning
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 animate-pulse"
                        : isPaused
                            ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600"
                )}>
                    <div className={cn("h-2 w-2 rounded-full mr-2", isRunning ? "bg-emerald-500" : isPaused ? "bg-amber-500" : "bg-slate-400")} />
                    {isRunning ? "Running" : isPaused ? "Paused" : "Not Started"}
                </div>

                {/* Timer Display */}
                <div className="text-7xl font-mono font-bold text-slate-900 dark:text-white tracking-wider font-variant-numeric tabular-nums mb-8">
                    {formatTime(elapsedSeconds)}
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-6">
                    {!isRunning ? (
                        // Start / Resume Button
                        <button
                            onClick={onStart}
                            disabled={disabled}
                            className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95",
                                disabled
                                    ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300"
                            )}
                        >
                            <Play className="h-7 w-7 ml-1" />
                        </button>
                    ) : (
                        // Pause Button
                        <button
                            onClick={onPause}
                            className="h-16 w-16 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200 transition-all active:scale-95"
                        >
                            <Pause className="h-7 w-7" />
                        </button>
                    )}

                    {/* Stop Button - Always visible if time > 0 */}
                    <button
                        onClick={onStop}
                        disabled={elapsedSeconds === 0}
                        className={cn(
                            "h-12 w-12 rounded-full border-2 flex items-center justify-center transition-colors",
                            elapsedSeconds === 0
                                ? "border-slate-100 text-slate-300 cursor-not-allowed"
                                : "border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        )}
                    >
                        <Square className="h-4 w-4 fill-current" />
                    </button>
                </div>

                {/* Timer Meta (Visible when running/paused) */}
                {(elapsedSeconds > 0 || isRunning) && (
                    <div className="mt-8 flex items-center text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-600">
                        <span className="font-semibold mr-2">{project || "Select Project"}</span>
                        <span className="text-slate-400 mx-2">•</span>
                        <span className="text-slate-600 dark:text-slate-300">{task || "Select Category"}</span>
                        <span className="ml-3 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800">BILLABLE</span>
                    </div>
                )}

                <p className="mt-6 text-xs text-slate-400">
                    Time will be saved automatically when you stop the timer.
                </p>
            </div>
        </div>
    );
};

export default LiveTimerCard;
