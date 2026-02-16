import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import { formatDuration } from '../../../lib/utils';

interface ReportsChartsProps {
    trendData: { name: string; hours: number }[];
    pieData: { name: string; value: number; color: string }[];
    trendView: 'day' | 'week';
    onTrendViewChange: (view: 'day' | 'week') => void;
}

const ReportsCharts: React.FC<ReportsChartsProps> = ({ trendData, pieData, trendView, onTrendViewChange }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Chart A: Hours Trend */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Hours Trend</h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => onTrendViewChange('day')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${trendView === 'day' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Day
                        </button>
                        <button
                            onClick={() => onTrendViewChange('week')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${trendView === 'week' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Week
                        </button>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                            />
                            <Tooltip
                                cursor={{ stroke: isDarkMode ? '#334155' : '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                    borderRadius: '12px',
                                    border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: isDarkMode ? '#f8fafc' : '#0f172a'
                                }}
                                itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                                formatter={(value: number) => [formatDuration(value * 60), 'Hours']}
                            />
                            <Area
                                type="monotone"
                                dataKey="hours"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorHours)"
                                activeDot={{ r: 6, strokeWidth: 2, stroke: isDarkMode ? '#0f172a' : '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart B: Billable Split */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Billable vs Non-Billable</h3>
                <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke={isDarkMode ? '#0f172a' : '#fff'}
                                strokeWidth={2}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                    borderRadius: '12px',
                                    border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: isDarkMode ? '#f8fafc' : '#0f172a'
                                }}
                                itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default ReportsCharts;
