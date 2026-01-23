import React, { useMemo } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PayrollRecord } from '../../../services/mockBackend';

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
                    severity: 'medium' as any // minor typo fix in type above if strict
                });
            }
        });

        return issues;
    }, [records]);

    const getSeverityBadge = (severity: PayrollException['severity']) => {
        switch (severity.toUpperCase()) {
            case 'HIGH':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-700">High</span>;
            case 'MEDIUM':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">Medium</span>;
            case 'LOW':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">Low</span>;
            default:
                return null;
        }
    };

    if (exceptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No Exceptions Found</h3>
                <p className="text-slate-500 max-w-sm text-center mt-1">
                    All payroll records look healthy. No anomalies detected for this period.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Info Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-amber-800">Review Required</h3>
                    <p className="text-sm text-amber-700 mt-1">Found {exceptions.length} potential issues that may affect payroll accuracy. Please resolve these before locking the period.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Severity</th>
                            <th className="px-4 py-3">Issue Type</th>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Problem Details</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {exceptions.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">{getSeverityBadge(item.severity)}</td>
                                <td className="px-4 py-3 font-medium text-slate-700">{item.issueType.replace('_', ' ')}</td>
                                <td className="px-4 py-3 text-slate-900">{item.employeeName}</td>
                                <td className="px-4 py-3 text-slate-500">{item.date}</td>
                                <td className="px-4 py-3 text-slate-600">{item.project}</td>
                                <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={item.details}>{item.details}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => onFix(item.recordId)}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center justify-center mx-auto hover:underline"
                                    >
                                        Fix Issue <ArrowRight className="h-3 w-3 ml-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollExceptionsTab;
