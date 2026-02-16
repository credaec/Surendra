
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import Auth
import { backendService } from '../../services/backendService';
import type { Project, TaskCategory } from '../../types/schema';
import TimerHeader from '../../components/employee/timer/TimerHeader';
import LiveTimerCard from '../../components/employee/timer/LiveTimerCard';
import TimerForm from '../../components/employee/timer/TimerForm';
import QuickStartCard from '../../components/employee/timer/QuickStartCard';
import TodaySummaryCard from '../../components/employee/timer/TodaySummaryCard';
import RecentHistoryCard from '../../components/employee/timer/RecentHistoryCard';
import StopTimerModal from '../../components/employee/timer/StopTimerModal';

const TimerPage: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth(); // Get current user

    // 1. Timer State (Linked to Backend)
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<number | null>(null);

    // Track start time refs for interval calculation without dependency loops
    const startTimeRef = useRef<number>(0);
    const accumulatedRef = useRef<number>(0);

    // 2. Form State
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<TaskCategory[]>([]); // New State
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [notes, setNotes] = useState('');

    // Load Projects and Initialize Timer State (Single Effect)
    useEffect(() => {
        if (!user) return;

        // 1. Load Data
        setProjects(backendService.getProjects());
        setCategories(backendService.getTaskCategories());

        const state = location.state as { autoStart?: boolean; projectId?: string; categoryId?: string } | null;

        // 2. Check Intent vs Active Timer
        // Priority: Intent (new task) > Active Timer (existing state)

        if (state && state.autoStart && state.projectId && state.categoryId) {
            // === INTENT TO START NEW ===
            // 2a. Stop active if exists
            const activeTimer = backendService.getActiveTimer(user.id);
            if (activeTimer) {
                backendService.stopTimer(user.id, "Auto-stopped for new task");
            }

            // 2b. Start New
            // 2b. Start New
            const startNewTimer = async () => {
                const timer = await backendService.startTimer(user.id, user.name, state.projectId!, state.categoryId!);

                // 2c. Update UI State
                setSelectedProject(state.projectId!);
                setSelectedCategory(state.categoryId!);
                setNotes('');

                if (timer.startTime) {
                    startTimeRef.current = new Date(timer.startTime).getTime();
                    accumulatedRef.current = 0;
                    setIsRunning(true);
                    setIsPaused(false);
                    setElapsedSeconds(0);
                }

                // Clear intent to avoid loop
                window.history.replaceState({}, '');
            };
            startNewTimer();
        } else {
            // === NO INTENT (RESTORE STATE) ===
            const activeTimer = backendService.getActiveTimer(user.id);
            if (activeTimer) {
                // Restore Active Timer
                // @ts-ignore
                const status = activeTimer.status;
                // Fix: Only use accumulatedSeconds from storage (activityLogs or fallback)
                let storedAccumulated = 0;
                if (activeTimer.activityLogs) {
                    try {
                        const logs = JSON.parse(activeTimer.activityLogs);
                        storedAccumulated = logs.accumulatedSeconds || 0;
                    } catch (e) { }
                }
                // Fallback to legacy prop if not in logs
                storedAccumulated = storedAccumulated || (activeTimer as any).accumulatedSeconds || 0;

                if (status === 'PAUSED') {
                    setIsRunning(false);
                    setIsPaused(true);
                    // If paused, durationMinutes IS the total time, so fallback is safe/correct here if accumulated is missing
                    const totalSeconds = storedAccumulated || ((activeTimer.durationMinutes || 0) * 60);
                    setElapsedSeconds(totalSeconds);
                    accumulatedRef.current = totalSeconds;
                } else {
                    setIsRunning(true);
                    setIsPaused(false);

                    // Set Refs for interval
                    // Set Refs for interval
                    if (activeTimer.startTime) {
                        let start = new Date(activeTimer.startTime).getTime();
                        if (isNaN(start)) {
                            // Fallback if startTime is corrupted: assume started now
                            start = Date.now();
                        }

                        startTimeRef.current = start;
                        accumulatedRef.current = isNaN(Number(storedAccumulated)) ? 0 : Number(storedAccumulated);

                        // Initial sync
                        const now = Date.now();
                        const currentRunSeconds = Math.floor((now - startTimeRef.current) / 1000);
                        const total = accumulatedRef.current + currentRunSeconds;
                        setElapsedSeconds(isNaN(total) ? 0 : total);
                    }
                }

                setSelectedProject(activeTimer.projectId);
                setSelectedCategory(activeTimer.categoryId);
                setNotes(activeTimer.description || '');
            } else if (state) {
                // Has state but not autostart (unlikely but possible manual pre-fill)
                if (state.projectId) setSelectedProject(state.projectId);
                if (state.categoryId) setSelectedCategory(state.categoryId);
            }
        }
    }, [user, location.state]); // Re-run if location changes (new intent) or user loads

    // NEW: Poll for external state changes (Sync with Dashboard/other tabs)
    useEffect(() => {
        if (!user || isRunning) return; // If running locally, we trust our ref loop? 
        // actually if running, we might still want to check if it was stopped elsewhere.
        // But if we poll and it says stopped, we should stop local.

        const checkExternal = async () => {
            await backendService.refreshActiveTimer(user.id);
            const active = backendService.getActiveTimer(user.id);

            // If we think we are running/paused but backend says no active timer -> we should reset
            if (!active && (isRunning || isPaused)) {
                setIsRunning(false);
                setIsPaused(false);
                setElapsedSeconds(0);
                setNotes('');
            }

            // If we think we are stopped but backend says active -> we should restore (e.g. started on dashboard)
            if (active && !isRunning && !isPaused) {
                // Restore logic (similar to initial load) - simplified
                window.location.reload(); // Simplest way to re-trigger the initial load logic
            }
        };

        const interval = setInterval(checkExternal, 5000); // Check every 5s
        return () => clearInterval(interval);
    }, [user, isRunning, isPaused]);

    // Auto-save Notes (Debounced) to prevent data loss on crash/force stop
    useEffect(() => {
        if (!user || (!isRunning && !isPaused)) return;

        const handler = setTimeout(() => {
            backendService.updateActiveTimer(user.id, { description: notes });
        }, 1000); // Auto-save after 1 second of inactivity

        return () => clearTimeout(handler);
    }, [notes, user, isRunning, isPaused]);

    // Calculate daily stats
    const dailyEntries = useMemo(() => {
        if (!user) return [];
        const todayStr = new Date().toISOString().split('T')[0];
        const allEntries = backendService.getEntries(user.id);
        return allEntries.filter(e => e.date.split('T')[0] === todayStr);
    }, [user, isRunning]);

    // Recents (Last 3 unique project/category pairs from history)
    const recentEntries = useMemo(() => {
        if (!user) return [];
        const all = backendService.getEntries(user.id);
        const unique = new Map<string, any>();

        // Iterate creating keys "projectId-categoryId"
        // Since getEntries usually returns sorted or we can sort by date desc
        // Assuming all is roughly chronological, we reverse or sort first
        // If getEntries is not guaranteed sorted, we should sort:
        const sorted = [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        for (const entry of sorted) {
            const key = `${entry.projectId}-${entry.categoryId}`;
            if (!unique.has(key)) {
                unique.set(key, entry);
            }
            if (unique.size >= 3) break;
        }
        return Array.from(unique.values());
    }, [user, isRunning]);

    // 3. UI State
    const [showStopModal, setShowStopModal] = useState(false);

    // 4. Timer Interval Logic (Robust Delta Calculation)
    useEffect(() => {
        if (isRunning) {
            // Clear existing if any
            if (timerRef.current) clearInterval(timerRef.current);

            // @ts-ignore
            timerRef.current = setInterval(() => {
                const now = Date.now();
                // Calc difference
                const delta = Math.floor((now - startTimeRef.current) / 1000);
                // Total = accumulated + current session delta
                // Ensure non-negative
                const total = Math.max(0, accumulatedRef.current + delta);
                setElapsedSeconds(total);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    // 5. Actions
    const handleStart = () => {
        if (!user) return;
        if (!selectedProject || !selectedCategory) {
            alert("Please select a project and category first.");
            return;
        }

        if (isPaused) {
            // RESUME
            const resumeFn = async () => {
                try {
                    // @ts-ignore
                    const timer = await backendService.resumeTimer(user.id);

                    if (timer && timer.startTime) {
                        // Update Refs
                        let start = new Date(timer.startTime).getTime();
                        if (isNaN(start)) start = Date.now();

                        startTimeRef.current = start;

                        let acc = 0;
                        if (timer.activityLogs) {
                            try {
                                const logs = typeof timer.activityLogs === 'string' ? JSON.parse(timer.activityLogs) : timer.activityLogs;
                                acc = logs.accumulatedSeconds || 0;
                            } catch (e) { }
                        }
                        accumulatedRef.current = acc || (timer as any).accumulatedSeconds || 0;

                        setIsPaused(false);
                        setIsRunning(true);
                        setElapsedSeconds(accumulatedRef.current);
                    }
                } catch (e) { console.error(e); alert("Resume failed"); }
            };
            resumeFn();
        } else {
            // NEW START
            const startFn = async () => {
                try {
                    // Backend Call
                    const timer = await backendService.startTimer(user.id, user.name, selectedProject, selectedCategory);

                    if (timer.startTime) {
                        // Set Refs
                        startTimeRef.current = new Date(timer.startTime).getTime();
                        accumulatedRef.current = 0;

                        setIsRunning(true);
                        setElapsedSeconds(0);
                    }
                } catch (e: any) {
                    console.error(e);
                    alert(`Start failed: ${e.message || 'Unknown error'}`);
                }
            };
            startFn();
        }
    };

    const handlePause = () => {
        if (!user) return;
        // @ts-ignore
        backendService.pauseTimer(user.id);
        setIsRunning(false);
        setIsPaused(true);
    };

    const handleStopRequest = () => {
        // Just UI update to show modal
        setShowStopModal(true);
    };

    const handleConfirmStop = async () => {
        if (!user) return;

        try {
            // Backend Call
            await backendService.stopTimer(user.id, notes);

            setIsRunning(false);
            setIsPaused(false); // Reset pause state
            setElapsedSeconds(0);
            setNotes('');
            setShowStopModal(false);
        } catch (error: any) {
            console.error("Stop failed:", error);
            alert(`Stop failed: ${error.message || 'Unknown error'}`);
        }
    };

    // ID to Name helper
    const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || id;
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

    return (
        <div className="max-w-[1600px] mx-auto pb-12">

            {/* Header */}
            <TimerHeader />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left Column (Main Control) - 7 Cols */}
                <div className="xl:col-span-7 space-y-6">

                    {/* Live Timer OR Resume View */}
                    {(isRunning || isPaused) ? (
                        <LiveTimerCard
                            isRunning={isRunning}
                            isPaused={isPaused} // Assume we add this prop or just use styling
                            elapsedSeconds={elapsedSeconds}
                            project={selectedProject ? getProjectName(selectedProject) : undefined}
                            task={selectedCategory ? getCategoryName(selectedCategory) : undefined}
                            onStart={handleStart}
                            onPause={handlePause}
                            onStop={handleStopRequest}
                            disabled={false}
                        />
                    ) : (
                        <div className="space-y-4">
                            <TimerForm
                                projects={projects}
                                categories={categories}
                                selectedProject={selectedProject}
                                selectedCategory={selectedCategory}
                                notes={notes}
                                onProjectChange={setSelectedProject}
                                onCategoryChange={setSelectedCategory}
                                onNotesChange={setNotes}
                                // Restrictions:
                                // 1. Employees cannot change Project manually (must use assigned card logic)
                                readOnlyProject={user?.role === 'EMPLOYEE'}
                                // 2. Employees cannot change Category IF it was enforced by the assignment (passed in state)
                                // If they clicked a whole project (no category in state), they CAN select category.
                                readOnlyCategory={user?.role === 'EMPLOYEE' && !!(location.state as any)?.categoryId}
                            />
                            <button
                                onClick={handleStart}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-lg"
                            >
                                <Play className="h-5 w-5 fill-current" />
                                Start Timer
                            </button>
                        </div>
                    )}

                    {!isRunning && !isPaused && recentEntries.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Last Active Session</p>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">
                                    {projects.find(p => p.id === recentEntries[0].projectId)?.name || 'Unknown'} <span className="text-slate-400">•</span> {getCategoryName(recentEntries[0].categoryId)}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedProject(recentEntries[0].projectId);
                                    setSelectedCategory(recentEntries[0].categoryId);
                                    setTimeout(handleStart, 100);
                                }}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-current" /> Resume
                            </button>
                        </div>
                    )}

                    {/* Quick Start Chips */}
                    {!isRunning && (
                        <QuickStartCard
                            recents={recentEntries.map(e => {
                                const proj = projects.find(p => p.id === e.projectId);
                                const cat = categories.find(c => c.id === e.categoryId);
                                return {
                                    id: e.id,
                                    project: proj ? proj.name : 'Unknown',
                                    category: cat ? cat.name : e.categoryId,
                                    projectId: e.projectId
                                };
                            })}
                            onQuickStart={(pid, cat) => {
                                setSelectedProject(pid);
                                setSelectedCategory(cat);
                                handleStart();
                            }}
                        />
                    )}

                </div>

                {/* Right Column (Summary & History) - 5 Cols */}
                <div className="xl:col-span-5 space-y-6">
                    <TodaySummaryCard
                        dailyTotal={dailyEntries.reduce((acc, curr) => acc + curr.durationMinutes, 0)}
                        billable={dailyEntries.filter(e => e.isBillable).reduce((acc, curr) => acc + curr.durationMinutes, 0)}
                        nonBillable={dailyEntries.filter(e => !e.isBillable).reduce((acc, curr) => acc + curr.durationMinutes, 0)}
                        startOfDay={dailyEntries.filter(e => e.startTime).length > 0 ? dailyEntries.filter(e => e.startTime).reduce((min, e) => (e.startTime! < min ? e.startTime! : min), dailyEntries.find(e => e.startTime)?.startTime!) : undefined}
                    />
                    <RecentHistoryCard entries={dailyEntries.slice(0, 5)} />
                </div>

            </div>

            {/* Modals */}
            <StopTimerModal
                isOpen={showStopModal}
                onClose={() => setShowStopModal(false)}
                onConfirm={handleConfirmStop}
            // Removed isProofMissing prop
            />

        </div>
    );
};

export default TimerPage;

