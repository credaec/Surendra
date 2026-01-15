import {
    DollarSign,
    Clock,
    Briefcase,
    Lock,
    Unlock,
    AlertTriangle
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { PayrollRun } from '../../../services/mockBackend';

interface PayrollKPIsProps {
    data: PayrollRun | null;
    approvedHours: number;
    billableHours: number;
    nonBillableHours: number;
    projectCost: number;
    pendingHours: number;
}

const PayrollKPIs: React.FC<PayrollKPIsProps> = ({
    data,
    approvedHours,
    billableHours,
    nonBillableHours,
    projectCost,
    pendingHours
}) => {

    // Default values if no run selected
    const totalEmployees = data?.totalEmployees || 0;
    const totalPayable = data?.totalPayable || 0;
    const isLocked = data?.status === 'LOCKED';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* 1. Total Payable */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Total Payable</h3>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">{formatCurrency(totalPayable)}</span>
                    <p className="text-xs text-slate-500 mt-1">For {totalEmployees} employees</p>
                </div>
            </div>

            {/* 2. Total Project Cost */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Project Cost</h3>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Briefcase className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">{formatCurrency(projectCost)}</span>
                    <p className="text-xs text-slate-500 mt-1">Internal Cost Allocation</p>
                </div>
            </div>

            {/* 3. Hours Breakdown */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Total Approved Hrs</h3>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <span className="text-2xl font-bold text-slate-900">{approvedHours}h</span>
                    <div className="flex items-center space-x-2 mt-1 text-xs">
                        <span className="text-emerald-600 font-medium">{billableHours}h Billable</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">{nonBillableHours}h Non-Billable</span>
                    </div>
                </div>
            </div>

            {/* 4. Status & Risks */}
            <div className={cn(
                "p-5 rounded-xl border shadow-sm flex flex-col justify-between",
                pendingHours > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"
            )}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={cn("text-sm font-medium", pendingHours > 0 ? "text-amber-800" : "text-slate-500")}>
                        {isLocked ? "Payroll Status" : "Pending Impact"}
                    </h3>
                    <div className={cn("p-2 rounded-lg", isLocked ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-600")}>
                        {isLocked ? <Lock className="h-5 w-5" /> : (pendingHours > 0 ? <AlertTriangle className="h-5 w-5" /> : <Unlock className="h-5 w-5" />)}
                    </div>
                </div>
                <div>
                    {isLocked ? (
                        <>
                            <span className="text-2xl font-bold text-slate-700">LOCKED</span>
                            <p className="text-xs text-slate-500 mt-1">Period is finalized</p>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl font-bold text-slate-900">{pendingHours}h</span>
                            <p className="text-xs text-amber-700 mt-1">Hrs waiting approval</p>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PayrollKPIs;
