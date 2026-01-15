import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockBackend } from '../../services/mockBackend';
import type { TimeEntry } from '../../types/schema';

const UtilizationChart: React.FC = () => {
    const { data, utilization } = useMemo(() => {
        const entries: TimeEntry[] = mockBackend.getEntries();
        const totalMinutes = entries.reduce((acc, curr) => acc + curr.durationMinutes, 0);
        const billableMinutes = entries.filter(e => e.isBillable).reduce((acc, curr) => acc + curr.durationMinutes, 0);
        const nonBillableMinutes = totalMinutes - billableMinutes;

        // Convert to hours for display
        const billableHours = Math.round(billableMinutes / 60);
        const nonBillableHours = Math.round(nonBillableMinutes / 60);

        const chartData = [
            { name: 'Billable', value: billableHours, color: '#3b82f6' }, // Blue
            { name: 'Non-Billable', value: nonBillableHours, color: '#94a3b8' }, // Slate
        ];

        const utilPct = totalMinutes > 0 ? Math.round((billableMinutes / totalMinutes) * 100) : 0;

        return { data: chartData, utilization: utilPct };
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Billable vs Non-Billable</h3>

            <div className="h-64 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center mt-[-140px] pointer-events-none mb-[110px]">
                <div className="text-3xl font-bold text-slate-800">{utilization}%</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Utilization</div>
            </div>
        </div>
    );
};

export default UtilizationChart;
