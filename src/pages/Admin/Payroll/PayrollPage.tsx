import React, { useState, useEffect } from 'react';

import PayrollHeader from '../../../components/admin/payroll/PayrollHeader';
import PayrollKPIs from '../../../components/admin/payroll/PayrollKPIs';
import PayrollFilters, { type PayrollFilterState } from '../../../components/admin/payroll/PayrollFilters';
import PayrollSummaryTab from '../../../components/admin/payroll/PayrollSummaryTab';
import CostBreakdownTab from '../../../components/admin/payroll/CostBreakdownTab';
import ProjectCostingTab from '../../../components/admin/payroll/ProjectCostingTab';
import PayrollExceptionsTab from '../../../components/admin/payroll/PayrollExceptionsTab';
import PayrollSlipModal from '../../../components/admin/payroll/PayrollSlipModal';
import { mockBackend, type PayrollRun, type PayrollRecord } from '../../../services/mockBackend';
import { Clock, Users, Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

import { useToast } from '../../../context/ToastContext';

const PayrollPage: React.FC = () => {
    // const navigate = useNavigate();
    const { showToast } = useToast();
    const [currentRun, setCurrentRun] = useState<PayrollRun | null>(null);
    const [records, setRecords] = useState<PayrollRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'SUMMARY' | 'COST_BREAKDOWN' | 'PROJECT_COST' | 'EXCEPTIONS'>('SUMMARY');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modal State
    const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handlers
    const handleEditRecord = (record: PayrollRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleSaveSlip = (id: string, updates: { bonus: number; deductions: number }) => {
        const updatedRecords = records.map(r => {
            if (r.id === id) {
                const basePay = r.basePay;
                const overtime = r.overtimeAmount;
                const total = basePay + overtime + updates.bonus - updates.deductions;
                return { ...r, ...updates, totalPayable: total };
            }
            return r;
        });
        setRecords(updatedRecords);
        showToast('Payroll slip updated successfully', 'success');
    };

    const handleStatusChange = (id: string, status: 'PAID' | 'HOLD' | 'APPROVED') => {
        const updatedRecords = records.map(r =>
            r.id === id ? { ...r, status: status as any } : r
        );
        setRecords(updatedRecords);
        showToast(`Record status marked as ${status}`, 'success');
    };

    const handleDownloadSlip = (id: string) => {
        showToast('Downloading payroll slip...', 'info');
        setTimeout(() => {
            showToast('Download complete', 'success');
        }, 1000);
    };

    const [filters, setFilters] = useState<PayrollFilterState>({
        period: 'Jan 2026',
        employeeIds: [],
        projectIds: [],
        clientIds: [],
        billingType: 'ALL',
        approvalStatus: 'APPROVED',
        costMode: 'ACTUAL',
        searchQuery: ''
    });

    useEffect(() => {
        // Load initial data for the period
        // In real app, we would check if run exists for filters.period, else maybe just show draft or empty
        const runs = mockBackend.getPayrollRuns();
        const run = runs.find(r => r.period === filters.period);

        if (run) {
            setCurrentRun(run);
            const recs = mockBackend.getPayrollRecords(run.id);
            setRecords(recs);
        } else {
            // Mock: Auto-calculate draft if not found? Or just null
            // For demo, let's trigger a calculation if missing
            const newRun = mockBackend.calculatePayroll(filters.period, {});
            setCurrentRun(newRun);
            // We need to fetch records again effectively (mock logic simplification)
            setRecords([]);
            // In a real scenario, calculatePayroll would persis to DB and we'd fetch. 
            // Here we just set records manually for the demo if it was a fresh calc
            // But let's stick to the mockBackend flow
        }
    }, [filters.period]);

    const handleGenerate = () => {
        const newRun = mockBackend.calculatePayroll(filters.period, {});
        setCurrentRun(newRun);
        showToast(`Payroll successfully generated for ${filters.period}`, 'success');
    };

    const handleLock = () => {
        if (currentRun) {
            mockBackend.lockPayroll(currentRun.id);
            setCurrentRun({ ...currentRun, status: 'LOCKED', isLocked: true });
            showToast(`Payroll for ${filters.period} has been LOCKED.`, 'info');
        }
    };

    const handleRefresh = () => {
        showToast('Refreshing payroll data...', 'info');
        setTimeout(() => {
            const runs = mockBackend.getPayrollRuns();
            const run = runs.find(r => r.period === filters.period);
            if (run) {
                setCurrentRun(run);
                const recs = mockBackend.getPayrollRecords(run.id);
                setRecords(recs);
            }
            showToast('Data refreshed successfully.', 'success');
        }, 800);
    };

    const handleExport = () => {
        // Simple CSV Export logic
        if (!records.length) {
            showToast('No records to export.', 'error');
            return;
        }

        const headers = ['Employee', 'Role', 'Total Hours', 'Billable', 'Non-Billable', 'Hourly Rate', 'Total Cost', 'Status'];
        const rows = records.map(r => [
            r.employeeName,
            r.designation,
            r.totalHours,
            r.billableHours,
            r.nonBillableHours,
            r.hourlyRate,
            r.totalPayable,
            r.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payroll_export_${filters.period.replace(' ', '_')}.csv`;
        a.click();
        showToast('Payroll report downloaded.', 'success');
    };

    const handleSettings = () => {
        showToast('Payroll settings configuration coming soon.', 'info');
    };

    const tabs = [
        { id: 'SUMMARY', label: 'Payroll Summary', icon: Users },
        { id: 'COST_BREAKDOWN', label: 'Employee Cost Breakdown', icon: Clock },
        { id: 'PROJECT_COST', label: 'Project Costing', icon: Briefcase },
        { id: 'EXCEPTIONS', label: 'Exceptions / Issues', icon: AlertTriangle },
    ] as const;

    return (
        <div className="space-y-6">
            <PayrollHeader
                onGenerate={handleGenerate}
                onLock={handleLock}
                isLocked={currentRun?.isLocked || false}
                onRefresh={handleRefresh}
                onExport={handleExport}
                onSettings={handleSettings}
            />

            <PayrollKPIs
                data={currentRun}
                approvedHours={currentRun?.totalApprovedHours || 0}
                billableHours={200} // Mock
                nonBillableHours={100} // Mock
                projectCost={35000} // Mock
                pendingHours={15} // Mock
            />

            <PayrollFilters
                filters={filters}
                onFilterChange={setFilters}
            />

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 mb-4">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors",
                                    isActive
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 mr-2", isActive ? "text-blue-600" : "text-slate-400")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'SUMMARY' && (
                <PayrollSummaryTab
                    data={records}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onViewQuery={(id) => {
                        const rec = records.find(r => r.id === id);
                        if (rec) handleEditRecord(rec);
                    }}
                    onEdit={handleEditRecord}
                    onStatusChange={handleStatusChange}
                    onDownloadSlip={handleDownloadSlip}
                />
            )}

            {activeTab === 'COST_BREAKDOWN' && (
                <CostBreakdownTab records={records} />
            )}

            {activeTab === 'PROJECT_COST' && (
                <ProjectCostingTab />
            )}

            {activeTab === 'EXCEPTIONS' && (
                <PayrollExceptionsTab
                    records={records}
                    onFix={(id) => {
                        const rec = records.find(r => r.id === id);
                        if (rec) {
                            handleEditRecord(rec);
                            showToast('Opening record for correction', 'info');
                        }
                    }}
                />
            )}

            <PayrollSlipModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                record={selectedRecord}
                period={filters.period}
                onSave={handleSaveSlip}
            />
        </div>
    );
};

export default PayrollPage;
