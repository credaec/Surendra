import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '../../../../lib/utils';

const mockProjectData = [
    { id: 1, name: 'Skyline Tower Design', client: 'Apex Constructors', budgetHours: 1200, actualHours: 850, budgetAmt: 180000, usedAmt: 127500, margin: 25, status: 'On Track' },
    { id: 2, name: 'Riverside Mall Structural', client: 'Urban Developers', budgetHours: 800, actualHours: 720, budgetAmt: 120000, usedAmt: 108000, margin: 18, status: 'At Risk' },
    { id: 3, name: 'City Bridge Renovation', client: 'Gov Infrastructure', budgetHours: 2500, actualHours: 450, budgetAmt: 375000, usedAmt: 67500, margin: 32, status: 'On Track' },
    { id: 4, name: 'Lakeside Villa Plans', client: 'Private Client', budgetHours: 150, actualHours: 160, budgetAmt: 22500, usedAmt: 24000, margin: -5, status: 'Over Budget' },
    { id: 5, name: 'Office HQ Retrofit', client: 'Tech Corp', budgetHours: 500, actualHours: 120, budgetAmt: 75000, usedAmt: 18000, margin: 28, status: 'On Track' },
];

const chartData = mockProjectData.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '), // Short name
    budget: p.budgetAmt,
    actual: p.usedAmt,
}));

const ProjectPerformanceReport: React.FC<any> = ({ filters }) => {
    return (
        <div className="space-y-6">

            {/* Top Section: Charts */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Budget vs Actual Cost</h3>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button className="px-3 py-1 bg-white shadow-sm rounded text-xs font-medium text-slate-800">Cost ($)</button>
                        <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800">Hours (h)</button>
                    </div>
                </div>

                <div className="h-80 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }}
                                tickFormatter={(val) => `$${val / 1000} k`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                formatter={(value: any) => `$${(value || 0).toLocaleString()} `}
                            />
                            <Legend verticalAlign="top" align="right" />
                            <Bar dataKey="budget" name="Total Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="actual" name="Actual Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
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
                            {mockProjectData.map((project) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectPerformanceReport;
