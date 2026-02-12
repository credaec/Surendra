import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ReportsHeaderProps {
    onExport: (type: 'PDF' | 'EXCEL' | 'CSV') => void;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ onExport }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your hours, billable ratio, and productivity</p>
            </div>

            <div className="flex items-center space-x-3">
                <div className="relative group">
                    <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <Download className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                        Export Report
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 hidden group-hover:block z-20">
                        <div className="py-1">
                            <button
                                onClick={() => onExport('PDF')}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <FileText className="h-4 w-4 mr-2 text-red-500" /> PDF
                            </button>
                            <button
                                onClick={() => onExport('EXCEL')}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                            </button>
                            <button
                                onClick={() => onExport('CSV')}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <FileText className="h-4 w-4 mr-2 text-blue-500" /> CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsHeader;
