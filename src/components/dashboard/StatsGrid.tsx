import React from 'react';
import KPICard from './KPICard';
import { Clock, AlertTriangle, DollarSign, Zap, PieChart, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';

const StatsGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Row 1: Hours & Productivity */}
            <KPICard
                title="Total Hours (Month)"
                value="1,248h"
                trend="12% vs last month"
                trendUp={true}
                icon={Clock}
            />

            <KPICard
                title="Billable %"
                value="79%"
                subValue="986 h Billable"
                trend="5%"
                trendUp={true}
                icon={Zap}
            />

            <KPICard
                title="Employee Utilization"
                value="82%"
                subValue="Target: 85%"
                trend="2%"
                trendUp={false}
                icon={TrendingUp}
            />

            <KPICard
                title="Pending Approvals"
                value="14"
                subValue="Timesheets to review"
                trend="High"
                trendUp={false}
                className="border-l-4 border-l-amber-500"
                icon={AlertCircle}
            />

            {/* Row 2: Financials & Projects */}
            <KPICard
                title="Total Revenue"
                value="$48,500"
                subValue="Billable Amount"
                trend="8%"
                trendUp={true}
                icon={DollarSign}
            />

            <KPICard
                title="Total Cost"
                value="$32,100"
                subValue="Employee Costs"
                trend="Stable"
                trendUp={true}
                icon={PieChart}
            />

            <KPICard
                title="Active Projects"
                value="12"
                subValue="2 Near Deadline"
                trend="3 New"
                trendUp={true}
                icon={Briefcase}
            />

            <KPICard
                title="Over-Budget Alerts"
                value="3"
                subValue="Projects exceeded budget"
                trend="Critical"
                trendUp={false}
                className="border-l-4 border-l-red-500"
                icon={AlertTriangle}
            />
        </div>
    );
};

export default StatsGrid;
