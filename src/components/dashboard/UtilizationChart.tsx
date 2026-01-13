import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Billable', value: 986, color: '#3b82f6' }, // Blue
    { name: 'Non-Billable', value: 262, color: '#94a3b8' }, // Slate
];

const UtilizationChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Billable vs Non-Billable</h3>

            <div className="h-64 w-full">
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
                <div className="text-3xl font-bold text-slate-800">79%</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Utilization</div>
            </div>
        </div>
    );
};

export default UtilizationChart;
