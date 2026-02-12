import React from 'react';
import { Pause, Square, FileText, Activity, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Mock active timer data (would come from context/store)
interface TimerBannerProps {
    isActive: boolean;
    startTime?: string;
    accumulatedSeconds?: number;
    project?: string;
    task?: string;
    onPause: () => void;
    onStop: () => void;
}

const TimerBanner: React.FC<TimerBannerProps> = ({
    isActive,
    startTime, // Expecting ISO string or similar real start time
    accumulatedSeconds = 0, // New Prop
    project = "Unknown Project",
    task = "Unknown Task",
    onPause,
    onStop
}) => {
    const [elapsed, setElapsed] = React.useState(0);

    React.useEffect(() => {
        if (!isActive || !startTime) return;

        // Calculate initial elapsed (Delta + Accumulated)
        const start = new Date(startTime).getTime();

        const calcTime = () => {
            const now = Date.now();
            const delta = Math.floor((now - start) / 1000);
            return Math.max(0, delta + accumulatedSeconds);
        };

        setElapsed(calcTime());

        const interval = setInterval(() => {
            setElapsed(calcTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, startTime, accumulatedSeconds]);

    // Format
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isActive) return null;

    return (
        <div className="sticky top-0 z-50 w-full animate-in slide-in-from-top-4 duration-500">
            {/* Main Bar */}
            <div className="bg-slate-900 dark:bg-slate-950 border-b border-white/10 shadow-2xl relative overflow-hidden">
                {/* Background Pulse Effect */}
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />

                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between relative z-10">
                    {/* Left Section: Timer & Status */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center bg-white/5 px-5 py-2 rounded-2xl border border-white/10 group">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] mr-4" />
                            <span className="text-2xl font-black text-white tracking-[0.05em] font-mono group-hover:scale-105 transition-transform">
                                {formatTime(elapsed)}
                            </span>
                        </div>

                        <div className="h-8 w-px bg-white/10" />

                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <Activity className="h-3 w-3 text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Current Task</span>
                            </div>
                            <div className="flex items-center mt-0.5">
                                <span className="font-black text-white tracking-tight">{project}</span>
                                <span className="mx-2 text-white/20 font-black">•</span>
                                <span className="font-bold text-slate-400">{task}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Controls */}
                    <div className="flex items-center space-x-4">
                        <button
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all active:scale-95 group"
                            title="Add Note"
                        >
                            <FileText className="h-5 w-5 group-hover:rotate-6 transition-transform" />
                        </button>

                        <div className="flex items-center bg-white/5 p-1 rounded-[1.25rem] border border-white/10">
                            <button
                                onClick={onPause}
                                className="px-6 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-widest border border-amber-500/20 transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center group active:scale-95"
                            >
                                <Pause className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> Pause
                            </button>
                            <button
                                onClick={onStop}
                                className="ml-1 px-6 py-2.5 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-red-600 shadow-lg shadow-red-500/20 flex items-center group active:scale-95"
                            >
                                <Square className="h-3.5 w-3.5 mr-2 fill-current group-hover:rotate-12 transition-transform" /> Stop Tracking
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-30 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        </div>
    );
};

export default TimerBanner;
