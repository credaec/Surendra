import React from 'react';
import {
    Download,
    RefreshCcw,
    Settings,
    Calculator,
    Lock
} from 'lucide-react';

interface PayrollHeaderProps {
    onGenerate: () => void;
    onLock: () => void;
    isLocked: boolean;
    onRefresh: () => void;
    onExport: () => void;
    onSettings: () => void;
}

const PayrollHeader: React.FC<PayrollHeaderProps> = ({
    onGenerate,
    onLock,
    isLocked,
    onRefresh,
    onExport,
    onSettings
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Payroll / Costing</h1>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                    <span>Admin</span>
                    <span className="mx-2">/</span>
                    <span>Finance</span>
                    <span className="mx-2">/</span>
                    <span className="text-blue-600 font-medium">Payroll</span>
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

                {!isLocked ? (
                    <button
                        onClick={onGenerate}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all text-sm font-medium"
                    >
                        <Calculator className="h-4 w-4 mr-2" />
                        Generate Payroll
                    </button>
                ) : (
                    <div className="flex items-center px-4 py-2 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 text-sm font-medium cursor-not-allowed">
                        <Lock className="h-4 w-4 mr-2" />
                        Payroll Locked
                    </div>
                )}

                {!isLocked && (
                    <button
                        onClick={onLock}
                        className="flex items-center px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-sm font-medium"
                        title="Lock Payroll Period"
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        Lock Period
                    </button>
                )}

                <button
                    onClick={onSettings}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <Settings className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default PayrollHeader;
