// Adding backendService to imports to ensure restoreEntry is available if interface isn't updated in this file yet (via module augmentation or just usage)
import React, { useState, useEffect, useMemo } from 'react';
import AddEntryModal from '../../components/employee/timesheet/AddEntryModal';
import TimesheetHeader from '../../components/employee/timesheet/TimesheetHeader';
import StatusBanner from '../../components/employee/timesheet/StatusBanner';
import type { TimesheetStatus } from '../../components/employee/timesheet/StatusBanner';
import WeeklyGrid from '../../components/employee/timesheet/WeeklyGrid';
import type { DayStats } from '../../components/employee/timesheet/WeeklyGrid';
import DailyEntriesTable from '../../components/employee/timesheet/DailyEntriesTable';
import type { TimeEntryRow } from '../../components/employee/timesheet/DailyEntriesTable';
import { WeeklySummaryCard, ValidationChecklist } from '../../components/employee/timesheet/TimesheetSidebar';
import SubmitModal from '../../components/employee/timesheet/SubmitModal';
import { useAuth } from '../../context/AuthContext';
import { backendService } from '../../services/backendService';
import { useLocation } from 'react-router-dom';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

const TimesheetPage: React.FC = () => {
    const { user } = useAuth();

    // 1. Data State
    const [status, setStatus] = useState<TimesheetStatus>('DRAFT');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any>(null);
    const [entries, setEntries] = useState<any[]>([]);

    const location = useLocation();

    // 2. Load User Data
    useEffect(() => {
        if (user) {
            const userEntries = backendService.getEntries(user.id);
            setEntries(userEntries);
        }
    }, [user]);

    // Handle incoming navigation state for "Manual Entry" or specific date view
    useEffect(() => {
        if (location.state) {
            const state = location.state as any;
            if (state.openAddEntry) {
                console.log("Auto-opening Add Entry Modal");
                // setIsAddEntryModalOpen(true); 
            }
            if (state.date) {
                setSelectedDate(state.date);
            }
        }
    }, [location]);

    // 3. Calculate Week Stats
    const weekStart = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 }); // Monday start
    const weekStats: DayStats[] = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(weekStart, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            // Filter entries for this day
            // Filter entries for this day (handle ISO string or YYYY-MM-DD)
            const dayEntries = entries.filter(e => e.date.split('T')[0] === dateStr);

            const totalHours = dayEntries.reduce((sum, e) => sum + e.durationMinutes / 60, 0);
            const billableHours = dayEntries.filter(e => e.isBillable).reduce((sum, e) => sum + e.durationMinutes / 60, 0);

            return {
                date: dateStr,
                dayName: format(date, 'EEE'),
                totalHours,
                billableHours,
                nonBillableHours: totalHours - billableHours,
                isToday: isSameDay(date, new Date())
            };
        });
    }, [entries, selectedDate]); // Re-calc when entries or selected week changes

    // 4. Get Current Day Entries for Table
    const currentDayEntries: TimeEntryRow[] = useMemo(() => {
        const dayEntries = entries.filter(e => e.date.split('T')[0] === selectedDate);
        return dayEntries.map(e => {
            // Helper to format time
            const formatTime = (isoString?: string) => {
                if (!isoString) return '-';
                try {
                    return format(parseISO(isoString), 'hh:mm a');
                } catch (err) {
                    return '-';
                }
            };

            return {
                id: e.id,
                startTime: formatTime(e.startTime),
                endTime: formatTime(e.endTime),
                duration: `${Math.floor(e.durationMinutes / 60)}h ${e.durationMinutes % 60}m`,
                project: backendService.getProjectById(e.projectId)?.name || 'Unknown Project',
                category: e.categoryId,
                notes: e.description,
                isBillable: e.isBillable,
                status: e.status,
                activityLogs: e.activityLogs
            };
        });
    }, [entries, selectedDate]);

    // 5. Logic
    const isLocked = status === 'SUBMITTED' || status === 'APPROVED' || status === 'LOCKED';

    // Validation State
    const [overlapErrors, setOverlapErrors] = useState(0);
    const [isValidating, setIsValidating] = useState(false);

    const runValidation = () => {
        setIsValidating(true);
        // Simulate a brief check for UX
        setTimeout(() => {
            let overlaps = 0;
            // Check overlaps for the selected day
            const dayEntries = entries.filter(e => e.date.split('T')[0] === selectedDate);

            for (let i = 0; i < dayEntries.length; i++) {
                for (let j = i + 1; j < dayEntries.length; j++) {
                    const e1 = dayEntries[i];
                    const e2 = dayEntries[j];

                    if (e1.startTime && e2.startTime && e1.endTime && e2.endTime) {
                        const start1 = new Date(e1.startTime).getTime();
                        const end1 = new Date(e1.endTime).getTime();
                        const start2 = new Date(e2.startTime).getTime();
                        const end2 = new Date(e2.endTime).getTime();

                        if (start1 < end2 && start2 < end1) {
                            overlaps++;
                        }
                    }
                }
            }

            setOverlapErrors(overlaps);
            setIsValidating(false);
        }, 600);
    };

    const getValidationErrors = () => {
        // Simple validation: check if any billable entry on selected day is missing proof
        // Real app would check whole week
        return [];
    };

    const handleSubmit = () => {
        setIsSubmitModalOpen(true);
    };

    const confirmSubmit = () => {
        if (!user) return;

        // 1. Calculate Summary for the Week
        // weekStart is already defined in component scope
        const weekEnd = addDays(weekStart, 6);
        const startStr = format(weekStart, 'yyyy-MM-dd');
        const endStr = format(weekEnd, 'yyyy-MM-dd');

        // Filter entries for this week
        const weekEntries = entries.filter(e => e.date >= startStr && e.date <= endStr);

        // Stats
        const totalHours = weekEntries.reduce((sum, e) => sum + e.durationMinutes / 60, 0);
        const billableHours = weekEntries.filter(e => e.isBillable).reduce((sum, e) => sum + e.durationMinutes / 60, 0);
        const nonBillableHours = totalHours - billableHours;

        // Projects List
        const uniqueProjectIds = Array.from(new Set(weekEntries.map(e => e.projectId)));
        const projectNames = uniqueProjectIds.map(pid => {
            const p = backendService.getProjectById(pid);
            return p ? p.name : 'Unknown';
        });

        // 2. Submit to Backend
        backendService.submitTimesheet({
            employeeId: user.id,
            employeeName: user.name,
            avatarInitials: user.avatarInitials,
            weekRange: weekRangeLabel,
            totalHours,
            billableHours,
            nonBillableHours,
            projectCount: uniqueProjectIds.length,
            projects: projectNames,
            startDate: startStr,
            endDate: endStr,
            // remarks: '' 
        });

        setStatus('SUBMITTED');
        setIsSubmitModalOpen(false);
        alert('Timesheet submitted successfully for approval.');
    };

    const handlePrevWeek = () => {
        setSelectedDate(prev => format(addDays(parseISO(prev), -7), 'yyyy-MM-dd'));
    };

    const handleNextWeek = () => {
        setSelectedDate(prev => format(addDays(parseISO(prev), 7), 'yyyy-MM-dd'));
    };

    const handleAddEntry = () => {
        setEditingEntry(null); // Ensure clean state
        setIsAddEntryModalOpen(true);
    };

    const handleEditEntry = (id: string) => {
        const entry = entries.find(e => e.id === id);
        if (entry) {
            setEditingEntry(entry);
            setIsAddEntryModalOpen(true);
        }
    };

    const refreshData = () => {
        if (user) {
            const userEntries = backendService.getEntries(user.id);
            setEntries(userEntries);
        }
    };

    // Safe date formatting
    const currentDayStat = weekStats.find(d => d.date === selectedDate);
    const dayName = currentDayStat?.dayName || format(parseISO(selectedDate), 'EEE');
    const dayNumber = selectedDate.split('-')[2];

    const weekRangeLabel = `${format(weekStart, 'MMM d')} – ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`;

    return (
        <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500 pb-24">
            <TimesheetHeader
                weekRange={weekRangeLabel}
                canSubmit={status === 'DRAFT' && weekStats.reduce((acc, curr) => acc + curr.totalHours, 0) > 0}
                onSubmit={handleSubmit}
                onAddEntry={handleAddEntry}
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
            />

            {/* Status Banner */}
            <StatusBanner status={status} rejectionReason={undefined} />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Left: Main Grid & Table (3 cols) */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Weekly Calendar Grid */}
                    <WeeklyGrid
                        days={weekStats}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />

                    {/* Daily Entries */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px]">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                                    <span className="text-2xl mr-2 font-bold text-blue-600 dark:text-blue-500">{dayNumber}</span>
                                    <span>{dayName}</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {currentDayEntries.length} entries • {currentDayStat?.totalHours.toFixed(1)}h total
                                </p>
                            </div>

                            {!isLocked && (
                                <button
                                    onClick={handleAddEntry}
                                    className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                >
                                    + Add Entry
                                </button>
                            )}
                        </div>

                        <div className="p-0">
                            {currentDayEntries.length > 0 ? (
                                <DailyEntriesTable
                                    entries={currentDayEntries as any} // Cast to satisfy mismatched interface if any, ideally fix interface
                                    isLocked={isLocked}
                                    dateDisplay={new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    totalHours={entries.filter(e => e.date.split('T')[0] === selectedDate).reduce((acc, curr) => acc + curr.durationMinutes / 60, 0)}

                                    onEdit={handleEditEntry}
                                    onDelete={(id) => {
                                        // 1. Perform Soft Delete
                                        backendService.deleteEntry(id);
                                        refreshData();

                                        // 2. Show Undo Toast (Simple Custom Implementation)
                                        const undoContainer = document.createElement('div');
                                        undoContainer.id = `undo-${id}`;
                                        undoContainer.className = 'fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300';
                                        undoContainer.innerHTML = `
                                            <span class="text-sm font-medium">Entry deleted</span>
                                            <button id="btn-undo-${id}" class="text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors">UNDO</button>
                                        `;
                                        document.body.appendChild(undoContainer);

                                        // Add event listener
                                        const undoBtn = document.getElementById(`btn-undo-${id}`);
                                        if (undoBtn) {
                                            undoBtn.onclick = () => {
                                                backendService.restoreEntry(id);
                                                refreshData();
                                                undoContainer.remove();
                                            };
                                        }

                                        // Auto remove after 5 seconds
                                        setTimeout(() => {
                                            if (document.body.contains(undoContainer)) {
                                                undoContainer.remove();
                                            }
                                        }, 5000);
                                    }}
                                    onView={(id) => console.log('View', id)}
                                    onAdd={handleAddEntry}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p>No entries for {selectedDate}</p>
                                    {!isLocked && <p className="text-sm mt-2">Click "+ Add Entry" to log time.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar Widgets (1 col) */}
                <div className="space-y-6">
                    <WeeklySummaryCard
                        totalHours={weekStats.reduce((acc, curr) => acc + curr.totalHours, 0)}
                        billableHours={weekStats.reduce((acc, curr) => acc + curr.billableHours, 0)}
                        expectedHours={40} // Mock expected
                    />

                    <ValidationChecklist
                        hasEntries={currentDayEntries.length > 0}
                        overlapErrors={overlapErrors}
                        onRunValidation={runValidation}
                        isValidating={isValidating}
                    />

                    {!isLocked && (
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center group"
                            >
                                <span>Submit Timesheet</span>
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-3">
                                By submitting, you certify that these hours are accurate.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SubmitModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onConfirm={confirmSubmit}
                weekRange={weekRangeLabel}
                totalHours={weekStats.reduce((acc, curr) => acc + curr.totalHours, 0)}
                validationErrors={getValidationErrors()}
            />

            <AddEntryModal
                isOpen={isAddEntryModalOpen}
                onClose={() => setIsAddEntryModalOpen(false)}
                onSave={refreshData}
                selectedDate={selectedDate}
                editData={editingEntry}
            />
        </div>
    );
};

export default TimesheetPage;

