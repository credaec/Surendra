import React from 'react';
import { Download } from 'lucide-react';

// We need a specific type for this table, can be derived from existing or new
export interface CostingEntry {
    id: string;
    employeeName: string;
    date: string;
    project: string;
    category: string;
    hours: number;
    isBillable: boolean;
    hourlyRate: number;
    costAmount: number;
    status: 'APPROVED' | 'PENDING';
}

interface CostBreakdownTabProps {
    data?: CostingEntry[]; // Optional for now until mock data is full
}

const CostBreakdownTab: React.FC<CostBreakdownTabProps> = ({ data = [] }) => {

    // Mock data if none provided
    const displayData: CostingEntry[] = data.length > 0 ? data : [
        { id: 'c1', employeeName: 'John Doe', date: '2026-01-02', project: 'BCS Skylights', category: 'Engineering', hours: 8, isBillable: true, hourlyRate: 50, costAmount: 400, status: 'APPROVED' },
        { id: 'c2', employeeName: 'John Doe', date: '2026-01-03', project: 'BCS Skylights', category: 'Engineering', hours: 8, isBillable: true, hourlyRate: 50, costAmount: 400, status: 'APPROVED' },
        { id: 'c3', employeeName: 'Jane Smith', date: '2026-01-02', project: 'Dr. Wade Residence', category: 'Drafting', hours: 6, isBillable: true, hourlyRate: 45, costAmount: 270, status: 'APPROVED' },
        { id: 'c4', employeeName: 'Jane Smith', date: '2026-01-02', project: 'Internal', category: 'Meeting', hours: 2, isBillable: false, hourlyRate: 45, costAmount: 90, status: 'APPROVED' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar for this tab */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-600 pl-2">Group By:</span>
                    <select className="text-xs border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50">
                        <option>Employee</option>
                        <option>Project</option>
                        <option>Date</option>
                    </select>
                </div>
                <button className="flex items-center px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Export Cost Sheet
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Employee</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Project</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-center">Hours</th>
                                <th className="px-4 py-3 text-center">Billable?</th>
                                <th className="px-4 py-3 text-right">Rate</th>
                                <th className="px-4 py-3 text-right">Cost</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-900">{item.employeeName}</td>
                                    <td className="px-4 py-3 text-slate-500">{item.date}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.project}</td>
                                    <td className="px-4 py-3 text-slate-500">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium">{item.hours}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.isBillable ? (
                                            <span className="text-emerald-600 text-xs font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">No</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500">{formatCurrency(item.hourlyRate)}</td>
                                    <td className="px-4 py-3 text-right font-medium text-slate-700">{formatCurrency(item.costAmount)}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 font-medium border-t border-slate-200">
                            <tr>
                                <td colSpan={4} className="px-4 py-3 text-right text-slate-600">Totals:</td>
                                <td className="px-4 py-3 text-center text-slate-900">
                                    {displayData.reduce((acc, curr) => acc + curr.hours, 0)}
                                </td>
                                <td colSpan={2}></td>
                                <td className="px-4 py-3 text-right text-slate-900">
                                    {formatCurrency(displayData.reduce((acc, curr) => acc + curr.costAmount, 0))}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdownTab;
