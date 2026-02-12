import React, { useMemo } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { PayrollRecord } from '../../../services/backendService';

export interface PayrollException {
    id: string;
    recordId: string;
    issueType: 'MISSING_RATE' | 'ZERO_PAY' | 'HIGH_OVERTIME' | 'NEGATIVE_ADJUSTMENT';
    employeeName: string;
    date: string;
    project: string;
    details: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface PayrollExceptionsTabProps {
    records: PayrollRecord[];
    onFix: (recordId: string) => void;
}

const PayrollExceptionsTab: React.FC<PayrollExceptionsTabProps> = ({ records, onFix }) => {

    const exceptions = useMemo(() => {
        const issues: PayrollException[] = [];

        records.forEach(record => {
            // 1. Missing Rate
            if (record.hourlyRate === 0 && record.totalHours > 0) {
                issues.push({
                    id: `ex-${record.id}-rate`,
                    recordId: record.id,
                    issueType: 'MISSING_RATE',
                    employeeName: record.employeeName,
                    date: 'Current',
                    project: 'N/A',
                    details: 'Hourly rate is 0 but hours are logged.',
                    severity: 'HIGH'
                });
            }

            // 2. Zero Pay
            if (record.totalPayable <= 0 && record.totalHours > 0) {
                issues.push({
                    id: `ex-${record.id}-pay`,
                    recordId: record.id,
                    issueType: 'ZERO_PAY',
                    employeeName: record.employeeName,
                    date: 'Current',
                    project: 'See Details',
                    details: 'Total payable is 0 despite having hours.',
                    severity: 'HIGH'
                });
            }

            // 3. High Overtime
            if (record.overtimeHours > 20) {
                issues.push({
                    id: `ex-${record.id}-ot`,
                    recordId: record.id,
                    issueType: 'HIGH_OVERTIME',
                    employeeName: record.employeeName,
                    date: 'Current',
                    project: 'Multiple',
                    details: `Unusually high overtime: ${record.overtimeHours} hours.`,
                    severity: 'MEDIUM'
                });
            }

            // 4. Large Deduction (Negative Adjustment warning)
            if (record.deductions > record.basePay * 0.5) {
                issues.push({
                    id: `ex-${record.id}-deduct`,
                    recordId: record.id,
                    issueType: 'NEGATIVE_ADJUSTMENT',
                    employeeName: record.employeeName,
                    date: 'Current',
                    project: 'N/A',
                    details: `Deductions ($${record.deductions}) exceed 50% of base pay.`,
                    severity: 'MEDIUM'
                });
            }
        });

        return issues;
    }, [records]);

    const getSeverityBadge = (severity: PayrollException['severity']) => {
        switch (severity.toUpperCase()) {
            case 'HIGH':
                return <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm"><ShieldAlert className="h-3 w-3 mr-2" /> High</span>;
            case 'MEDIUM':
                return <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm">Medium</span>;
            case 'LOW':
                return <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">Low</span>;
            default:
                return null;
        }
    };

    if (exceptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="h-24 w-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 animate-in zoom-in-50 duration-500">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">No Exceptions Found</h3>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-sm text-center">
                    All payroll records look healthy. <br />No anomalies detected for this period.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Info Alert */}
            <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-[2rem] p-6 flex items-start animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-2xl mr-5 shadow-inner">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                </div>
                <div>
                    <h3 className="text-base font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-1">Review Required</h3>
                    <p className="text-sm font-bold text-amber-700/80 dark:text-amber-500/80">Found {exceptions.length} potential issues that may affect payroll accuracy. Please resolve these before locking the period.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest pl-10">Severity</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Issue Type</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Project</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Problem Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center pr-10">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {exceptions.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                    <td className="px-8 py-5 pl-10">{getSeverityBadge(item.severity)}</td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2" />
                                            <span className="font-black uppercase tracking-widest text-[10px] text-slate-700 dark:text-slate-300">{item.issueType.replace('_', ' ')}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-black text-slate-900 dark:text-white transition-colors text-base">{item.employeeName}</div>
                                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.date}</div>
                                    </td>

                                    <td className="px-6 py-5 font-bold text-slate-600 dark:text-slate-400">{item.project}</td>

                                    <td className="px-6 py-5 font-medium text-slate-500 dark:text-slate-400 max-w-md truncate" title={item.details}>
                                        {item.details}
                                    </td>

                                    <td className="px-8 py-5 text-center pr-10">
                                        <button
                                            onClick={() => onFix(item.recordId)}
                                            className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center mx-auto hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30"
                                        >
                                            Fix Issue <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayrollExceptionsTab;
