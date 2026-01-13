import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { name: 'Skyline Tower', planned: 1200, actual: 850 },
    { name: 'Riverside Mall', planned: 800, actual: 720 },
    { name: 'City Bridge', planned: 2500, actual: 450 },
    { name: 'Lakeside Villa', planned: 150, actual: 160 }, // Over budget
];

const ProjectBudgetBurnChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Project Budget Burn (Hours)</h3>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} interval={0} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Bar dataKey="planned" fill="#e2e8f0" name="Planned Budget" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#3b82f6" name="Actual Used" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProjectBudgetBurnChart;
