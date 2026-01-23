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
import { mockBackend } from '../../services/mockBackend';
import { useLocation } from 'react-router-dom';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

const TimesheetPage: React.FC = () => {
    const { user } = useAuth();

    // 1. Data State
    const [status, setStatus] = useState<TimesheetStatus>('DRAFT');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);

    const location = useLocation();

    // 2. Load User Data
    useEffect(() => {
        if (user) {
            const userEntries = mockBackend.getEntries(user.id);
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
            const dayEntries = entries.filter(e => e.date === dateStr);

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
        const dayEntries = entries.filter(e => e.date === selectedDate);
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
                project: mockBackend.getProjectById(e.projectId)?.name || 'Unknown Project',
                category: e.categoryId,
                notes: e.description,
                isBillable: e.isBillable,
                status: e.status
            };
        });
    }, [entries, selectedDate]);

    // 5. Logic
    const isLocked = status === 'SUBMITTED' || status === 'APPROVED' || status === 'LOCKED';

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
            const p = mockBackend.getProjectById(pid);
            return p ? p.name : 'Unknown';
        });

        // 2. Submit to Backend
        mockBackend.submitTimesheet({
            employeeId: user.id,
            employeeName: user.name,
            avatarInitials: user.avatarInitials,
            weekRange: weekRangeLabel,
            totalHours,
            billableHours,
            nonBillableHours,
            projectCount: uniqueProjectIds.length,
            projects: projectNames,
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
        setIsAddEntryModalOpen(true);
    };

    const refreshData = () => {
        if (user) {
            const userEntries = mockBackend.getEntries(user.id);
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-semibold text-slate-900 flex items-center">
                                    <span className="text-2xl mr-2 font-bold text-blue-600">{dayNumber}</span>
                                    <span>{dayName}</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {currentDayEntries.length} entries • {currentDayStat?.totalHours.toFixed(1)}h total
                                </p>
                            </div>

                            {!isLocked && (
                                <button
                                    onClick={handleAddEntry}
                                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
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
                                    totalHours={entries.filter(e => e.date === selectedDate).reduce((acc, curr) => acc + curr.durationMinutes / 60, 0)}
                                    // Todo: Implement these handlers
                                    onEdit={(id) => console.log('Edit', id)}
                                    onDelete={(id) => {
                                        mockBackend.deleteEntry(id);
                                        refreshData();
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
                        errors={getValidationErrors()}
                        warnings={[]}
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
            />
        </div>
    );
};

export default TimesheetPage;
