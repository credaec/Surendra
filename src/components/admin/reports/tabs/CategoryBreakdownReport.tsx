import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';

// import { cn } from '../../../../lib/utils';

const mockCategoryData = [
    { id: 1, name: 'Engineering Design', totalHours: 450, billable: 450, nonBillable: 0, color: '#3b82f6' },
    { id: 2, name: 'Drafting & Modeling', totalHours: 320, billable: 320, nonBillable: 0, color: '#60a5fa' },
    { id: 3, name: 'Project Management', totalHours: 150, billable: 100, nonBillable: 50, color: '#f59e0b' },
    { id: 4, name: 'Client Meetings', totalHours: 85, billable: 85, nonBillable: 0, color: '#10b981' },
    { id: 5, name: 'Internal Review', totalHours: 60, billable: 10, nonBillable: 50, color: '#94a3b8' },
    { id: 6, name: 'Rework / Corrections', totalHours: 45, billable: 0, nonBillable: 45, color: '#ef4444' },
];

const totalHours = mockCategoryData.reduce((acc, curr) => acc + curr.totalHours, 0);

const CategoryBreakdownReport: React.FC<any> = () => {
    return (
        <div className="space-y-6">

            {/* Top Section: Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pie Chart: Percentage Split */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Time Distribution by Activity</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockCategoryData}
                                    dataKey="totalHours"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                >
                                    {mockCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Hours Comparison */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Hours by Category</h3>
                    <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="totalHours" radius={[0, 4, 4, 0]} barSize={20} name="Total Hours">
                                    {mockCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Detailed Breakdown Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Detailed Activity Breakdown</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export CSV</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Task Category</th>
                                <th className="px-6 py-4 text-right">Total Hours</th>
                                <th className="px-6 py-4 text-right">Billable</th>
                                <th className="px-6 py-4 text-right">Non-Billable</th>
                                <th className="px-6 py-4 text-center">% Contribution</th>
                                <th className="px-6 py-4">Top Project</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockCategoryData.map((cat) => {
                                const contribution = Math.round((cat.totalHours / totalHours) * 100);
                                return (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                            <span className="h-3 w-3 rounded-full mr-3" style={{ backgroundColor: cat.color }}></span>
                                            {cat.name}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-900 font-medium">{cat.totalHours}h</td>
                                        <td className="px-6 py-4 text-right text-emerald-600">{cat.billable}h</td>
                                        <td className="px-6 py-4 text-right text-slate-500">{cat.nonBillable}h</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <div className="w-16 bg-slate-100 rounded-full h-1.5 mr-2">
                                                    <div className="h-1.5 rounded-full" style={{ width: `${contribution}%`, backgroundColor: cat.color }}></div>
                                                </div>
                                                <span className="text-xs text-slate-500">{contribution}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
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
