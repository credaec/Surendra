import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ArrowRight, Briefcase, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import KPICard from '../../../dashboard/KPICard';
import { backendService } from '../../../../services/backendService';
import { useTheme } from '../../../../context/ThemeContext';

const ClientSummaryReport: React.FC<any> = ({ filters }) => {
    const { isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredData = React.useMemo(() => {
        const invoices = backendService.getInvoices();
        const projects = backendService.getProjects();

        // Group by Client
        const clientMap = new Map<string, any>();

        projects.forEach(p => {
            if (!clientMap.has(p.clientId)) {
                clientMap.set(p.clientId, {
                    id: p.clientId,
                    name: p.clientName,
                    projects: 0,
                    billableHours: 0, // Need entries for this, skipping for MVP or simple Sum
                    billedAmt: 0,
                    pendingAmt: 0,
                    status: 'Active',
                    projectIds: []
                });
            }
            const c = clientMap.get(p.clientId);
            c.projects += 1;
            c.projectIds.push(p.id);
        });

        // Calculate financials from Invoices
        invoices.forEach(inv => {
            if (!clientMap.has(inv.clientId)) {
                clientMap.set(inv.clientId, {
                    id: inv.clientId,
                    name: inv.clientName,
                    projects: 0,
                    billableHours: 0,
                    billedAmt: 0,
                    pendingAmt: 0,
                    status: 'Active',
                    projectIds: []
                });
            }
            const c = clientMap.get(inv.clientId);
            c.billedAmt += inv.totalAmount;
            c.pendingAmt += inv.balanceAmount;
        });

        return Array.from(clientMap.values()).filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClient = !filters.client || c.id === filters.client;
            const matchesProject = !filters.project || c.projectIds.includes(filters.project);
            const matchesStatus = !filters.status || filters.status === 'all' || c.status === filters.status;

            return matchesSearch && matchesClient && matchesProject && matchesStatus;
        });
    }, [searchQuery, filters]);

    // Calculate dynamic KPIs from filteredData
    const stats = React.useMemo(() => {
        const totalClients = filteredData.length;
        const totalProjects = filteredData.reduce((acc, curr) => acc + curr.projects, 0);
        const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.billedAmt, 0);
        const totalPending = filteredData.reduce((acc, curr) => acc + curr.pendingAmt, 0);

        return { totalClients, totalProjects, totalRevenue, totalPending };
    }, [filteredData]);

    const chartData = filteredData.map(c => ({
        name: c.name,
        amount: c.billedAmt,
    }));

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#1e293b' : '#e2e8f0';
    const tooltipBg = isDarkMode ? '#0f172a' : '#fff';
    const tooltipBorder = isDarkMode ? '#1e293b' : '#e2e8f0';

    return (
        <div className="space-y-6">

            {/* Top Section: Dynamic KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Active Clients"
                    value={stats.totalClients.toString()}
                    subValue="Filtered View"
                    icon={Briefcase}
                />
                <KPICard
                    title="Total Projects"
                    value={stats.totalProjects.toString()}
                    subValue="Across Clients"
                    icon={PieChart}
                />
                <KPICard
                    title="Total Revenue"
                    value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
                    subValue="Billed Amount"
                    icon={DollarSign}
                    trendUp={true}
                />
                <KPICard
                    title="Pending Payments"
                    value={`$${(stats.totalPending / 1000).toFixed(1)}k`}
                    subValue="Outstanding"
                    icon={TrendingUp}
                />
            </div>

            {/* Middle Section: Revenue Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Revenue by Client</h3>
                <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    borderRadius: '12px',
                                    border: `1px solid ${tooltipBorder}`,
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: isDarkMode ? '#f8fafc' : '#0f172a'
                                }}
                                formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Billed Revenue']}
                                itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                            />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section: Client List Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Client Portfolio</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4 text-center">Projects</th>
                                <th className="px-6 py-4 text-right">Billable Hours</th>
                                <th className="px-6 py-4 text-right">Total Billed</th>
                                <th className="px-6 py-4 text-right">Pending Invoice</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((client) => (
                                    <tr
                                        key={client.id}
                                        onClick={() => filters.onViewDetail && filters.onViewDetail('client', client.id, client.name)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 text-xs font-bold">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                                {client.projects}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 font-mono">{client.billableHours}h</td>
                                        <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-mono font-medium">${client.billedAmt.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-amber-600 dark:text-amber-400 font-mono font-medium">${client.pendingAmt.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${client.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-500 font-medium">
                                        No clients found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientSummaryReport;

