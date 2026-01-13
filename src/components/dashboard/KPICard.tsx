import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils'; // Adjust path if needed

interface KPICardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean; // true for positive (green), false for negative (red)
    icon: LucideIcon;
    subValue?: string;
    className?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendUp, icon: Icon, subValue, className }) => {
    return (
        <div className={cn("p-6 bg-white rounded-xl shadow-sm border border-slate-100", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-lg bg-blue-50 text-blue-600 transition-colors")}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {(trend || subValue) && (
                <div className="mt-4 flex items-center text-sm">
                    {trend && (
                        <span className={cn("font-medium mr-2", trendUp ? "text-emerald-600" : "text-rose-600")}>
                            {trendUp ? '↑' : '↓'} {trend}
                        </span>
                    )}
                    {subValue && (
                        <span className="text-slate-400">{subValue}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default KPICard;
