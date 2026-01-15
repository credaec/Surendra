import React, { useState, useEffect } from 'react';

import PayrollHeader from '../../../components/admin/payroll/PayrollHeader';
import PayrollKPIs from '../../../components/admin/payroll/PayrollKPIs';
import PayrollFilters, { type PayrollFilterState } from '../../../components/admin/payroll/PayrollFilters';
import PayrollSummaryTab from '../../../components/admin/payroll/PayrollSummaryTab';
import CostBreakdownTab from '../../../components/admin/payroll/CostBreakdownTab';
import ProjectCostingTab from '../../../components/admin/payroll/ProjectCostingTab';
import PayrollExceptionsTab from '../../../components/admin/payroll/PayrollExceptionsTab';
import { mockBackend, type PayrollRun, type PayrollRecord } from '../../../services/mockBackend';
import { Clock, Users, Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

const PayrollPage: React.FC = () => {
    // const navigate = useNavigate();
    const [currentRun, setCurrentRun] = useState<PayrollRun | null>(null);
    const [records, setRecords] = useState<PayrollRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'SUMMARY' | 'COST_BREAKDOWN' | 'PROJECT_COST' | 'EXCEPTIONS'>('SUMMARY');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
        // Refresh records
        // setRecords(...)
        alert(`Payroll generated for ${filters.period}`);
    };

    const handleLock = () => {
        if (currentRun) {
            mockBackend.lockPayroll(currentRun.id);
            setCurrentRun({ ...currentRun, status: 'LOCKED', isLocked: true });
        }
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
                    onViewQuery={(id) => console.log('View', id)}
                />
            )}

            {activeTab === 'COST_BREAKDOWN' && (
                <CostBreakdownTab />
            )}

            {activeTab === 'PROJECT_COST' && (
                <ProjectCostingTab />
            )}

            {activeTab === 'EXCEPTIONS' && (
                <PayrollExceptionsTab />
            )}
        </div>
    );
};

export default PayrollPage;
