import React from 'react';
import { Clock } from 'lucide-react';

const TodaySummaryCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" /> Today Summary
                </h3>
            </div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-slate-900">3<span className="text-xl font-normal text-slate-500">h</span> 40<span className="text-xl font-normal text-slate-500">m</span></span>
                <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide">On Target</div>
                    <div className="text-[10px] text-slate-400">8h Goal</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <div className="text-xs text-slate-500 mb-0.5">Billable</div>
                    <div className="font-semibold text-slate-900">2h 30m</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 mb-0.5">Non-billable</div>
                    <div className="font-semibold text-slate-900">1h 10m</div>
                </div>
            </div>

            <div className="mt-4 text-[11px] text-center text-slate-400 bg-slate-50 py-2 rounded">
                Submit weekly timesheet from Timesheet page.
            </div>
        </div>
    );
};

export default TodaySummaryCard;
