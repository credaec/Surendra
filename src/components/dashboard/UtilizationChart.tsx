import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { backendService } from '../../services/backendService';
import type { TimeEntry } from '../../types/schema';
import { useTheme } from '../../context/ThemeContext';

const UtilizationChart: React.FC = () => {
    const { isDarkMode } = useTheme();

    const { data, utilization } = useMemo(() => {
        const entries: TimeEntry[] = backendService.getEntries().filter(e => e.status !== 'REJECTED');
        const totalMinutes = entries.reduce((acc, curr) => acc + curr.durationMinutes, 0);
        const billableMinutes = entries.filter(e => e.isBillable).reduce((acc, curr) => acc + curr.durationMinutes, 0);
        const nonBillableMinutes = totalMinutes - billableMinutes;

        // Convert to hours for display
        const billableHours = Math.round(billableMinutes / 60);
        const nonBillableHours = Math.round(nonBillableMinutes / 60);

        const chartData = [
            { name: 'Billable', value: billableHours, color: '#3b82f6' }, // Blue-500
            { name: 'Non-Billable', value: nonBillableHours, color: isDarkMode ? '#94a3b8' : '#cbd5e1' }, // Slate-400 (visible) vs Slate-300
        ];

        const utilPct = totalMinutes > 0 ? Math.round((billableMinutes / totalMinutes) * 100) : 0;

        return { data: chartData, utilization: utilPct };
    }, [isDarkMode]);

    const textColor = isDarkMode ? '#f1f5f9' : '#64748b'; // Slate-100 (Bright White) vs Slate-500

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-96 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Billable vs Non-Billable</h3>

            <div className="h-64 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={5}
                        >
                            {data.map((entry, index) => (
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
                            wrapperStyle={{ fontSize: '11px' }}
                            formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center mt-[-162px] pointer-events-none mb-[125px]">
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{utilization}%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Utilization</div>
            </div>
        </div>
    );
};

export default UtilizationChart;

