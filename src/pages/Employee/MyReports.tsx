import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportsHeader from '../../components/employee/reports/ReportsHeader';
import ReportsFilterBar from '../../components/employee/reports/ReportsFilterBar';
import ReportsKPICards from '../../components/employee/reports/ReportsKPICards';
import ReportsCharts from '../../components/employee/reports/ReportsCharts';
import ReportsBreakdown from '../../components/employee/reports/ReportsBreakdown';
import ReportsTable from '../../components/employee/reports/ReportsTable';
import { backendService } from '../../services/backendService';
import type { TimeEntry, Project } from '../../types/schema';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, startOfDay, endOfDay, startOfWeek, addDays } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const MyReportsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Filter State
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    const [dateRangeLabel, setDateRangeLabel] = useState('This Month');

    const [selectedProject, setSelectedProject] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedBillable, setSelectedBillable] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [trendView, setTrendView] = useState<'day' | 'week'>('day');

    // Data State
    const [allEntries, setAllEntries] = useState<TimeEntry[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = () => {
            if (user) {
                const entries = backendService.getEntries(user.id);
                setAllEntries(entries);
            }
            const projs = backendService.getProjects();
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

            // Billable (Use entry flag as source of truth)
            const isBillable = entry.isBillable;

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

            if (e.isBillable) billableSeconds += e.durationMinutes * 60;
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
            productivity: Math.round(billablePercentage) // Dynamic based on billable ratio
        };
    }, [filteredEntries, projects]);

    // Enrich entries for ReportsTable
    const enrichedEntries = useMemo(() => {
        return filteredEntries.map(entry => {
            const project = projects.find(p => p.id === entry.projectId);
            return {
                ...entry,
                projectName: project?.name || 'Unknown Project',
                taskCategory: backendService.getTaskCategories().find(c => c.id === entry.categoryId)?.name || entry.categoryId,
                durationSeconds: entry.durationMinutes * 60
            };
        });
    }, [filteredEntries, projects]);

    // Chart Data Preparation
    const trendData = useMemo(() => {
        const dataMap = new Map<string, number>();
        const sorted = [...filteredEntries].sort((a, b) => a.date.localeCompare(b.date));

        sorted.forEach(e => {
            let key = e.date;
            if (trendView === 'week') {
                key = format(startOfWeek(parseISO(e.date), { weekStartsOn: 1 }), 'yyyy-MM-dd');
            }
            dataMap.set(key, (dataMap.get(key) || 0) + (e.durationMinutes / 60));
        });

        const result = Array.from(dataMap.entries()).map(([key, hours]) => {
            let name = key;
            if (trendView === 'day') {
                name = format(parseISO(key), 'MMM d');
            } else {
                const start = parseISO(key);
                const end = addDays(start, 6);
                name = `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
            }
            return { name, hours };
        });

        if (result.length === 0) return [{ name: 'No Data', hours: 0 }];
        return result;
    }, [filteredEntries, trendView]);

    const pieData = useMemo(() => [
        { name: 'Billable', value: stats.billableHours, color: '#10b981' },
        { name: 'Non-Billable', value: stats.nonBillableHours, color: '#94a3b8' },
    ], [stats]);


    const handleDateRangeChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        setDateRangeLabel(`${format(parseISO(start), 'MMM d')} - ${format(parseISO(end), 'MMM d, yyyy')}`);
    };

    const { showToast } = useToast();



    const handleExport = async (type: 'PDF' | 'EXCEL' | 'CSV') => {
        if (type === 'PDF') {
            showToast('Generating PDF...', 'info');
            try {
                const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();

                // 1. Header
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);
                doc.text('Employee Productivity Report', 14, 22);

                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Generated for: ${user?.name || 'Employee'}`, 14, 30);
                doc.text(`Date Range: ${dateRangeLabel}`, 14, 35);
                doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 40);

                // 2. KPI Summary
                doc.setDrawColor(200, 200, 200);
                doc.line(14, 45, pageWidth - 14, 45);

                let yPos = 55;
                const kpiX = [14, 70, 130];

                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text(`Total Hours: ${stats.totalHours.toFixed(1)}h`, kpiX[0], yPos);
                doc.text(`Billable: ${stats.billableHours.toFixed(1)}h (${Math.round(stats.billablePercentage)}%)`, kpiX[1], yPos);
                doc.text(`Productivity: ${stats.productivity}%`, kpiX[2], yPos);

                yPos += 15;

                // 3. Charts (Capture as Image)
                const chartsContainer = document.getElementById('report-charts-container');
                if (chartsContainer) {
                    try {
                        const canvas = await html2canvas(chartsContainer, { scale: 2 });
                        const imgData = canvas.toDataURL('image/png');
                        const imgProps = doc.getImageProperties(imgData);
                        const pdfWidth = pageWidth - 28;
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                        // Check for page break
                        if (yPos + pdfHeight > doc.internal.pageSize.getHeight() - 20) {
                            doc.addPage();
                            yPos = 20;
                        }

                        doc.addImage(imgData, 'PNG', 14, yPos, pdfWidth, pdfHeight);
                        yPos += pdfHeight + 10;
                    } catch (err) {
                        console.error("Chart capture failed", err);
                    }
                }

                // 4. Table
                const tableRows = filteredEntries.map(e => {
                    const project = projects.find(p => p.id === e.projectId);
                    return [
                        format(parseISO(e.date), 'MMM d, yyyy'),
                        project?.name || 'Unknown',
                        backendService.getTaskCategories().find(c => c.id === e.categoryId)?.name || e.categoryId,
                        (e.durationMinutes / 60).toFixed(2) + ' h',
                        e.isBillable ? 'Yes' : 'No',
                        e.status
                    ];
                });

                autoTable(doc, {
                    startY: yPos > 250 ? undefined : yPos, // Auto-page if too low
                    head: [['Date', 'Project', 'Task Category', 'Duration', 'Billable', 'Status']],
                    body: tableRows,
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246] }, // Blue-500
                    styles: { fontSize: 8 },
                    margin: { top: 20 }
                });

                // Footer
                const pageCount = (doc as any).internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
                }

                doc.save(`Report_${user?.name?.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
                showToast('PDF downloaded successfully!', 'success');
            } catch (error) {
                console.error("PDF Gen Error:", error);
                showToast('Failed to generate PDF.', 'error');
            }
            return;
        }

        // CSV / Excel Logic
        const headers = ['Date', 'Project', 'Task Category', 'Duration (Hours)', 'Details', 'Billable', 'Status'];
        const rows = filteredEntries.map(e => {
            const project = projects.find(p => p.id === e.projectId);
            const hours = (e.durationMinutes / 60).toFixed(2);
            return [
                e.date,
                project?.name || 'Unknown',
                e.categoryId,
                hours,
                `"${(e.description || '').replace(/"/g, '""')}"`, // Escape quotes
                e.isBillable ? 'Yes' : 'No',
                e.status
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const timestamp = format(new Date(), 'yyyy-MM-dd');
        const ext = type === 'EXCEL' ? 'xls' : 'csv'; // Simple workaround: .xls often opens CSV content correctly in Excel
        link.setAttribute('download', `My_Reports_${timestamp}.${ext}`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`${type} export started!`, 'success');
    };

    const handleView = (entry: any) => {
        navigate('/employee/timesheet', { state: { date: entry.date } });
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
                <ReportsHeader onExport={handleExport} />
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
                        <div id="report-charts-container">
                            <ReportsCharts
                                trendData={trendData}
                                pieData={pieData}
                                trendView={trendView}
                                onTrendViewChange={setTrendView}
                            />
                        </div>
                    </ErrorBoundary>

                    <ErrorBoundary name="Breakdown">
                        <ReportsBreakdown entries={filteredEntries} />
                    </ErrorBoundary>

                    <ErrorBoundary name="Table">
                        <ReportsTable
                            entries={enrichedEntries}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onView={handleView}
                        />
                    </ErrorBoundary>
                </div>

                {/* Right Sidebar (Compliance & Summary) - 4 Cols */}
                {/* <div className="xl:col-span-4">
                    <ErrorBoundary name="ProofCompliance">
                         Proof Compliance Removed
                    </ErrorBoundary>
                </div> */}

            </div>

        </div>
    );
};

export default MyReportsPage;

