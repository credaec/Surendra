import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { backendService } from '../../services/backendService';
import type { TimeEntry } from '../../types/schema';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO, subWeeks, startOfMonth, endOfMonth } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import { Clock } from 'lucide-react';

const HoursTrendChart: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [timeRange, setTimeRange] = React.useState<'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH'>('THIS_WEEK');

    const data = useMemo(() => {
        const entries: TimeEntry[] = backendService.getEntries().filter(e => e.status !== 'REJECTED');
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
            case 'LAST_WEEK': return 'Last Week';
            case 'THIS_MONTH': return 'This Month';
            default: return 'This Week';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Hours Trend</h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{getTitle()}</p>
                    </div>
                </div>

                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="text-xs font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-2 pl-3 pr-8 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <option value="THIS_WEEK">This Week</option>
                    <option value="LAST_WEEK">Last Week</option>
                    <option value="THIS_MONTH">This Month</option>
                </select>
            </div>

            <div className="h-80 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBillable" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                            interval={timeRange === 'THIS_MONTH' ? 3 : 0}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                                borderRadius: '1rem',
                                border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{
                                color: isDarkMode ? '#f8fafc' : '#0f172a',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                            labelStyle={{
                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                marginBottom: '0.25rem',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '900'
                            }}
                            labelFormatter={(label, payload) => payload[0]?.payload.fullDate || label}
                        />
                        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" name="Total Hours" activeDot={{ r: 6, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="billable" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorBillable)" name="Billable Hours" activeDot={{ r: 6, strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HoursTrendChart;
