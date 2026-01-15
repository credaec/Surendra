import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockBackend } from '../../services/mockBackend';
import type { TimeEntry } from '../../types/schema';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';

const HoursTrendChart: React.FC = () => {
    const data = useMemo(() => {
        const entries: TimeEntry[] = mockBackend.getEntries(); // Get all entries
        const now = new Date();
        const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const end = endOfWeek(now, { weekStartsOn: 1 });

        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const dayEntries = entries.filter(e => isSameDay(parseISO(e.date || new Date().toISOString()), day));
            const total = dayEntries.reduce((sum, e) => sum + e.durationMinutes, 0) / 60; // Minutes to hours
            const billable = dayEntries.filter(e => e.isBillable).reduce((sum, e) => sum + e.durationMinutes, 0) / 60;

            return {
                name: format(day, 'EEE'),
                total: Math.round(total * 10) / 10,
                billable: Math.round(billable * 10) / 10
            };
        });
    }, []);
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

            <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
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
