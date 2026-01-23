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

import { mockBackend } from '../../../services/mockBackend';

const ProjectCostingTab: React.FC<ProjectCostingTabProps> = ({ data = [] }) => {

    // Dynamic Data Calculation
    const displayData: ProjectCosting[] = React.useMemo(() => {
        if (data.length > 0) return data; // Use props if provided

        const projects = mockBackend.getProjects();
        const entries = mockBackend.getEntries();
        const users = mockBackend.getUsers();

        return projects.map(p => {
            const projEntries = entries.filter(e => e.projectId === p.id);

            let actualHours = 0;
            let billableHours = 0;
            let employeeCost = 0;
            let estBilling = 0;

            projEntries.forEach(e => {
                const h = e.durationMinutes / 60;
                actualHours += h;
                if (e.isBillable) billableHours += h;

                // Cost: User Rate * Hours
                const user = users.find(u => u.id === e.userId);
                const costRate = user?.hourlyCostRate || 40; // Default Cost
                employeeCost += h * costRate;

                // Billing: Project Rate or ...
                // Simple logic: Project Global Rate * Hours (if billable?) or specific logic
                // Assuming Global Rate for all billable hours for MVP
                const billRate = p.globalRate || 100;
                if (e.isBillable) {
                    estBilling += h * billRate;
                }
            });

            return {
                id: p.id,
                projectName: p.name,
                clientName: p.clientName,
                budgetHours: p.estimatedHours || 0,
                actualHours: Math.round(actualHours),
                billableHours: Math.round(billableHours),
                employeeCost: Math.round(employeeCost),
                estBilling: Math.round(estBilling)
            };
        }).filter(p => p.actualHours > 0 || p.budgetHours > 0); // Only show active/budgeted
    }, [data]);

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
