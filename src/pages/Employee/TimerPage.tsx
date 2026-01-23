
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import Auth
import { mockBackend } from '../../services/mockBackend';
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

    // Load Projects and Check for Active Timer on Mount
    useEffect(() => {
        // Load Projects
        setProjects(mockBackend.getProjects());
        setCategories(mockBackend.getTaskCategories()); // Fetch Categories

        // Check for active timer for this user
        if (user) {
            const activeTimer = mockBackend.getActiveTimer(user.id);
            if (activeTimer) {
                // @ts-ignore
                const status = activeTimer.status;
                const totalSeconds = (activeTimer as any).accumulatedSeconds || (activeTimer.durationMinutes * 60);

                if (status === 'PAUSED') {
                    setIsRunning(false);
                    setIsPaused(true);
                    setElapsedSeconds(totalSeconds);
                    accumulatedRef.current = totalSeconds;
                } else {
                    setIsRunning(true);
                    setIsPaused(false);

                    // Set Refs for interval
                    if (activeTimer.startTime) {
                        startTimeRef.current = new Date(activeTimer.startTime).getTime();
                        accumulatedRef.current = totalSeconds; // Base accumulated before current run

                        // Initial sync
                        const now = Date.now();
                        const currentRunSeconds = Math.floor((now - startTimeRef.current) / 1000);
                        setElapsedSeconds(totalSeconds + currentRunSeconds);
                    }
                }

                setSelectedProject(activeTimer.projectId);
                setSelectedCategory(activeTimer.categoryId);
                setNotes(activeTimer.description || '');
            }
        }
    }, [user]);

    // Calculate daily stats - Moved to top level
    const dailyEntries = useMemo(() => {
        if (!user) return [];
        const todayStr = new Date().toISOString().split('T')[0];
        const allEntries = mockBackend.getEntries(user.id);
        return allEntries.filter(e => e.date === todayStr);
    }, [user, isRunning]);


    // Initialize from location state
    useEffect(() => {
        if (!isRunning && !isPaused && location.state && location.state.projectId) {
            setSelectedProject(location.state.projectId);
        }
    }, [location.state, isRunning, isPaused]);

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
            // @ts-ignore
            const timer = mockBackend.resumeTimer(user.id);
            if (timer && timer.startTime) {
                // Update Refs
                startTimeRef.current = new Date(timer.startTime).getTime();
                // accumulated is already set from pause state, but safe to refresh from backend return if needed
                // accumulatedRef.current = timer.accumulatedSeconds... (mockBackend resume doesn't return accumulated explicitly unless we modify it, but it should be consistent)
            }

            setIsPaused(false);
            setIsRunning(true);
        } else {
            // NEW START
            // Backend Call
            const timer = mockBackend.startTimer(user.id, user.name, selectedProject, selectedCategory);

            // Set Refs
            startTimeRef.current = new Date(timer.startTime!).getTime(); // Using ! as startTimer always sets it
            accumulatedRef.current = 0;

            setIsRunning(true);
            setElapsedSeconds(0);
        }
    };

    const handlePause = () => {
        if (!user) return;
        // @ts-ignore
        mockBackend.pauseTimer(user.id);
        setIsRunning(false);
        setIsPaused(true);
    };

    const handleStopRequest = () => {
        // Just UI update to show modal
        setShowStopModal(true);
    };

    const handleConfirmStop = () => {
        if (!user) return;

        // Backend Call
        mockBackend.stopTimer(user.id, notes);

        setIsRunning(false);
        setIsPaused(false); // Reset pause state
        setElapsedSeconds(0);
        setNotes('');
        setShowStopModal(false);
    };

    // ID to Name helper
    const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || id;

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
                            task={selectedCategory || undefined}
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
                                readOnly={false}
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

                    {/* Quick Start Chips */}
                    {!isRunning && (
                        <QuickStartCard
                            recents={dailyEntries.slice(0, 3).map(e => {
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
