import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockBackend } from '../../services/mockBackend';
import type { TimeEntry } from '../../types/schema';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO, subWeeks, startOfMonth, endOfMonth } from 'date-fns';

const HoursTrendChart: React.FC = () => {
    const [timeRange, setTimeRange] = React.useState<'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH'>('THIS_WEEK');

    const data = useMemo(() => {
        const entries: TimeEntry[] = mockBackend.getEntries();
        const now = new Date();
        let start, end;

        switch (timeRange) {
            case 'LAST_WEEK':
                start = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                end = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                break;
            case 'THIS_MONTH':
                start = startOfMonth(now);
                end = endOfMonth(now);
                break;
            case 'THIS_WEEK':
            default:
                start = startOfWeek(now, { weekStartsOn: 1 });
                end = endOfWeek(now, { weekStartsOn: 1 });
                break;
        }

        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const dayEntries = entries.filter(e => isSameDay(parseISO(e.date || new Date().toISOString()), day));
            const total = dayEntries.reduce((sum, e) => sum + e.durationMinutes, 0) / 60;
            const billable = dayEntries.filter(e => e.isBillable).reduce((sum, e) => sum + e.durationMinutes, 0) / 60;

            const name = timeRange === 'THIS_MONTH' ? format(day, 'dd') : format(day, 'EEE');

            return {
                name,
                total: Math.round(total * 10) / 10,
                billable: Math.round(billable * 10) / 10,
                fullDate: format(day, 'PP')
            };
        });
    }, [timeRange]);

    const getTitle = () => {
        switch (timeRange) {
            case 'LAST_WEEK': return 'Hours Trend (Last Week)';
            case 'THIS_MONTH': return 'Hours Trend (This Month)';
            default: return 'Hours Trend (This Week)';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">{getTitle()}</h3>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-1"
                >
                    <option value="THIS_WEEK">This Week</option>
                    <option value="LAST_WEEK">Last Week</option>
                    <option value="THIS_MONTH">This Month</option>
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
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} interval={timeRange === 'THIS_MONTH' ? 2 : 0} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            itemStyle={{ color: '#1e293b' }}
                            labelFormatter={(label, payload) => payload[0]?.payload.fullDate || label}
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
