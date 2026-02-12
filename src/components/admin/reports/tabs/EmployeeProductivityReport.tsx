import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import { backendService } from '../../../../services/backendService';
import { useTheme } from '../../../../context/ThemeContext';

const EmployeeProductivityReport: React.FC<any> = ({ filters }) => {
    const { isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');

    // Fetch dynamic data
    const filteredData = React.useMemo(() => {
        const users = backendService.getUsers().filter(u => u.role === 'EMPLOYEE'); // Only employees
        const entries = backendService.getEntries();
        const projects = backendService.getProjects();

        return users.map(user => {
            const userEntries = entries.filter(e => e.userId === user.id);

            // Calculate stats
            let totalHours = 0;
            let billable = 0;
            let nonBillable = 0;
            const activeProjectIds = new Set<string>();
            const projectIds = new Set<string>();

            // Determine Date Range
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
                const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                start = new Date(now.setDate(diff));
                end = new Date(now.setDate(start.getDate() + 6));
            } else if (dateRange === 'today') {
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
            }

            userEntries.forEach(e => {
                // Date Filter
                if (start && end) {
                    const entryDate = new Date(e.date);
                    if (entryDate < start || entryDate > end) return;
                }

                const h = e.durationMinutes / 60;
                totalHours += h;
                if (e.isBillable) billable += h;
                else nonBillable += h;

                if (e.projectId) {
                    projectIds.add(e.projectId);
                    const proj = projects.find(p => p.id === e.projectId);
                    if (proj && proj.status === 'ACTIVE') {
                        activeProjectIds.add(e.projectId);
                    }
                }
            });

            const utilization = totalHours > 0 ? Math.round((billable / totalHours) * 100) : 0;

            // Determine status (mock logic based on usage)
            let status = 'Inactive';
            if (activeProjectIds.size > 0) status = 'Active';
            if (totalHours > 0) status = 'Working'; // Or 'All Approved' if we check entry status

            return {
                id: user.id,
                name: user.name,
                totalHours: parseFloat(totalHours.toFixed(1)),
                billable: parseFloat(billable.toFixed(1)),
                nonBillable: parseFloat(nonBillable.toFixed(1)),
                utilization,
                activeProjects: activeProjectIds.size,
                status, // 'Active' or something
                projectIds: Array.from(projectIds)
                // clientIds: ... (omitted for speed, can add if needed for filter)
            };
        }).filter(emp => {
            // 1. Text Search (Local)
            const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Employee Filter (Global)
            const matchesEmployee = !filters.employee || emp.id === filters.employee;

            // 3. Project Filter (Global)
            const matchesProject = !filters.project || (emp.projectIds && emp.projectIds.includes(filters.project));

            // 4. Min Hours (Quick filter logic placeholder)
            const hasActivity = emp.totalHours > 0;

            return matchesSearch && matchesEmployee && matchesProject && hasActivity;
        });
    }, [searchQuery, filters]);

    const chartData = React.useMemo(() => {
        return filteredData.map(d => ({
            name: d.name.split(' ')[0], // First name for chart
            billable: d.billable,
            nonBillable: d.nonBillable
        }));
    }, [filteredData]);

    const overallUtilization = React.useMemo(() => {
        const totalBillable = filteredData.reduce((acc, curr) => acc + curr.billable, 0);
        const totalNonBillable = filteredData.reduce((acc, curr) => acc + curr.nonBillable, 0);
        const avgUtilization = filteredData.length > 0
            ? Math.round(filteredData.reduce((acc, curr) => acc + curr.utilization, 0) / filteredData.length)
            : 0;

        return {
            billable: totalBillable,
            nonBillable: totalNonBillable,
            avg: avgUtilization
        };
    }, [filteredData]);

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#1e293b' : '#e2e8f0';
    const tooltipBg = isDarkMode ? '#0f172a' : '#fff';
    const tooltipBorder = isDarkMode ? '#1e293b' : '#e2e8f0';

    return (
        <div className="space-y-6">

            {/* Top Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bar Chart: Hours Breakdown */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Hours Distribution</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: isDarkMode ? '#fff' : '#000' }}
                                    cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: 20 }} />
                                <Bar dataKey="billable" name="Billable Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="nonBillable" name="Non-Billable" fill={isDarkMode ? '#475569' : '#94a3b8'} radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Overall Utilization */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors relative">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Overall Utilization</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Billable', value: overallUtilization.billable },
                                        { name: 'Non-Billable', value: overallUtilization.nonBillable }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill={isDarkMode ? '#1e293b' : '#e2e8f0'} />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: isDarkMode ? '#fff' : '#000' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-x-0 bottom-[140px] flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{overallUtilization.avg}%</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Avg Utilization</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Detailed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Detailed Employee Performance</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search employees..."
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
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4 text-right">Total Hours</th>
                                <th className="px-6 py-4 text-right">Billable</th>
                                <th className="px-6 py-4 text-right">Non-Billable</th>
                                <th className="px-6 py-4 text-center">Utilization</th>
                                <th className="px-6 py-4 text-center">Active Projects</th>
                                <th className="px-6 py-4">Approval Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        onClick={() => filters.onViewDetail && filters.onViewDetail('employee', emp.id, emp.name)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{emp.name}</td>
                                        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{emp.totalHours}h</td>
                                        <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">{emp.billable}h</td>
                                        <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-500">{emp.nonBillable}h</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.utilization >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                                                emp.utilization >= 70 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                                }`}>
                                                {emp.utilization}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{emp.activeProjects}</td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                                            <div className="flex items-center">
                                                <span className={`h-2 w-2 rounded-full mr-2 ${emp.status === 'All Approved' ? 'bg-emerald-500' :
                                                    emp.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}></span>
                                                {emp.status}
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
                                        No employees found matching "{searchQuery}"
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

export default EmployeeProductivityReport;

