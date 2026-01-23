import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import { mockBackend } from '../../../../services/mockBackend';

const EmployeeProductivityReport: React.FC<any> = ({ filters }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    // Fetch dynamic data
    const filteredData = React.useMemo(() => {
        const users = mockBackend.getUsers().filter(u => u.role === 'EMPLOYEE'); // Only employees
        const entries = mockBackend.getEntries();
        const projects = mockBackend.getProjects();

        return users.map(user => {
            const userEntries = entries.filter(e => e.userId === user.id);

            // Calculate stats
            let totalHours = 0;
            let billable = 0;
            let nonBillable = 0;
            const activeProjectIds = new Set<string>();
            const projectIds = new Set<string>();

            userEntries.forEach(e => {
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
        const total = totalBillable + totalNonBillable;
        const avgUtilization = filteredData.length > 0
            ? Math.round(filteredData.reduce((acc, curr) => acc + curr.utilization, 0) / filteredData.length)
            : 0;

        return {
            billable: totalBillable,
            nonBillable: totalNonBillable,
            avg: avgUtilization
        };
    }, [filteredData]);

    return (
        <div className="space-y-6">

            {/* Top Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bar Chart: Hours Breakdown */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Hours Distribution</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Legend />
                                <Bar dataKey="billable" name="Billable Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="nonBillable" name="Non-Billable" fill="#94a3b8" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Overall Utilization */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Overall Utilization</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Billable', value: overallUtilization.billable, color: '#3b82f6' },
                                        { name: 'Non-Billable', value: overallUtilization.nonBillable, color: '#e2e8f0' }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#e2e8f0" />
                                </Pie>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-2xl font-bold">{overallUtilization.avg}%</span>
                                        <span className="block text-xs text-slate-500">Avg Utilization</span>
                                    </div>
                                </div>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Detailed Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Detailed Employee Performance</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search employees..."
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
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        onClick={() => filters.onViewDetail && filters.onViewDetail('employee', emp.id, emp.name)}
                                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">{emp.name}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{emp.totalHours}h</td>
                                        <td className="px-6 py-4 text-right text-emerald-600 font-medium">{emp.billable}h</td>
                                        <td className="px-6 py-4 text-right text-slate-500">{emp.nonBillable}h</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.utilization >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                                emp.utilization >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {emp.utilization}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-600">{emp.activeProjects}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className={`h-2 w-2 rounded-full mr-2 ${emp.status === 'All Approved' ? 'bg-emerald-500' :
                                                    emp.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}></span>
                                                {emp.status}
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
