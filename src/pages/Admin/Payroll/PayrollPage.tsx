import React, { useState, useEffect } from 'react';

import PayrollHeader from '../../../components/admin/payroll/PayrollHeader';
import PayrollKPIs from '../../../components/admin/payroll/PayrollKPIs';
import PayrollFilters, { type PayrollFilterState } from '../../../components/admin/payroll/PayrollFilters';
import PayrollSummaryTab from '../../../components/admin/payroll/PayrollSummaryTab';
import CostBreakdownTab from '../../../components/admin/payroll/CostBreakdownTab';
import ProjectCostingTab from '../../../components/admin/payroll/ProjectCostingTab';
import PayrollExceptionsTab from '../../../components/admin/payroll/PayrollExceptionsTab';
import PayrollSlipModal from '../../../components/admin/payroll/PayrollSlipModal';
import { backendService, type PayrollRun, type PayrollRecord } from '../../../services/backendService';
import { Clock, Users, Briefcase, AlertTriangle, Layers } from 'lucide-react';
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

    const handleDownloadSlip = (_id: string) => {
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
        const loadData = async () => {
            // Load initial data for the period
            const runs = backendService.getPayrollRuns();
            const run = runs.find(r => r.period === filters.period);

            if (run) {
                setCurrentRun(run);
                // Try to get records from cache first
                let recs = backendService.getPayrollRecords(run.id);

                // Auto-heal: If run exists but has no records OR has stale data, regenerate
                // Also check if records effectively empty (all hours 0) which might indicate failed previous calc
                const isEmpty = recs.length === 0 || (recs.every(r => r.totalHours === 0) && recs.length > 0);

                if (isEmpty) {
                    console.log('Regenerating stale/empty payroll run...');
                    try {
                        const newRun = await backendService.calculatePayroll(filters.period, {});
                        setCurrentRun(newRun);
                        const newRecs = await backendService.fetchPayrollRecords(newRun.id);
                        setRecords(newRecs);
                    } catch (e) {
                        console.error('Auto-heal failed', e);
                    }
                } else {
                    setRecords(recs);
                }
            } else {
                // New Run
                try {
                    const newRun = await backendService.calculatePayroll(filters.period, {});
                    setCurrentRun(newRun);
                    const newRecs = await backendService.fetchPayrollRecords(newRun.id);
                    setRecords(newRecs);
                } catch (e) {
                    console.error('Initial generation failed', e);
                    showToast('Failed to load payroll data', 'error');
                }
            }
        };
        loadData();
    }, [filters.period]);

    // KPI Calculations
    const calculateKPIs = () => {
        if (!records.length) return {
            billable: 0,
            nonBillable: 0,
            projectCost: 0,
            pending: 0
        };

        const billable = records.reduce((acc, r) => acc + r.billableHours, 0);
        const nonBillable = records.reduce((acc, r) => acc + r.nonBillableHours, 0);
        const projectCost = records.reduce((acc, r) => acc + r.totalPayable, 0);

        // Calculate Pending from all SUBMITTED entries
        const allEntries = backendService.getEntries();
        const pendingEntries = allEntries.filter(e => e.status === 'SUBMITTED');
        const pending = Math.round(pendingEntries.reduce((acc, e) => acc + e.durationMinutes, 0) / 60);

        return { billable, nonBillable, projectCost, pending };
    };

    const kpis = calculateKPIs();

    const handleGenerate = async () => {
        try {
            showToast('Generating payroll...', 'info');
            const newRun = await backendService.calculatePayroll(filters.period, {});
            setCurrentRun(newRun);
            const newRecs = await backendService.fetchPayrollRecords(newRun.id);
            setRecords(newRecs);
            showToast(`Payroll successfully generated for ${filters.period}`, 'success');
        } catch (e) {
            console.error(e);
            showToast('Failed to generate payroll', 'error');
        }
    };

    const handleLock = () => {
        if (currentRun) {
            backendService.lockPayroll(currentRun.id);
            setCurrentRun({ ...currentRun, status: 'LOCKED', isLocked: true });
            showToast(`Payroll for ${filters.period} has been LOCKED.`, 'info');
        }
    };

    const handleRefresh = () => {
        showToast('Refreshing payroll data...', 'info');
        setTimeout(() => {
            const runs = backendService.getPayrollRuns();
            const run = runs.find(r => r.period === filters.period);
            if (run) {
                setCurrentRun(run);
                const recs = backendService.getPayrollRecords(run.id);
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
        { id: 'COST_BREAKDOWN', label: 'Employee Cost Breakdown', icon: Layers },
        { id: 'PROJECT_COST', label: 'Project Costing', icon: Briefcase },
        { id: 'EXCEPTIONS', label: 'Exceptions / Issues', icon: AlertTriangle },
    ] as const;

    return (
        <div className="space-y-8 pb-10">
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
                billableHours={kpis.billable}
                nonBillableHours={kpis.nonBillable}
                projectCost={kpis.projectCost}
                pendingHours={kpis.pending}
            />

            <PayrollFilters
                filters={filters}
                onFilterChange={setFilters}
            />

            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-2 shadow-sm mb-8 flex justify-center md:justify-start overflow-x-auto">
                <nav className="flex space-x-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "whitespace-nowrap py-3 px-6 rounded-3xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center group",
                                    isActive
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 scale-105"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 mr-2 transition-colors", isActive ? "text-white dark:text-slate-900" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            </div>

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
