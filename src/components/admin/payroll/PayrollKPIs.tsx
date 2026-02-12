import {
    DollarSign,
    Clock,
    Briefcase,
    Lock,
    Unlock,
    AlertTriangle,
    Users
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { PayrollRun } from '../../../services/backendService';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* 1. Total Payable */}
            <div className="bg-white dark:bg-surface p-8 rounded-[2.5rem] border border-slate-100 dark:border-border shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Total Payable</h3>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <DollarSign className="h-6 w-6" />
                    </div>
                </div>
                <div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{formatCurrency(totalPayable)}</span>
                    <div className="flex items-center mt-3 space-x-2">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{totalEmployees} employees</p>
                    </div>
                </div>
            </div>

            {/* 2. Total Project Cost */}
            <div className="bg-white dark:bg-surface p-8 rounded-[2.5rem] border border-slate-100 dark:border-border shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Project Cost</h3>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                        <Briefcase className="h-6 w-6" />
                    </div>
                </div>
                <div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{formatCurrency(projectCost)}</span>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-3 uppercase tracking-widest">Internal Allocation</p>
                </div>
            </div>

            {/* 3. Hours Breakdown */}
            <div className="bg-white dark:bg-surface p-8 rounded-[2.5rem] border border-slate-100 dark:border-border shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Approved Hours</h3>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-6 w-6" />
                    </div>
                </div>
                <div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{approvedHours}<span className="text-2xl ml-1 text-slate-300 dark:text-slate-600">h</span></span>
                    <div className="flex items-center space-x-3 mt-3 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-emerald-600 dark:text-emerald-400">{billableHours}h Bill</span>
                        <span className="text-slate-200 dark:text-slate-700">|</span>
                        <span className="text-slate-400 dark:text-slate-500">{nonBillableHours}h Non</span>
                    </div>
                </div>
            </div>

            {/* 4. Status & Risks */}
            <div className={cn(
                "p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-xl",
                pendingHours > 0
                    ? "bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-900/40 hover:shadow-amber-500/10"
                    : "bg-white dark:bg-surface border-slate-100 dark:border-border"
            )}>
                <div className="flex items-center justify-between mb-8">
                    <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", pendingHours > 0 ? "text-amber-800 dark:text-amber-500" : "text-slate-400 dark:text-slate-500")}>
                        {isLocked ? "Payroll Status" : "Pending Impact"}
                    </h3>
                    <div className={cn("p-3 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300", isLocked ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" : "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400")}>
                        {isLocked ? <Lock className="h-6 w-6" /> : (pendingHours > 0 ? <AlertTriangle className="h-6 w-6" /> : <Unlock className="h-6 w-6" />)}
                    </div>
                </div>
                <div>
                    {isLocked ? (
                        <>
                            <span className="text-4xl font-black text-slate-700 dark:text-slate-300 tracking-tighter leading-none">LOCKED</span>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-3 uppercase tracking-widest">Period Finalized</p>
                        </>
                    ) : (
                        <>
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{pendingHours}<span className="text-2xl ml-1 text-slate-300 dark:text-slate-600">h</span></span>
                            <p className={cn("text-[10px] font-bold mt-3 uppercase tracking-widest", pendingHours > 0 ? "text-amber-700 dark:text-amber-400" : "text-slate-400 dark:text-slate-500")}>Waiting Approval</p>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PayrollKPIs;
