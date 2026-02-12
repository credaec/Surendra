import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { backendService } from '../../../../services/backendService';
import { useTheme } from '../../../../context/ThemeContext';

const ProjectPerformanceReport: React.FC<any> = ({ filters }) => {
    const { isDarkMode } = useTheme();
    const [viewMode, setViewMode] = React.useState<'cost' | 'hours'>('cost');
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredData = React.useMemo(() => {
        const projects = backendService.getProjects();
        const entries = backendService.getEntries();

        return projects.map(p => {
            // Date Filter Logic
            const now = new Date();
            let start: Date | null = null;
            let end: Date | null = null;
            const { dateRange, startDate, endDate } = filters;

            if (dateRange === 'custom' && startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            } else if (dateRange === 'this-month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            } else if (dateRange === 'last-month') {
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
            } else if (dateRange === 'this-week') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                start = new Date(now.setDate(diff));
                end = new Date(now.setDate(start.getDate() + 6));
            } else if (dateRange === 'today') {
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
            }

            const projectEntries = entries.filter(e => {
                if (e.projectId !== p.id) return false;
                if (start && end) {
                    const entryDate = new Date(e.date);
                    if (entryDate < start || entryDate > end) return false;
                }
                return true;
            });
            const actualHours = projectEntries.reduce((acc, e) => acc + (e.durationMinutes / 60), 0);

            // Calculate cost (Mock logic: assume avg rate $50/hr if not set)
            const rate = p.globalRate || 50;
            const actualCost = actualHours * rate;
            const budgetCost = (p.estimatedHours || 0) * rate;

            // Margin
            const marginVal = budgetCost - actualCost;
            const marginPercent = budgetCost > 0 ? Math.round((marginVal / budgetCost) * 100) : 0;

            // Calculate Health Status for reporting
            let healthStatus = 'On Track';
            if (actualHours > (p.estimatedHours || 0)) healthStatus = 'Over Budget';
            else if (actualHours > (p.estimatedHours || 0) * 0.8) healthStatus = 'At Risk';

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
                status: p.status,
                healthStatus
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
        return filteredData.map(p => ({
            name: p.name.split(' ').slice(0, 2).join(' '),
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

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#1e293b' : '#e2e8f0';
    const tooltipBg = isDarkMode ? '#0f172a' : '#fff';
    const tooltipBorder = isDarkMode ? '#1e293b' : '#e2e8f0';

    return (
        <div className="space-y-6">

            {/* Top Section: Charts */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Budget vs Actual {viewMode === 'cost' ? 'Cost' : 'Hours'}
                    </h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
                        <button
                            onClick={() => setViewMode('cost')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded transition-all",
                                viewMode === 'cost'
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                            )}
                        >
                            Cost ($)
                        </button>
                        <button
                            onClick={() => setViewMode('hours')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded transition-all",
                                viewMode === 'hours'
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                            )}
                        >
                            Hours (h)
                        </button>
                    </div>
                </div>

                <div className="h-80 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }}
                                tickFormatter={formatValue}
                            />
                            <Tooltip
                                cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                                contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: isDarkMode ? '#fff' : '#000' }}
                                formatter={formatTooltip}
                            />
                            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingTop: 0, paddingBottom: 20 }} />
                            <Bar dataKey="budget" name={viewMode === 'cost' ? "Total Budget ($)" : "Budget (Hrs)"} fill={isDarkMode ? '#1e293b' : '#e2e8f0'} radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="actual" name={viewMode === 'cost' ? "Actual Spent ($)" : "Actual (Hrs)"} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section: Detailed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Project Financials</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
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
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((project) => (
                                    <tr
                                        key={project.id}
                                        onClick={() => filters.onViewDetail && filters.onViewDetail('project', project.id, project.name)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{project.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{project.client}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 font-mono">{project.budgetHours}</td>
                                        <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-mono font-medium">{project.actualHours}</td>
                                        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 font-mono">${project.budgetAmt.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-mono font-medium">${project.usedAmt.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn("font-bold text-xs",
                                                project.margin < 0 ? "text-red-600 dark:text-red-400" :
                                                    project.margin < 20 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                                            )}>
                                                {project.margin}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {project.healthStatus === 'Over Budget' && <AlertTriangle className="h-3 w-3 text-red-500 mr-2" />}
                                                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                    project.healthStatus === 'On Track' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                                                        project.healthStatus === 'At Risk' ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                                                            "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                                )}>
                                                    {project.healthStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-500 font-medium">
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

