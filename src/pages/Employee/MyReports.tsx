import React, { useState } from 'react';
import ReportsHeader from '../../components/employee/reports/ReportsHeader';
import ReportsFilterBar from '../../components/employee/reports/ReportsFilterBar';
import ReportsKPICards from '../../components/employee/reports/ReportsKPICards';
import ReportsCharts from '../../components/employee/reports/ReportsCharts';
import ReportsBreakdown from '../../components/employee/reports/ReportsBreakdown';
import ProofComplianceCard from '../../components/employee/reports/ProofComplianceCard';
import ReportsTable from '../../components/employee/reports/ReportsTable';

const MyReportsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState('Jan 1 - Jan 31, 2026');
    const [searchQuery, setSearchQuery] = useState('');

    // Error Boundary (Inline)
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
                <ReportsHeader />
            </ErrorBoundary>

            <ErrorBoundary name="Filters">
                <ReportsFilterBar
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />
            </ErrorBoundary>

            <ErrorBoundary name="KPIs">
                <ReportsKPICards />
            </ErrorBoundary>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Main Content (Charts & Breakdowns) - 8 Cols */}
                <div className="xl:col-span-8">
                    <ErrorBoundary name="Charts">
                        <ReportsCharts />
                    </ErrorBoundary>

                    <ErrorBoundary name="Breakdown">
                        <ReportsBreakdown />
                    </ErrorBoundary>

                    <ErrorBoundary name="Table">
                        <ReportsTable
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </ErrorBoundary>
                </div>

                {/* Right Sidebar (Compliance & Summary) - 4 Cols */}
                <div className="xl:col-span-4">
                    <ErrorBoundary name="ProofCompliance">
                        <ProofComplianceCard />
                    </ErrorBoundary>
                </div>

            </div>

        </div>
    );
};

export default MyReportsPage;
