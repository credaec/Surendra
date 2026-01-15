import React from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';

export interface ProjectCosting {
    id: string;
    projectName: string;
    clientName: string;
    budgetHours: number;
    actualHours: number;
    billableHours: number;
    employeeCost: number;
    estBilling: number; // Billable hours * Rate
}

interface ProjectCostingTabProps {
    data?: ProjectCosting[];
}

const ProjectCostingTab: React.FC<ProjectCostingTabProps> = ({ data = [] }) => {

    // Mock data
    const displayData: ProjectCosting[] = data.length > 0 ? data : [
        { id: 'p1', projectName: 'BCS Skylights', clientName: 'Boston Construction Services', budgetHours: 500, actualHours: 120, billableHours: 110, employeeCost: 6000, estBilling: 16500 },
        { id: 'p2', projectName: 'Dr. Wade Residence', clientName: 'Dr. Emily Wade', budgetHours: 200, actualHours: 45, billableHours: 40, employeeCost: 2025, estBilling: 6000 },
        { id: 'p3', projectName: 'Urban Apartment Complex', clientName: 'Urban Developers', budgetHours: 1000, actualHours: 300, billableHours: 280, employeeCost: 15000, estBilling: 42000 },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const totalCost = displayData.reduce((acc, curr) => acc + curr.employeeCost, 0);
    const totalBilling = displayData.reduce((acc, curr) => acc + curr.estBilling, 0);

    return (
        <div className="space-y-6">

            {/* Project Cost KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Projects</p>
                        <p className="text-xl font-bold text-slate-900">{displayData.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg mr-4">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Employee Cost</p>
                        <p className="text-xl font-bold text-slate-900">{formatCurrency(totalCost)}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg mr-4">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Est. Revenue</p>
                        <p className="text-xl font-bold text-slate-900">{formatCurrency(totalBilling)}</p>
                    </div>
                </div>
            </div>

            {/* Project Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Project</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3 text-center">Budget Hrs</th>
                                <th className="px-4 py-3 text-center">Actual Hrs</th>
                                <th className="px-4 py-3 text-center">Billable Hrs</th>
                                <th className="px-4 py-3 text-right">Employee Cost</th>
                                <th className="px-4 py-3 text-right">Est. Billing</th>
                                <th className="px-4 py-3 text-right">Profit Est.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayData.map((item) => {
                                const profit = item.estBilling - item.employeeCost;
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.projectName}</td>
                                        <td className="px-4 py-3 text-slate-600">{item.clientName}</td>
                                        <td className="px-4 py-3 text-center text-slate-500">{item.budgetHours}</td>
                                        <td className="px-4 py-3 text-center font-medium text-slate-700">{item.actualHours}</td>
                                        <td className="px-4 py-3 text-center text-emerald-600 font-medium">{item.billableHours}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(item.employeeCost)}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(item.estBilling)}</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600 bg-emerald-50/30">
                                            {formatCurrency(profit)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// DollarSign was missing in imports, adding it or using lucide-react directly
import { DollarSign } from 'lucide-react';

export default ProjectCostingTab;
