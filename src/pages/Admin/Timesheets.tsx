import React, { useState } from 'react';
import AdminTimesheetHeader from '../../components/admin/timesheet/AdminTimesheetHeader';
import TimesheetFilters from '../../components/admin/timesheet/TimesheetFilters';
import TimesheetSummaryCards from '../../components/admin/timesheet/TimesheetSummaryCards';
import WeeklySummaryTab from '../../components/admin/timesheet/WeeklySummaryTab';
import TimeLogsTab from '../../components/admin/timesheet/TimeLogsTab';
import LiveTrackingTab from '../../components/admin/timesheet/LiveTrackingTab';
import TimesheetDetailView from '../../components/admin/timesheet/TimesheetDetailView';

import ManualEntryModal from '../../components/admin/ManualEntryModal';
import { backendService } from '../../services/backendService';

const AdminTimesheetsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'weekly' | 'logs' | 'live'>('weekly');

    // Filter States
    const [dateRange, setDateRange] = useState('this_week');
    const [filterEmployeeId, setFilterEmployeeId] = useState('all');
    const [filterProjectId, setFilterProjectId] = useState('all');
    const [filterClientId, setFilterClientId] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Trigger re-feth

    const handleViewDetail = (employeeId: string) => {
        setSelectedEmployeeId(employeeId);
    };

    const handleRowApprove = (employeeId: string) => {
        if (confirm('Approve all pending entries for this employee?')) {
            const entries = backendService.getEntries().filter(e => e.userId === employeeId && e.status === 'SUBMITTED');
            entries.forEach(e => backendService.updateEntryStatus(e.id, 'APPROVED'));
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleRowReject = (employeeId: string) => {
        if (confirm('Reject pending entries for this employee?')) {
            const entries = backendService.getEntries().filter(e => e.userId === employeeId && e.status === 'SUBMITTED');
            entries.forEach(e => backendService.updateEntryStatus(e.id, 'REJECTED'));
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleRowMenuAction = (employeeId: string, action: string) => {
        if (action === 'more') {
            alert(`More options for employee ${employeeId} coming soon!`);
        }
    };

    const handleBackToSummary = () => {
        setSelectedEmployeeId(null);
    };

    const handleExport = () => {
        const entries = backendService.getEntries();
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Date,User,Project,Category,Duration (m),Billable,Status\n"
            + entries.map(e => `${e.id},${e.date},${e.userId},${e.projectId},${e.categoryId},${e.durationMinutes},${e.isBillable},${e.status}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "timesheets_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkApprove = () => {
        const entries = backendService.getEntries();
        const pending = entries.filter(e => e.status === 'SUBMITTED');
        let count = 0;
        pending.forEach(e => {
            backendService.updateEntryStatus(e.id, 'APPROVED');
            count++;
        });
        if (count > 0) {
            alert(`Approved ${count} entries.`);
            setRefreshKey(prev => prev + 1); // Refresh views
        } else {
            alert("No pending entries to approve.");
        }
    };

    const handleLock = () => {
        // Mock lock
        alert("Timesheets for the current period have been locked.");
    };

    const handleAddEntry = () => {
        setIsAddEntryOpen(true);
    };

    const handleEntrySuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            <AdminTimesheetHeader
                onExport={handleExport}
                onBulkApprove={handleBulkApprove}
                onLock={handleLock}
                onAddEntry={handleAddEntry}
            />

            <TimesheetFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                employeeId={filterEmployeeId}
                onEmployeeChange={setFilterEmployeeId}
                projectId={filterProjectId}
                onProjectChange={setFilterProjectId}
                clientId={filterClientId}
                onClientChange={setFilterClientId}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
            />

            <TimesheetSummaryCards
                key={`cards-${refreshKey}`}
                dateRange={dateRange}
                filterEmployeeId={filterEmployeeId}
                filterProjectId={filterProjectId}
                filterClientId={filterClientId}
            />

            {/* Tabs and Content */}
            {selectedEmployeeId ? (
                <TimesheetDetailView
                    employeeId={selectedEmployeeId}
                    weekStartDate={typeof dateRange === 'string' ? dateRange : 'Current Week'}
                    onBack={handleBackToSummary}
                />
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] transition-all">
                    <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setActiveTab('weekly')}
                                className={`text-sm font-medium pb-1 transition-colors ${activeTab === 'weekly' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Timesheets
                            </button>
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={`text-sm font-medium pb-1 transition-colors ${activeTab === 'logs' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Time Logs
                            </button>
                            <button
                                onClick={() => setActiveTab('live')}
                                className={`text-sm font-medium pb-1 transition-colors ${activeTab === 'live' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Live Tracking
                            </button>
                        </div>
                    </div>
                    <div className="p-0">
                        {activeTab === 'weekly' && (
                            <WeeklySummaryTab
                                key={`weekly-${refreshKey}`}
                                onViewDetail={handleViewDetail}
                                onApprove={handleRowApprove}
                                onReject={handleRowReject}
                                onMenuAction={handleRowMenuAction}
                                filterEmployeeId={filterEmployeeId}
                                filterProjectId={filterProjectId}
                                filterClientId={filterClientId}
                                filterStatus={filterStatus}
                                dateRange={dateRange}
                            />
                        )}
                        {activeTab === 'logs' && (
                            <TimeLogsTab
                                key={`logs-${refreshKey}`}
                                filterEmployeeId={filterEmployeeId}
                                filterProjectId={filterProjectId}
                                filterClientId={filterClientId}
                                filterStatus={filterStatus}
                                dateRange={dateRange}
                            />
                        )}
                        {activeTab === 'live' && <LiveTrackingTab key={`live-${refreshKey}`} />}
                    </div>
                </div>
            )}

            <ManualEntryModal
                isOpen={isAddEntryOpen}
                onClose={() => setIsAddEntryOpen(false)}
                onSuccess={handleEntrySuccess}
                filterEmployeeId={filterEmployeeId !== 'all' ? filterEmployeeId : undefined}
            />
        </div>
    );
};

export default AdminTimesheetsPage;

