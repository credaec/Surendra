import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ArrowRight } from 'lucide-react';
// import { cn } '../../../../lib/utils';

const mockClientData = [
    { id: 1, name: 'Apex Constructors', projects: 3, billableHours: 2500, billedAmt: 375000, pendingAmt: 25000, status: 'Active' },
    { id: 2, name: 'Urban Developers', projects: 2, billableHours: 1800, billedAmt: 270000, pendingAmt: 45000, status: 'Active' },
    { id: 3, name: 'Gov Infrastructure', projects: 5, billableHours: 4200, billedAmt: 630000, pendingAmt: 0, status: 'Active' },
    { id: 4, name: 'Tech Corp', projects: 1, billableHours: 400, billedAmt: 60000, pendingAmt: 15000, status: 'Hold' },
    { id: 5, name: 'Private Client', projects: 1, billableHours: 150, billedAmt: 22500, pendingAmt: 7500, status: 'Active' },
];

const chartData = mockClientData.map(c => ({
    name: c.name,
    amount: c.billedAmt,
}));

const ClientSummaryReport: React.FC<any> = ({ filters }) => {
    return (
        <div className="space-y-6">

            {/* Top Section: Revenue Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Client</h3>
                <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Billed Revenue']}
                            />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section: Client List Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Client Portfolio</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4 text-center">Projects</th>
                                <th className="px-6 py-4 text-right">Billable Hours</th>
                                <th className="px-6 py-4 text-right">Total Billed</th>
                                <th className="px-6 py-4 text-right">Pending Invoice</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockClientData.map((client) => (
                                <tr
                                    key={client.id}
                                    onClick={() => filters.onViewDetail && filters.onViewDetail('client', client.id, client.name)}
                                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xs font-bold">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        {client.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            {client.projects}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-mono">{client.billableHours}h</td>
                                    <td className="px-6 py-4 text-right text-emerald-600 font-mono font-medium">${client.billedAmt.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-amber-600 font-mono font-medium">${client.pendingAmt.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {client.status}
                                        </span>
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

export default ClientSummaryReport;
