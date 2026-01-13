import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', total: 140, billable: 110 },
    { name: 'Tue', total: 155, billable: 130 },
    { name: 'Wed', total: 138, billable: 120 },
    { name: 'Thu', total: 162, billable: 140 },
    { name: 'Fri', total: 145, billable: 115 },
    { name: 'Sat', total: 40, billable: 20 },
    { name: 'Sun', total: 25, billable: 10 },
];

const HoursTrendChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Hours Trend (This Week)</h3>
                <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-1">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                </select>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBillable" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            itemStyle={{ color: '#1e293b' }}
                        />
                        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Total Hours" />
                        <Area type="monotone" dataKey="billable" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBillable)" name="Billable Hours" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HoursTrendChart;
