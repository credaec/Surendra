import React from 'react';
import { Clock, TrendingUp, DollarSign, CalendarCheck } from 'lucide-react';
import { cn } from '../../../lib/utils';

const KPIStats: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {/* Card 1: Today Logged */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Today Logged</p>
                    <div className="text-2xl font-bold text-slate-900">3h 40m</div>
                    <p className="text-xs text-slate-400 mt-1">Target 8h</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock className="h-5 w-5" />
                </div>
            </div>

            {/* Card 2: This Week */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">This Week</p>
                    <div className="text-2xl font-bold text-slate-900">26h 15m</div>
                    <p className="text-xs text-slate-400 mt-1">Mon–Sun total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                </div>
            </div>

            {/* Card 3: Billable % */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Billable %</p>
                    <div className="text-2xl font-bold text-slate-900">69%</div>
                    <p className="text-xs text-slate-400 mt-1">Billable vs Total</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <DollarSign className="h-5 w-5" />
                </div>
            </div>

            {/* Card 4: Timesheet Status */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Timesheet Status</p>
                    <CalendarCheck className="h-5 w-5 text-purple-600" />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        Draft
                    </span>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        View
                    </button>
                </div>
            </div>

        </div>
    );
};

export default KPIStats;
