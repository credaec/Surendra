import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { backendService } from '../../../../services/backendService';
import { useTheme } from '../../../../context/ThemeContext';

const COLORS = ['#3b82f6', '#60a5fa', '#f59e0b', '#10b981', '#94a3b8', '#ef4444', '#8b5cf6', '#ec4899'];

const CategoryBreakdownReport: React.FC<any> = ({ filters }) => {
    const { isDarkMode } = useTheme();

    const filteredData = React.useMemo(() => {
        const entries = backendService.getEntries();
        // Aggregate by Category
        const catMap = new Map<string, any>();

        entries.forEach(e => {
            const catName = e.categoryId || 'Uncategorized';
            if (!catMap.has(catName)) {
                catMap.set(catName, {
                    id: catName,
                    name: catName,
                    totalHours: 0,
                    billable: 0,
                    nonBillable: 0,
                    color: COLORS[catMap.size % COLORS.length],
                    status: 'Active',
                    projectIds: []
                });
            }
            const c = catMap.get(catName);
            const h = e.durationMinutes / 60;
            c.totalHours += h;
            if (e.isBillable) c.billable += h;
            else c.nonBillable += h;

            if (e.projectId && !c.projectIds.includes(e.projectId)) {
                c.projectIds.push(e.projectId);
            }
        });

        const data = Array.from(catMap.values());

        return data.filter(cat => {
            const matchesProject = !filters.project || (cat.projectIds && cat.projectIds.includes(filters.project));
            const matchesStatus = !filters.status || filters.status === 'all' || cat.status === filters.status;

            return matchesProject && matchesStatus;
        });
    }, [filters]);

    const totalHours = React.useMemo(() => {
        return filteredData.reduce((acc, curr) => acc + curr.totalHours, 0);
    }, [filteredData]);

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#1e293b' : '#e2e8f0';
    const tooltipBg = isDarkMode ? '#0f172a' : '#fff';
    const tooltipBorder = isDarkMode ? '#1e293b' : '#e2e8f0';

    return (
        <div className="space-y-6">

            {/* Top Section: Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pie Chart: Percentage Split */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Time Distribution by Activity</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={filteredData}
                                    dataKey="totalHours"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    stroke={isDarkMode ? '#0f172a' : '#fff'}
                                >
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: isDarkMode ? '#fff' : '#000' }}
                                />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: textColor }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Hours Comparison */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Hours by Category</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: isDarkMode ? '#fff' : '#000' }}
                                />
                                <Bar dataKey="totalHours" radius={[0, 4, 4, 0]} barSize={20} name="Total Hours">
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Detailed Breakdown Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Detailed Activity Breakdown</h3>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Export CSV</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Task Category</th>
                                <th className="px-6 py-4 text-right">Total Hours</th>
                                <th className="px-6 py-4 text-right">Billable</th>
                                <th className="px-6 py-4 text-right">Non-Billable</th>
                                <th className="px-6 py-4 text-center">% Contribution</th>
                                <th className="px-6 py-4">Top Project</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredData.map((cat) => {
                                const contribution = Math.round((cat.totalHours / totalHours) * 100);
                                return (
                                    <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center">
                                            <span className="h-3 w-3 rounded-full mr-3" style={{ backgroundColor: cat.color }}></span>
                                            {cat.name}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-medium">{cat.totalHours}h</td>
                                        <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400">{cat.billable}h</td>
                                        <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">{cat.nonBillable}h</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mr-2">
                                                    <div className="h-1.5 rounded-full" style={{ width: `${contribution}%`, backgroundColor: cat.color }}></div>
                                                </div>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{contribution}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                            {/* Mock top project */}
                                            {cat.id === 1 ? 'Skyline Tower' : cat.id === 2 ? 'City Bridge' : 'Various'}
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

export default CategoryBreakdownReport;

