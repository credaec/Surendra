import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { backendService } from '../../services/backendService';
import { useTheme } from '../../context/ThemeContext';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { X, ExternalLink } from 'lucide-react';

const EmployeeUtilizationChart: React.FC = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullData, setFullData] = useState<any[]>([]);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const loadData = () => {
            const users = backendService.getUsers().filter(u => u.name !== 'Admin User');
            const entries = backendService.getEntries();
            const now = new Date();
            const monthStart = startOfMonth(now);
            const monthEnd = endOfMonth(now);

            // Assume standard working hours per month is 160h
            const STANDARD_CAPACITY = 160;

            const data = users.map(user => {
                // Get user's entries for this month
                const userEntries = entries.filter(e =>
                    e.userId === user.id &&
                    isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd })
                );

                const billableMinutes = userEntries
                    .filter(e => e.isBillable)
                    .reduce((sum, e) => sum + e.durationMinutes, 0);

                const billableHours = billableMinutes / 60;

                // Utilization = Billable Hours / Capacity * 100
                // Default capacity 160h
                const utilization = Math.round((billableHours / STANDARD_CAPACITY) * 100);

                return {
                    name: user.name, // Full name for details
                    shortName: user.name.split(' ')[0], // First name only for chart
                    utilization: utilization > 100 ? 100 : utilization, // Cap at 100 for viz if needed, or allow over,
                    rawUtilization: utilization,
                    billableHours: Math.round(billableHours),
                    totalCapacity: STANDARD_CAPACITY,
                    designation: user.designation
                };
            }).sort((a, b) => b.utilization - a.utilization); // Highest utilization first

            setFullData(data); // Store all data
            setChartData(data.slice(0, 6)); // Top 6 for chart
        };

        loadData();
        const interval = setInterval(loadData, 5000); // 5s poll
        return () => clearInterval(interval);
    }, []);

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

    return (
        <>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-96 flex flex-col transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Employee Utilization %</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
                    >
                        View All <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                </div>

                <div className="h-full w-full" style={{ minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="shortName" type="category" axisLine={false} tickLine={false} width={60} tick={{ fill: textColor, fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: isDarkMode ? '#1e293b' : '#f1f5f9' }}
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                    borderRadius: '12px',
                                    border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: isDarkMode ? '#f8fafc' : '#0f172a'
                                }}
                                itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                            />
                            <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={20} name="Utilization %">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.utilization < 50 ? '#f59e0b' : entry.utilization < 20 ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* View All Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Employee Utilization Report</h3>
                                <p className="text-sm text-slate-500 mt-1">Full breakdown of billable hours vs capacity (160h) for this month.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-4">
                            {fullData.map((emp) => (
                                <div key={emp.name} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                        {emp.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-semibold text-slate-900 truncate">{emp.name}</h4>
                                            <span className={
                                                `text-sm font-bold ${emp.utilization >= 80 ? 'text-emerald-600' : emp.utilization >= 50 ? 'text-amber-600' : 'text-red-600'}`
                                            }>
                                                {emp.utilization}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${emp.utilization >= 80 ? 'bg-emerald-500' : emp.utilization >= 50 ? 'bg-amber-400' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${emp.utilization}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>{emp.designation}</span>
                                            <span>{emp.billableHours} / {emp.totalCapacity} hrs</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployeeUtilizationChart;

