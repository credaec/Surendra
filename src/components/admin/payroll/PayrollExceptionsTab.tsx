import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

export interface PayrollException {
    id: string;
    issueType: 'MISSING_RATE' | 'NEGATIVE_HOURS' | 'HIGH_HOURS' | 'DUPLICATE_ENTRY';
    employeeName: string;
    date: string;
    project: string;
    details: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface PayrollExceptionsTabProps {
    data?: PayrollException[];
}

const PayrollExceptionsTab: React.FC<PayrollExceptionsTabProps> = ({ data = [] }) => {

    const displayData: PayrollException[] = data.length > 0 ? data : [
        { id: 'e1', issueType: 'MISSING_RATE', employeeName: 'New Hire (Temp)', date: '2026-01-05', project: 'N/A', details: 'No hourly rate defined in master setup.', severity: 'HIGH' },
        { id: 'e2', issueType: 'HIGH_HOURS', employeeName: 'Jane Smith', date: '2026-01-04', project: 'BCS Skylights', details: 'Logged 16 hours in a single day.', severity: 'MEDIUM' },
        { id: 'e3', issueType: 'DUPLICATE_ENTRY', employeeName: 'John Doe', date: '2026-01-02', project: 'Internal', details: 'Potential duplicate time entry found.', severity: 'LOW' },
    ];

    const getSeverityBadge = (severity: PayrollException['severity']) => {
        switch (severity) {
            case 'HIGH':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-700">High</span>;
            case 'MEDIUM':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">Medium</span>;
            case 'LOW':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">Low</span>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Info Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-amber-800">Review Required</h3>
                    <p className="text-sm text-amber-700 mt-1">Found {displayData.length} potential issues that may affect payroll accuracy. Please resolve these before locking the period.</p>
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
                        {displayData.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">{getSeverityBadge(item.severity)}</td>
                                <td className="px-4 py-3 font-medium text-slate-700">{item.issueType.replace('_', ' ')}</td>
                                <td className="px-4 py-3 text-slate-900">{item.employeeName}</td>
                                <td className="px-4 py-3 text-slate-500">{item.date}</td>
                                <td className="px-4 py-3 text-slate-600">{item.project}</td>
                                <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={item.details}>{item.details}</td>
                                <td className="px-4 py-3 text-center">
                                    <button className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center justify-center mx-auto hover:underline">
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
