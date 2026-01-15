import React from 'react';
import { Clock, CheckCircle2, DollarSign, Ban } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface KPICardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: React.ElementType;
    iconColor: string;
    trend?: string; // e.g. "+5% vs last week"
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subValue, icon: Icon, iconColor, trend }) => (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-28">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            </div>
            <div className={cn("p-2 rounded-lg bg-opacity-10", iconColor.replace("text-", "bg-"))}>
                <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
        </div>
        {(subValue || trend) && (
            <div className="flex items-center text-xs mt-2">
                {subValue && <span className="text-slate-600 font-medium mr-2">{subValue}</span>}
                {trend && <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{trend}</span>}
            </div>
        )}
    </div>
);

interface ReportsKPICardsProps {
    stats: {
        totalHours: number;
        billableHours: number;
        billablePercentage: number;
        nonBillableHours: number;
        productivity: number;
    };
}

const ReportsKPICards: React.FC<ReportsKPICardsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
                title="Total Hours"
                value={`${stats.totalHours.toFixed(1)}h`}
                trend="+12% vs last month" // Placeholder for trend
                icon={Clock}
                iconColor="text-blue-600"
            />
            <KPICard
                title="Billable Hours"
                value={`${stats.billableHours.toFixed(1)}h`}
                subValue={`${stats.billablePercentage.toFixed(0)}% of total`}
                icon={DollarSign}
                iconColor="text-emerald-600"
            />
            <KPICard
                title="Non-Billable"
                value={`${stats.nonBillableHours.toFixed(1)}h`}
                subValue="Training & Internal"
                icon={Ban}
                iconColor="text-amber-600"
            />
            <KPICard
                title="Productivity"
                value={`${stats.productivity.toFixed(0)}%`}
                subValue="Target: 90%"
                icon={CheckCircle2}
                iconColor="text-purple-600"
            />
        </div>
    );
};

export default ReportsKPICards;
