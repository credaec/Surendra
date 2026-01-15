import React from 'react';
import { Clock } from 'lucide-react';

interface TodaySummaryCardProps {
    dailyTotal: number; // minutes
    billable: number; // minutes
    nonBillable: number; // minutes
}

const TodaySummaryCard: React.FC<TodaySummaryCardProps> = ({ dailyTotal, billable, nonBillable }) => {
    const hours = Math.floor(dailyTotal / 60);
    const minutes = dailyTotal % 60;

    const billableH = Math.floor(billable / 60);
    const billableM = billable % 60;

    const nonBillableH = Math.floor(nonBillable / 60);
    const nonBillableM = nonBillable % 60;

    const goal = 480; // 8 hours in minutes
    const progress = Math.min((dailyTotal / goal) * 100, 100);
    const onTarget = dailyTotal >= (goal * 0.9); // simplistic "on target"

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" /> Today Summary
                </h3>
            </div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-slate-900">{hours}<span className="text-xl font-normal text-slate-500">h</span> {minutes}<span className="text-xl font-normal text-slate-500">m</span></span>
                <div className="text-right">
                    <div className={`text-xs font-bold uppercase tracking-wide ${onTarget ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {onTarget ? 'On Target' : 'Keep Going'}
                    </div>
                    <div className="text-[10px] text-slate-400">8h Goal</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className={`h-full rounded-full ${onTarget ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <div className="text-xs text-slate-500 mb-0.5">Billable</div>
                    <div className="font-semibold text-slate-900">{billableH}h {billableM}m</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 mb-0.5">Non-billable</div>
                    <div className="font-semibold text-slate-900">{nonBillableH}h {nonBillableM}m</div>
                </div>
            </div>

            <div className="mt-4 text-[11px] text-center text-slate-400 bg-slate-50 py-2 rounded">
                Submit weekly timesheet from Timesheet page.
            </div>
        </div>
    );
};

export default TodaySummaryCard;
