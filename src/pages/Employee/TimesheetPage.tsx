import React, { useState } from 'react';
import TimesheetHeader from '../../components/employee/timesheet/TimesheetHeader';
import StatusBanner from '../../components/employee/timesheet/StatusBanner';
import type { TimesheetStatus } from '../../components/employee/timesheet/StatusBanner';
import WeeklyGrid from '../../components/employee/timesheet/WeeklyGrid';
import type { DayStats } from '../../components/employee/timesheet/WeeklyGrid';
import DailyEntriesTable from '../../components/employee/timesheet/DailyEntriesTable';
import type { TimeEntryRow } from '../../components/employee/timesheet/DailyEntriesTable';
import { WeeklySummaryCard, ProofPendingTimesheetCard, ValidationChecklist } from '../../components/employee/timesheet/TimesheetSidebar';
import SubmitModal from '../../components/employee/timesheet/SubmitModal';

const TimesheetPage: React.FC = () => {
    // 1. Data State (Mock)
    const [status, setStatus] = useState<TimesheetStatus>('DRAFT');
    const [selectedDate, setSelectedDate] = useState('2026-01-14');
    const [dateRange, setDateRange] = useState('Jan 13 – Jan 19');
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // Mock Weekly Data
    const weekStats: DayStats[] = [
        { date: '2026-01-13', dayName: 'Mon', totalHours: 8.5, billableHours: 8.5, nonBillableHours: 0 },
        { date: '2026-01-14', dayName: 'Tue', totalHours: 7.5, billableHours: 6.5, nonBillableHours: 1, isToday: true },
        { date: '2026-01-15', dayName: 'Wed', totalHours: 4.0, billableHours: 4.0, nonBillableHours: 0 },
        { date: '2026-01-16', dayName: 'Thu', totalHours: 0, billableHours: 0, nonBillableHours: 0 },
        { date: '2026-01-17', dayName: 'Fri', totalHours: 0, billableHours: 0, nonBillableHours: 0 },
        { date: '2026-01-18', dayName: 'Sat', totalHours: 0, billableHours: 0, nonBillableHours: 0 },
        { date: '2026-01-19', dayName: 'Sun', totalHours: 0, billableHours: 0, nonBillableHours: 0 },
    ];

    // Mock Entries Data (filtered by selected day in a real app)
    const mockEntries: TimeEntryRow[] = [
        { id: '1', startTime: '09:00 AM', endTime: '01:00 PM', duration: '4h 00m', project: 'BCS Skylights', category: 'Engineering', isBillable: true, hasProof: true, status: 'DRAFT' },
        { id: '2', startTime: '02:00 PM', endTime: '04:30 PM', duration: '2h 30m', project: 'Dr. Wade Residence', category: 'Drafting', notes: 'Revisions for living room', isBillable: true, hasProof: false, status: 'DRAFT' },
        { id: '3', startTime: '04:30 PM', endTime: '05:30 PM', duration: '1h 00m', project: 'Internal', category: 'Meeting', isBillable: false, hasProof: false, status: 'DRAFT' },
    ];

    // 2. Logic
    const isLocked = status === 'SUBMITTED' || status === 'APPROVED' || status === 'LOCKED';

    // Validation Simulation
    const getValidationErrors = () => {
        // Needs proper logic checking all entries
        // For demo, we check if specific mock entry is missing proof
        const missingProof = mockEntries.find(e => e.project === 'Dr. Wade Residence' && !e.hasProof);
        return missingProof ? [`Proof required for entry on ${selectedDate} (Dr. Wade Residence)`] : [];
    };

    const handleSubmit = () => {
        setIsSubmitModalOpen(true);
    };

    const confirmSubmit = () => {
        setStatus('SUBMITTED');
        setIsSubmitModalOpen(false);
    };

    // Safe date formatting
    const currentDayStat = weekStats.find(d => d.date === selectedDate);
    const dayName = currentDayStat?.dayName || 'Day';
    const dayNumber = selectedDate ? selectedDate.split('-')[2] : '??';
    const dateDisplay = `${dayName}, Jan ${dayNumber}`;

    console.log('TimesheetPage Rendered', { status, selectedDate });

    // Error Boundary Class (Inline for debugging)
    class ErrorBoundary extends React.Component<{ name: string, children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
        constructor(props: any) {
            super(props);
            this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error: Error) {
            return { hasError: true, error };
        }
        componentDidCatch(error: Error, errorInfo: any) {
            console.error(`Error in ${this.props.name}:`, error, errorInfo);
        }
        render() {
            if (this.state.hasError) {
                return (
                    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <strong>Error in {this.props.name}:</strong>
                        <pre className="mt-2 text-xs overflow-auto">{this.state.error?.message}</pre>
                    </div>
                );
            }
            return this.props.children;
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-12">

            <ErrorBoundary name="Header">
                <TimesheetHeader
                    dateRange={dateRange}
                    canSubmit={status === 'DRAFT'}
                    onSubmit={handleSubmit}
                    onAddEntry={() => alert("Add Entry Drawer")}
                    onPrevWeek={() => {
                        setDateRange('Jan 06 – Jan 12');
                        setSelectedDate('2026-01-07');
                    }}
                    onNextWeek={() => {
                        setDateRange('Jan 20 – Jan 26');
                        setSelectedDate('2026-01-21');
                    }}
                />
            </ErrorBoundary>

            <ErrorBoundary name="StatusBanner">
                <StatusBanner status={status} rejectionReason="Missing proof for Monday logs" />
            </ErrorBoundary>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left Column (Main Work Area) - 8 Cols */}
                <div className="xl:col-span-8">
                    <ErrorBoundary name="WeeklyGrid">
                        <WeeklyGrid
                            days={weekStats}
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary name="DailyEntriesTable">
                        <DailyEntriesTable
                            dateDisplay={dateDisplay}
                            totalHours={currentDayStat?.totalHours || 0}
                            entries={selectedDate === '2026-01-14' ? mockEntries : []}
                            isLocked={isLocked}
                            onEdit={(id) => console.log('Edit', id)}
                            onDelete={(id) => console.log('Delete', id)}
                            onView={(id) => console.log('View', id)}
                            onAdd={() => console.log('Add')}
                        />
                    </ErrorBoundary>
                </div>

                {/* Right Column (Controls) - 4 Cols */}
                <div className="xl:col-span-4 space-y-6">
                    <ErrorBoundary name="WeeklySummaryCard">
                        <WeeklySummaryCard />
                    </ErrorBoundary>

                    {status === 'DRAFT' && (
                        <ErrorBoundary name="ProofPendingTimesheetCard">
                            <ProofPendingTimesheetCard />
                        </ErrorBoundary>
                    )}

                    <ErrorBoundary name="ValidationChecklist">
                        <ValidationChecklist />
                    </ErrorBoundary>
                </div>

            </div>

            <ErrorBoundary name="SubmitModal">
                <SubmitModal
                    isOpen={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    onConfirm={confirmSubmit}
                    validationErrors={getValidationErrors()}
                />
            </ErrorBoundary>

        </div>
    );
};

export default TimesheetPage;
