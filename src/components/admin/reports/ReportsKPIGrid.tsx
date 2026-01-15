import React from 'react';
import { Clock, TrendingUp, Briefcase, DollarSign, PieChart } from 'lucide-react';
import KPICard from '../../dashboard/KPICard';

interface ReportsKPIGridProps {
    reportType: string;
}

const ReportsKPIGrid: React.FC<ReportsKPIGridProps> = ({ reportType }) => {

    // In a real app, these values would come from props/data based on filters
    // For now, we mock them based on the active tab context

    const renderProductivityKPIs = () => (
        <>
            <KPICard
                title="Total Hours"
                value="1,248"
                subValue="This Month"
                icon={Clock}
                trend="12%"
                trendUp={true}
            />
            <KPICard
                title="Billable Hours"
                value="986"
                subValue="79% of Total"
                icon={DollarSign}
                trend="5%"
                trendUp={true}
                className="border-l-4 border-l-emerald-500"
            />
            <KPICard
                title="Non-Billable"
                value="262"
                subValue="Internal / Meetings"
                icon={PieChart}
                trend="Stable"
                trendUp={true}
            />
            <KPICard
                title="Avg Utilization"
                value="82%"
                subValue="Target: 85%"
                icon={TrendingUp}
                trend="2%"
                trendUp={false}
            />
        </>
    );

    const renderProjectKPIs = () => (
        <>
            <KPICard
                title="Active Projects"
                value="12"
                subValue="2 Over Budget"
                icon={Briefcase}
            />
            <KPICard
                title="Total Budget (Hrs)"
                value="4,500"
                subValue="Planned"
                icon={Clock}
            />
            <KPICard
                title="Actual Hours"
                value="2,150"
                subValue="48% Used"
                icon={TrendingUp}
            />
            <KPICard
                title="Margin %"
                value="22%"
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
            // Add others as we build them
            default: return renderProductivityKPIs();
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {renderContent()}
        </div>
    );
};

export default ReportsKPIGrid;
