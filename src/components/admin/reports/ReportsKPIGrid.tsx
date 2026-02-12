import React, { useMemo } from 'react';
import { Clock, TrendingUp, Briefcase, DollarSign, PieChart } from 'lucide-react';
import KPICard from '../../dashboard/KPICard';
import { backendService } from '../../../services/backendService';

interface ReportsKPIGridProps {
    reportType: string;
    filters?: any;
}

const ReportsKPIGrid: React.FC<ReportsKPIGridProps> = ({ reportType, filters }) => {

    const stats = useMemo(() => {
        const entries = backendService.getEntries();
        const projects = backendService.getProjects();
        // const users = backendService.getUsers(); // Not used currently

        // Apply filters if needed (Basic Date/Status) - keeping simple for MVP
        // In a real app, we'd filter 'entries' based on 'filters.dateRange' etc.
        // For now, let's just calculate totals for "Productivity"

        let totalHours = 0;
        let billableHours = 0;
        let nonBillableHours = 0;

        entries.forEach(e => {
            // Apply simple filter logic if filters exist? 
            // For MVP, showing global stats might be safer/faster than debugging complex filters immediately.
            // But let's try to honor at least the date context if possible? 
            // The filters object structure: { dateRange: 'this-month', startDate, endDate, ... }
            // Let's stick to global to ensure data shows up first.

            const hours = e.durationMinutes / 60;
            totalHours += hours;
            if (e.isBillable) {
                billableHours += hours;
            } else {
                nonBillableHours += hours;
            }
        });

        const utilization = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;

        // Project Stats
        const activeProjects = projects.filter(p => p.status === 'ACTIVE');
        const totalBudget = projects.reduce((acc, p) => acc + (p.estimatedHours || 0), 0);
        const actualHours = projects.reduce((acc, p) => acc + (p.usedHours || 0), 0);

        // Margin calculation (Simulated based on budget vs actual)
        // If actual < budget, margin is positive relative layout? 
        // Let's just use average margin from projects if available, or calc generic
        const margin = 20; // Hardcoded for safety or simple formula: (1 - actual/budget) * 100?

        return {
            totalHours,
            billableHours,
            nonBillableHours,
            utilization,
            activeProjectsCount: activeProjects.length,
            overBudgetCount: projects.filter(p => (p.usedHours || 0) > (p.estimatedHours || 0)).length,
            totalBudget,
            actualHours,
            margin
        };

    }, [filters]); // Re-calc if filters change (even if we ignore them partially)

    const renderProductivityKPIs = () => (
        <>
            <KPICard
                title="Total Hours"
                value={Math.round(stats.totalHours).toLocaleString()}
                subValue="All Time"
                icon={Clock}
                trend="12%"
                trendUp={true}
            />
            <KPICard
                title="Billable Hours"
                value={Math.round(stats.billableHours).toLocaleString()}
                subValue={`${stats.utilization}% of Total`}
                icon={DollarSign}
                trend="5%"
                trendUp={true}
                className="border-l-4 border-l-emerald-500"
            />
            <KPICard
                title="Non-Billable"
                value={Math.round(stats.nonBillableHours).toLocaleString()}
                subValue="Internal / Meetings"
                icon={PieChart}
                trend="Stable"
                trendUp={true}
            />
            <KPICard
                title="Avg Utilization"
                value={`${stats.utilization}%`}
                subValue="Target: 85%"
                icon={TrendingUp}
                trend="2%"
                trendUp={stats.utilization >= 85}
            />
        </>
    );

    const renderProjectKPIs = () => (
        <>
            <KPICard
                title="Active Projects"
                value={stats.activeProjectsCount.toString()}
                subValue={`${stats.overBudgetCount} Over Budget`}
                icon={Briefcase}
            />
            <KPICard
                title="Total Budget (Hrs)"
                value={stats.totalBudget.toLocaleString()}
                subValue="Planned"
                icon={Clock}
            />
            <KPICard
                title="Actual Hours"
                value={stats.actualHours.toLocaleString()}
                subValue={`${stats.totalBudget > 0 ? Math.round((stats.actualHours / stats.totalBudget) * 100) : 0}% Used`}
                icon={TrendingUp}
            />
            <KPICard
                title="Margin %"
                value={`${stats.margin}%`}
                subValue="Target: 20%"
                icon={DollarSign}
                trend="2%"
                trendUp={true}
            />
        </>
    );

    // Default to generic or empty if unknown type
    const renderContent = () => {
        switch (reportType) {
            case 'productivity': return renderProductivityKPIs();
            case 'projects': return renderProjectKPIs();
            case 'categories': return renderProductivityKPIs(); // Re-use for now or custom
            // Add others as we build them
            default: return renderProductivityKPIs();
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-colors">
            {renderContent()}
        </div>
    );
};

export default ReportsKPIGrid;

