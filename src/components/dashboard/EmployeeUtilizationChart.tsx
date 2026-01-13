import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Alice', utilization: 92 },
    { name: 'Bob', utilization: 85 },
    { name: 'Charlie', utilization: 78 },
    { name: 'Diana', utilization: 65 },
    { name: 'Ethan', utilization: 88 },
    { name: 'Fiona', utilization: 72 },
];

const EmployeeUtilizationChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Employee Utilization %</h3>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={20} name="Utilization %">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.utilization < 70 ? '#f59e0b' : entry.utilization < 50 ? '#ef4444' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EmployeeUtilizationChart;
