import React, { useMemo } from 'react';
import { Briefcase, TrendingUp, DollarSign, Target, ArrowRight } from 'lucide-react';
import { backendService } from '../../../services/backendService';

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

    // Dynamic Data Calculation
    const displayData: ProjectCosting[] = useMemo(() => {
        if (data.length > 0) return data; // Use props if provided

        const projects = backendService.getProjects();
        const entries = backendService.getEntries();
        const users = backendService.getUsers();

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
        <div className="space-y-8">

            {/* Project Cost KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="p-5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-3xl mr-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                        <Briefcase className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Total Projects</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{displayData.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                    <div className="p-5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl mr-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
                        <Target className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Employee Cost</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(totalCost)}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                        <TrendingUp className="h-32 w-32" />
                    </div>
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl mr-6 group-hover:scale-110 transition-transform duration-300 shadow-inner relative z-10">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Est. Revenue</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(totalBilling)}</p>
                    </div>
                </div>
            </div>

            {/* Project Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest pl-10">Project</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center">Budget</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center">Calculated</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-right">Cost Basis</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-right">Revenue</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right pr-10">Margin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {displayData.map((item) => {
                                const profit = item.estBilling - item.employeeCost;
                                return (
                                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                        <td className="px-8 py-6 pl-10">
                                            <div className="font-black text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5">{item.projectName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                                                {item.clientName} <ArrowRight className="h-3 w-3 mx-1 opacity-50" /> {item.budgetHours}h Budget
                                            </div>
                                        </td>

                                        <td className="px-6 py-6 text-center">
                                            <div className="relative inline-flex items-center justify-center">
                                                <svg className="h-10 w-10 transform -rotate-90">
                                                    <circle className="text-slate-100 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="transparent" r="16" cx="20" cy="20" />
                                                    <circle
                                                        className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out"
                                                        strokeWidth="3"
                                                        strokeDasharray={100}
                                                        strokeDashoffset={100 - (Math.min(item.actualHours / (item.budgetHours || 1), 1) * 100)}
                                                        strokeLinecap="round"
                                                        stroke="currentColor"
                                                        fill="transparent"
                                                        r="16"
                                                        cx="20"
                                                        cy="20"
                                                    />
                                                </svg>
                                                <span className="absolute text-[9px] font-black text-slate-600 dark:text-slate-300">{Math.round((item.actualHours / (item.budgetHours || 1)) * 100)}%</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-6">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between text-xs font-bold w-32 mx-auto">
                                                    <span className="text-slate-500 dark:text-slate-400">Actual</span>
                                                    <span className="text-slate-900 dark:text-white">{item.actualHours}h</span>
                                                </div>
                                                <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mx-auto">
                                                    <div className="h-full bg-slate-900 dark:bg-white rounded-full" style={{ width: `${Math.min((item.actualHours / (item.budgetHours || 1)) * 100, 100)}%` }} />
                                                </div>
                                                <div className="flex justify-between text-xs font-bold w-32 mx-auto">
                                                    <span className="text-emerald-600 dark:text-emerald-400">Billable</span>
                                                    <span className="text-slate-900 dark:text-white">{item.billableHours}h</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-6 text-right">
                                            <div className="font-bold text-slate-500 dark:text-slate-400">{formatCurrency(item.employeeCost)}</div>
                                        </td>

                                        <td className="px-6 py-6 text-right">
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.estBilling)}</span>
                                        </td>

                                        <td className="px-8 py-6 text-right pr-10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{formatCurrency(profit)}</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">Net Profit</span>
                                            </div>
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

export default ProjectCostingTab;
