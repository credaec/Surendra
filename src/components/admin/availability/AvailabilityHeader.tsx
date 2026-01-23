import React from 'react';
import { Download, RefreshCcw, CalendarPlus, UserMinus } from 'lucide-react';

interface AvailabilityHeaderProps {
    onAddHoliday: () => void;
    onMarkLeave: () => void;
    onRefresh: () => void;
    onExport: () => void;
}

const AvailabilityHeader: React.FC<AvailabilityHeaderProps> = ({
    onAddHoliday,
    onMarkLeave,
    onRefresh,
    onExport
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Team Availability</h1>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                    <span>Admin</span>
                    <span className="mx-2">/</span>
                    <span className="text-blue-600 font-medium">Team Availability</span>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={onRefresh}
                    className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </button>

                <button
                    onClick={onAddHoliday}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all text-sm font-medium"
                >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Add Holiday
                </button>

                <button
                    onClick={onMarkLeave}
                    className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md shadow-slate-200 transition-all text-sm font-medium"
                >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Mark Leave
                </button>
            </div>
        </div>
    );
};

export default AvailabilityHeader;
