import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ReportsHeaderProps {
    onExport: (type: 'PDF' | 'EXCEL' | 'CSV') => void;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ onExport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (type: 'PDF' | 'EXCEL' | 'CSV') => {
        onExport(type);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden relative z-30">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your hours, billable ratio, and productivity</p>
            </div>

            <div className="flex items-center space-x-3">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm ${isOpen ? 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        <Download className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                        Export Report
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="py-1">
                                <button
                                    onClick={() => handleOptionClick('PDF')}
                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                                >
                                    <FileText className="h-4 w-4 mr-3 text-red-500" /> Download as PDF
                                </button>
                                <button
                                    onClick={() => handleOptionClick('EXCEL')}
                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                                >
                                    <FileSpreadsheet className="h-4 w-4 mr-3 text-green-600" /> Export to Excel
                                </button>
                                <button
                                    onClick={() => handleOptionClick('CSV')}
                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                                >
                                    <FileText className="h-4 w-4 mr-3 text-blue-500" /> Export to CSV
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsHeader;
