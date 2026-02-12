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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Payroll / Costing</h1>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2">
                    <span>Admin</span>
                    <span className="mx-2 opacity-30">/</span>
                    <span>Finance</span>
                    <span className="mx-2 opacity-30">/</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">Payroll</span>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={onRefresh}
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm"
                >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </button>

                {!isLocked ? (
                    <button
                        onClick={onGenerate}
                        className="flex items-center px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all text-sm font-bold active:scale-95"
                    >
                        <Calculator className="h-4 w-4 mr-2" />
                        Generate Payroll
                    </button>
                ) : (
                    <div className="flex items-center px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold cursor-not-allowed">
                        <Lock className="h-4 w-4 mr-2" />
                        Payroll Locked
                    </div>
                )}

                {!isLocked && (
                    <button
                        onClick={onLock}
                        className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-sm font-bold shadow-sm"
                        title="Lock Payroll Period"
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        Lock Period
                    </button>
                )}

                <button
                    onClick={onSettings}
                    className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <Settings className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default PayrollHeader;
