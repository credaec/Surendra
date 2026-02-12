import React, { useEffect, useState } from 'react';
import KPICard from './KPICard';
import { Clock, AlertTriangle, DollarSign, Zap, PieChart, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { backendService } from '../../services/backendService';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const StatsGrid: React.FC = () => {
    const [stats, setStats] = useState({
        totalHours: 0,
        billablePercentage: 0,
        billableHours: 0,
        pendingApprovals: 0,
        totalRevenue: 0,
        totalCost: 0,
        activeProjects: 0,
        overBudgetCount: 0
    });

    useEffect(() => {
        const calculateStats = () => {
            const projects = backendService.getProjects();
            const entries = backendService.getEntries();
            const users = backendService.getUsers();

            // 1. Time Stats (Current Month)
            const now = new Date();
            const monthStart = startOfMonth(now);
            const monthEnd = endOfMonth(now);

            let monthTotalMinutes = 0;
            let monthBillableMinutes = 0;
            let totalCostVal = 0;

            entries.forEach(entry => {
                if (entry.status === 'REJECTED') return;

                const entryDate = parseISO(entry.date);
                if (isWithinInterval(entryDate, { start: monthStart, end: monthEnd })) {
                    monthTotalMinutes += entry.durationMinutes;
                    if (entry.isBillable) {
                        monthBillableMinutes += entry.durationMinutes;
                    }

                    // Cost Calculation
                    const user = users.find(u => u.id === entry.userId);
                    const costRate = user?.hourlyCostRate || 50; // Fallback to $50/hr
                    totalCostVal += (entry.durationMinutes / 60) * costRate;
                }
            });

            const totalHours = Math.round(monthTotalMinutes / 60);
            const billableHours = Math.round(monthBillableMinutes / 60);
            const billablePercentage = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;

            // 2. Project Stats
            const activeProjs = projects.filter(p => p.status === 'ACTIVE');
            const totalProjectValue = activeProjs.reduce((acc, p) => acc + (p.budgetAmount || 0), 0);

            // 3. Approvals
            const pendingParams = entries.filter(e => e.status === 'SUBMITTED').length;

            // 4. Over Budget Calculation
            let overBudget = 0;
            activeProjs.forEach(proj => {
                const projEntries = entries.filter(e => e.projectId === proj.id && e.isBillable);
                const usedHours = projEntries.reduce((acc, e) => acc + e.durationMinutes, 0) / 60;
                // Simple check: if used hours > estimated hours (if budget is hours) or some simplified logic
                // Using budgetAmount vs calculated value would be better but keeping simple:
                // If used > 80% of estimated hours
                if (proj.estimatedHours > 0 && usedHours > proj.estimatedHours) {
                    overBudget++;
                }
            });

            setStats({
                totalHours,
                billablePercentage,
                billableHours,
                pendingApprovals: pendingParams,
                totalRevenue: totalProjectValue,
                totalCost: Math.round(totalCostVal),
                activeProjects: activeProjs.length,
                overBudgetCount: overBudget
            });
        };

        calculateStats();
        // Set an interval to refresh stats periodically
        const interval = setInterval(calculateStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Row 1: Hours & Productivity */}
            <KPICard
                title="Total Hours (Month)"
                value={`${stats.totalHours.toLocaleString()}h`}
                trend="Live"
                trendUp={true}
                icon={Clock}
            />

            <KPICard
                title="Billable %"
                value={`${stats.billablePercentage}%`}
                subValue={`${stats.billableHours}h Billable`}
                trend="Target: 80%"
                trendUp={stats.billablePercentage >= 80}
                icon={Zap}
            />

            <KPICard
                title="Employee Utilization"
                value={`${stats.billablePercentage}%`} // Using same metric for demo complexity reduction, real utilization needs capacity
                subValue="Target: 85%"
                trend="Stable"
                trendUp={true}
                icon={TrendingUp}
            />

            <KPICard
                title="Pending Approvals"
                value={stats.pendingApprovals.toString()}
                subValue="Timesheets to review"
                trend={stats.pendingApprovals > 5 ? 'High' : 'Normal'}
                trendUp={false}
                className={stats.pendingApprovals > 0 ? "border-l-4 border-l-amber-500" : ""}
                icon={AlertCircle}
            />

            {/* Row 2: Financials & Projects */}
            <KPICard
                title="Total Project Value"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                subValue="Active Budgets"
                trend="Pipeline"
                trendUp={true}
                icon={DollarSign}
            />

            <KPICard
                title="Total Cost"
                value={`$${stats.totalCost.toLocaleString()}`}
                subValue="Employee Costs (Est)"
                trend="Month to Date"
                trendUp={true}
                icon={PieChart}
            />

            <KPICard
                title="Active Projects"
                value={stats.activeProjects.toString()}
                subValue="Ongoing"
                trend="Live"
                trendUp={true}
                icon={Briefcase}
            />

            <KPICard
                title="Over-Budget Alerts"
                value={stats.overBudgetCount.toString()}
                subValue="Exceeded estimates"
                trend="Critical"
                trendUp={false}
                className={stats.overBudgetCount > 0 ? "border-l-4 border-l-red-500" : ""}
                icon={AlertTriangle}
            />
        </div>
    );
};

export default StatsGrid;

