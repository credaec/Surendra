import React from 'react';
import { Pause, Square, FileText } from 'lucide-react';

// Mock active timer data (would come from context/store)
interface TimerBannerProps {
    isActive: boolean;
    startTime?: string;
    project?: string;
    task?: string;
    onPause: () => void;
    onStop: () => void;
}

const TimerBanner: React.FC<TimerBannerProps> = ({
    isActive,
    startTime, // Expecting ISO string or similar real start time
    project = "Unknown Project",
    task = "Unknown Task",
    onPause,
    onStop
}) => {
    const [elapsed, setElapsed] = React.useState(0);

    React.useEffect(() => {
        if (!isActive || !startTime) return;

        // Calculate initial elapsed
        const start = new Date(startTime).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - start) / 1000));

        const interval = setInterval(() => {
            const currentNow = Date.now();
            setElapsed(Math.floor((currentNow - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, startTime]);

    // Format
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isActive) return null;

    return (
        <div className="sticky top-0 z-10 w-full bg-slate-900 border-b border-white/10 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

                {/* Left: Time & Info */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xl font-mono font-bold text-white tracking-wider">{formatTime(elapsed)}</span>
                    </div>

                    <div className="h-5 w-px bg-white/20" />

                    <div className="flex items-center text-sm">
                        <span className="font-semibold text-white mr-2">{project}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-300 ml-2">{task}</span>
                    </div>

                    <button className="text-slate-400 hover:text-white transition-colors">
                        <FileText className="h-4 w-4" />
                    </button>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onPause}
                        className="px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-medium border border-amber-500/30 transition-colors flex items-center"
                    >
                        <Pause className="h-3 w-3 mr-1.5" /> Pause
                    </button>
                    <button
                        onClick={onStop}
                        className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium border border-red-500/30 transition-colors flex items-center"
                    >
                        <Square className="h-3 w-3 mr-1.5 fill-current" /> Stop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimerBanner;
