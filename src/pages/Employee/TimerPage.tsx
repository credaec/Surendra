import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Added useLocation
import TimerHeader from '../../components/employee/timer/TimerHeader';
import LiveTimerCard from '../../components/employee/timer/LiveTimerCard';
import TimerForm from '../../components/employee/timer/TimerForm';
import ProofUploadCard from '../../components/employee/timer/ProofUploadCard';
import QuickStartCard from '../../components/employee/timer/QuickStartCard';
import TodaySummaryCard from '../../components/employee/timer/TodaySummaryCard';
import RecentHistoryCard from '../../components/employee/timer/RecentHistoryCard';
import StopTimerModal from '../../components/employee/timer/StopTimerModal';
import ProofPendingCard from '../../components/employee/timer/ProofPendingCard';
// ... items

const TimerPage: React.FC = () => {
    const location = useLocation(); // Hook

    // 1. Timer State
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<number | null>(null);

    // 2. Form State
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [hasProofFile, setHasProofFile] = useState(false);

    // Initialize from location state if available
    useEffect(() => {
        if (location.state && location.state.projectId) {
            // Map ID to Name (Mock Logic since we don't have full project list here easily available)
            // In a real app we would select by ID. For now we mock-select the name if ID matches.
            const pId = location.state.projectId;
            if (pId === 'p1') setSelectedProject('BCS Skylights');
            else if (pId === 'p2') setSelectedProject('Dr. Wade Residence');
            else if (pId === 'p4') setSelectedProject('City Mall Expansion');
        }
    }, [location.state]);

    // 3. UI State
    const [showStopModal, setShowStopModal] = useState(false);

    // 4. Timer Logic
    useEffect(() => {
        if (isRunning) {
            // @ts-ignore
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
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
        if (!selectedProject || !selectedCategory) {
            alert("Please select a project and category first.");
            return;
        }
        setIsRunning(true);
    };

    const handlePause = () => setIsRunning(false);

    const handleStopRequest = () => {
        setIsRunning(false);
        setShowStopModal(true);
    };

    const handleConfirmStop = () => {
        setElapsedSeconds(0);
        setNotes('');
        setHasProofFile(false);
        setShowStopModal(false);
        // Save logic here
    };

    // Helper to check if category needs proof (Hardcoded logic for now based on mock ID)
    const isProofRequired = selectedCategory === 'c2'; // "Drafting" in mock data requires proof

    return (
        <div className="max-w-[1600px] mx-auto pb-12">

            {/* Header */}
            <TimerHeader />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left Column (Main Control) - 7 Cols */}
                <div className="xl:col-span-7 space-y-6">

                    {/* Live Timer */}
                    <LiveTimerCard
                        isRunning={isRunning}
                        elapsedSeconds={elapsedSeconds}
                        project={selectedProject ? "BCS Skylights" : undefined} // Mock name lookup
                        task={selectedCategory ? "Engineering" : undefined} // Mock name lookup
                        onStart={handleStart}
                        onPause={handlePause}
                        onStop={handleStopRequest}
                        disabled={!selectedProject || !selectedCategory}
                    />

                    {/* Work Details Form */}
                    <TimerForm
                        selectedProject={selectedProject}
                        selectedCategory={selectedCategory}
                        notes={notes}
                        onProjectChange={setSelectedProject}
                        onCategoryChange={setSelectedCategory}
                        onNotesChange={setNotes}
                        readOnly={isRunning}
                    />

                    {/* Proof Upload (Conditional) */}
                    <ProofUploadCard
                        isRequired={isProofRequired}
                        hasFile={hasProofFile}
                        onUpload={() => setHasProofFile(true)}
                        onRemove={() => setHasProofFile(false)}
                    />

                    {/* Quick Start Chips */}
                    {!isRunning && <QuickStartCard />}

                </div>

                {/* Right Column (Summary & History) - 5 Cols */}
                <div className="xl:col-span-5 space-y-6">
                    <TodaySummaryCard />
                    <ProofPendingCard /> {/* Pending Alerts */}
                    <RecentHistoryCard />
                </div>

            </div>

            {/* Modals */}
            <StopTimerModal
                isOpen={showStopModal}
                onClose={() => setShowStopModal(false)}
                onConfirm={handleConfirmStop}
                isProofMissing={isProofRequired && !hasProofFile}
            />

        </div>
    );
};

export default TimerPage;
