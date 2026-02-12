import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { backendService } from '../../services/backendService';
import { useTheme } from '../../context/ThemeContext';

const ProjectBudgetBurnChart: React.FC = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const loadData = () => {
            const projects = backendService.getProjects();
            const entries = backendService.getEntries();
            const activeProjects = projects.filter(p => p.status === 'ACTIVE');

            const data = activeProjects.map(project => {
                const projectEntries = entries.filter(e => e.projectId === project.id && e.status !== 'REJECTED');
                // Calculate actual hours used
                const actualHours = projectEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0) / 60;

                // Determine planned/budget hours
                const plannedHours = project.estimatedHours || (project.budgetAmount ? project.budgetAmount / 50 : 0) || 0;

                return {
                    name: project.name.split(' ').slice(0, 2).join(' '), // Shorten name
                    planned: Math.round(plannedHours),
                    actual: Math.round(actualHours)
                };
            }).filter(item => item.planned > 0 || item.actual > 0) // Only show relevant projects
                .sort((a, b) => b.planned - a.planned) // Sort by biggest projects
                .slice(0, 5); // Top 5

            setChartData(data);
        };

        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
    // Improved visibility: Slate-600 for dark mode, Slate-300 for light mode
    const barBaseColor = isDarkMode ? '#475569' : '#cbd5e1';

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-96 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Project Budget Burn (Hours)</h3>

            <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} interval={0} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} />
                        <Tooltip
                            cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                                borderRadius: '12px',
                                border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
                                color: isDarkMode ? '#fff' : '#000'
                            }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: textColor }} />
                        <Bar dataKey="planned" fill={barBaseColor} name="Planned Budget" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#3b82f6" name="Actual Used" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProjectBudgetBurnChart;

