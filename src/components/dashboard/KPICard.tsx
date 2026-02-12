import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    subValue?: string;
    className?: string; // Additional classes
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendUp, icon: Icon, subValue, className }) => {
    return (
        <div className={cn(
            "p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl group",
            className
        )}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</p>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                        trendUp ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}>
                        {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</h3>
                    {subValue && (
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide opacity-80">{subValue}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KPICard;
