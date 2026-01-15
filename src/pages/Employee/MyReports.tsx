import React, { useState, useEffect, useMemo } from 'react';
import ReportsHeader from '../../components/employee/reports/ReportsHeader';
import ReportsFilterBar from '../../components/employee/reports/ReportsFilterBar';
import ReportsKPICards from '../../components/employee/reports/ReportsKPICards';
import ReportsCharts from '../../components/employee/reports/ReportsCharts';
import ReportsBreakdown from '../../components/employee/reports/ReportsBreakdown';
import ProofComplianceCard from '../../components/employee/reports/ProofComplianceCard';
import ReportsTable from '../../components/employee/reports/ReportsTable';
import { mockBackend } from '../../services/mockBackend';
import type { TimeEntry, Project } from '../../types/schema';
import { useAuth } from '../../context/AuthContext';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const MyReportsPage: React.FC = () => {
    const { user } = useAuth();

    // Filter State
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    const [dateRangeLabel, setDateRangeLabel] = useState('This Month');

    const [selectedProject, setSelectedProject] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedBillable, setSelectedBillable] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const [allEntries, setAllEntries] = useState<TimeEntry[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = () => {
            if (user) {
                const entries = mockBackend.getEntries(user.id);
                setAllEntries(entries);
            }
            const projs = mockBackend.getProjects();
            setProjects(projs);
            setLoading(false);
        };
        fetchData();
        // Poll for updates if needed, or just fetch once
    }, [user]);

    // Derived/Filtered Data
    const filteredEntries = useMemo(() => {
        return allEntries.filter(entry => {
            const entryDate = parseISO(entry.date);
            const start = startOfDay(parseISO(startDate));
            const end = endOfDay(parseISO(endDate));

            // Date Range
            const inDateRange = isWithinInterval(entryDate, { start, end });
            if (!inDateRange) return false;

            // Project
            if (selectedProject !== 'ALL' && entry.projectId !== selectedProject) return false;

            // Status
            if (selectedStatus !== 'ALL' && entry.status !== selectedStatus) return false;

            // Billable (Lookup project to get client)
            const project = projects.find(p => p.id === entry.projectId);
            const isBillable = project ? project.clientName !== 'Credence Internal' : true; // Default to billable if not found

            if (selectedBillable === 'BILLABLE' && !isBillable) return false;
            if (selectedBillable === 'NON_BILLABLE' && isBillable) return false;

            return true;
        });
    }, [allEntries, projects, startDate, endDate, selectedProject, selectedStatus, selectedBillable]);

    // Calculate Statistics
    const stats = useMemo(() => {
        let totalSeconds = 0;
        let billableSeconds = 0;
        let nonBillableSeconds = 0;

        filteredEntries.forEach(e => {
            totalSeconds += e.durationMinutes * 60;

            const project = projects.find(p => p.id === e.projectId);
            const isBillable = project ? project.clientName !== 'Credence Internal' : true;

            if (isBillable) billableSeconds += e.durationMinutes * 60;
            else nonBillableSeconds += e.durationMinutes * 60;
        });

        const totalHours = totalSeconds / 3600;
        const billableHours = billableSeconds / 3600;
        const nonBillableHours = nonBillableSeconds / 3600;
        const billablePercentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

        return {
            totalHours,
            billableHours,
            nonBillableHours,
            billablePercentage,
            productivity: 94 // Mock for now
        };
    }, [filteredEntries, projects]);

    // Enrich entries for ReportsTable
    const enrichedEntries = useMemo(() => {
        return filteredEntries.map(entry => {
            const project = projects.find(p => p.id === entry.projectId);
            return {
                ...entry,
                projectName: project?.name || 'Unknown Project',
                taskCategory: entry.categoryId,
                durationSeconds: entry.durationMinutes * 60
            };
        });
    }, [filteredEntries, projects]);

    // Chart Data Preparation
    const trendData = useMemo(() => {
        // Simple grouping by day for the selected range
        // For MVP, just show last 7 entries or map entries to days
        const dataMap = new Map<string, number>();
        filteredEntries.forEach(e => {
            const day = format(parseISO(e.date), 'EEE'); // Mon, Tue...
            dataMap.set(day, (dataMap.get(day) || 0) + ((e.durationMinutes * 60) / 3600));
        });

        // Ensure specific order if needed, or just return entries
        const result = Array.from(dataMap.entries()).map(([name, hours]) => ({ name, hours }));
        if (result.length === 0) return [{ name: 'No Data', hours: 0 }];
        return result;
    }, [filteredEntries]);

    const pieData = useMemo(() => [
        { name: 'Billable', value: stats.billableHours, color: '#10b981' },
        { name: 'Non-Billable', value: stats.nonBillableHours, color: '#94a3b8' },
    ], [stats]);


    const handleDateRangeChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        setDateRangeLabel(`${format(parseISO(start), 'MMM d')} - ${format(parseISO(end), 'MMM d, yyyy')}`);
    };

    // Error Boundary (Inline) - Keeping existing
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
            {loading && <div className="p-4 text-center">Loading reports...</div>}

            <ErrorBoundary name="Header">
                <ReportsHeader />
            </ErrorBoundary>

            <ErrorBoundary name="Filters">
                <ReportsFilterBar
                    dateRange={dateRangeLabel}
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={handleDateRangeChange}
                    projects={projects}
                    selectedProject={selectedProject}
                    onProjectChange={setSelectedProject}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedBillable={selectedBillable}
                    onBillableChange={setSelectedBillable}
                    onApply={() => { }} // Filters apply immediately for now
                    onReset={() => {
                        setSelectedProject('ALL');
                        setSelectedStatus('ALL');
                        setSelectedBillable('ALL');
                        setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
                        setEndDate(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
                        setDateRangeLabel('This Month');
                    }}
                />
            </ErrorBoundary>

            <ErrorBoundary name="KPIs">
                <ReportsKPICards stats={stats} />
            </ErrorBoundary>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Main Content (Charts & Breakdowns) - 8 Cols */}
                <div className="xl:col-span-8">
                    <ErrorBoundary name="Charts">
                        <ReportsCharts trendData={trendData} pieData={pieData} />
                    </ErrorBoundary>

                    <ErrorBoundary name="Breakdown">
                        <ReportsBreakdown entries={filteredEntries} />
                    </ErrorBoundary>

                    <ErrorBoundary name="Table">
                        <ReportsTable
                            entries={enrichedEntries}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </ErrorBoundary>
                </div>

                {/* Right Sidebar (Compliance & Summary) - 4 Cols */}
                <div className="xl:col-span-4">
                    <ErrorBoundary name="ProofCompliance">
                        <ProofComplianceCard entries={filteredEntries} />
                    </ErrorBoundary>
                </div>

            </div>

        </div>
    );
};

export default MyReportsPage;
