import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { mockBackend } from '../../../../services/mockBackend';

const ProjectPerformanceReport: React.FC<any> = ({ filters }) => {
    const [viewMode, setViewMode] = React.useState<'cost' | 'hours'>('cost');
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredData = React.useMemo(() => {
        const projects = mockBackend.getProjects();
        const entries = mockBackend.getEntries();
        // Calculate dynamic actuals from entries? 
        // For MVP, projects in mockBackend ALREADY has 'usedHours'. 
        // We can just trust 'usedHours' property of project, or recalculate from entries if we want to be super precise.
        // Let's recalculate from entries to be robust.

        return projects.map(p => {
            const projectEntries = entries.filter(e => e.projectId === p.id);
            const actualHours = projectEntries.reduce((acc, e) => acc + (e.durationMinutes / 60), 0);

            // Calculate cost (Mock logic: assume avg rate $50/hr if not set)
            // Proj global rate or user rater... sticking to simple project global rate if present.
            const rate = p.globalRate || 50;
            const actualCost = actualHours * rate;
            const budgetCost = (p.estimatedHours || 0) * rate; // Or budgetAmount if fixed

            // Margin
            // Simple: Budget - Actual
            const marginVal = budgetCost - actualCost;
            const marginPercent = budgetCost > 0 ? Math.round((marginVal / budgetCost) * 100) : 0;

            return {
                id: p.id,
                name: p.name,
                client: p.clientName,
                clientId: p.clientId,
                budgetHours: p.estimatedHours || 0,
                actualHours: Math.round(actualHours),
                budgetAmt: p.budgetAmount || budgetCost,
                usedAmt: Math.round(actualCost),
                margin: marginPercent,
                status: p.status
            };
        }).filter(p => {
            // 1. Text Search (Local)
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.client.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Client Filter (Global)
            const matchesClient = !filters.client || p.clientId === filters.client;

            // 3. Project Filter (Global)
            const matchesProject = !filters.project || p.id === filters.project;

            // 4. Status Filter (Global)
            const matchesStatus = !filters.status || filters.status === 'all' || p.status.toUpperCase() === filters.status.toUpperCase();

            return matchesSearch && matchesClient && matchesProject && matchesStatus;
        });
    }, [searchQuery, filters]);

    const chartData = React.useMemo(() => {
        // Filter chart data as well based on search, or keep it global?
        // Usually reports show filtered view in charts too.
        // Let's filter chart data based on the same filtered list for consistency.
        return filteredData.map(p => ({
            name: p.name.split(' ').slice(0, 2).join(' '), // Short name
            budget: viewMode === 'cost' ? p.budgetAmt : p.budgetHours,
            actual: viewMode === 'cost' ? p.usedAmt : p.actualHours,
        }));
    }, [viewMode, filteredData]);

    const formatValue = (value: number) => {
        if (viewMode === 'cost') {
            return value >= 1000 ? `$${value / 1000}k` : `$${value}`;
        }
        return `${value}h`;
    };

    const formatTooltip = (value: any) => {
        if (viewMode === 'cost') return `$${(value || 0).toLocaleString()}`;
        return `${(value || 0).toLocaleString()}h`;
    };

    return (
        <div className="space-y-6">

            {/* Top Section: Charts */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Budget vs Actual {viewMode === 'cost' ? 'Cost' : 'Hours'}
                    </h3>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('cost')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded transition-all",
                                viewMode === 'cost'
                                    ? "bg-white shadow-sm text-slate-800"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            Cost ($)
                        </button>
                        <button
                            onClick={() => setViewMode('hours')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded transition-all",
                                viewMode === 'hours'
                                    ? "bg-white shadow-sm text-slate-800"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            Hours (h)
                        </button>
                    </div>
                </div>

                <div className="h-80 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }}
                                tickFormatter={formatValue}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                formatter={formatTooltip}
                            />
                            <Legend verticalAlign="top" align="right" />
                            <Bar dataKey="budget" name={viewMode === 'cost' ? "Total Budget ($)" : "Budget (Hrs)"} fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="actual" name={viewMode === 'cost' ? "Actual Spent ($)" : "Actual (Hrs)"} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section: Detailed Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Project Financials</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Project / Client</th>
                                <th className="px-6 py-4 text-right">Budget (Hrs)</th>
                                <th className="px-6 py-4 text-right">Actual (Hrs)</th>
                                <th className="px-6 py-4 text-right">Budget ($)</th>
                                <th className="px-6 py-4 text-right">Used ($)</th>
                                <th className="px-6 py-4 text-center">Margin %</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((project) => (
                                    <tr
                                        key={project.id}
                                        onClick={() => filters.onViewDetail && filters.onViewDetail('project', project.id, project.name)}
                                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{project.name}</div>
                                            <div className="text-xs text-slate-500">{project.client}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 font-mono">{project.budgetHours}</td>
                                        <td className="px-6 py-4 text-right text-slate-900 font-mono font-medium">{project.actualHours}</td>
                                        <td className="px-6 py-4 text-right text-slate-600 font-mono">${project.budgetAmt.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-slate-900 font-mono font-medium">${project.usedAmt.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn("font-bold text-xs",
                                                project.margin < 0 ? "text-red-600" :
                                                    project.margin < 20 ? "text-amber-600" : "text-emerald-600"
                                            )}>
                                                {project.margin}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {project.status === 'Over Budget' && <AlertTriangle className="h-3 w-3 text-red-500 mr-2" />}
                                                <span className={cn("text-xs font-medium px-2 py-1 rounded-full",
                                                    project.status === 'On Track' ? "bg-emerald-50 text-emerald-700" :
                                                        project.status === 'At Risk' ? "bg-amber-50 text-amber-700" :
                                                            "bg-red-50 text-red-700"
                                                )}>
                                                    {project.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                        No projects found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectPerformanceReport;
