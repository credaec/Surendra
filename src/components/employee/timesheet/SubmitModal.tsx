import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    validationErrors: string[];
    weekRange?: string;
    totalHours?: number;
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onConfirm, validationErrors, weekRange, totalHours }) => {
    if (!isOpen) return null;

    const hasErrors = validationErrors.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${hasErrors ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                        {hasErrors ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {hasErrors ? 'Submission Blocked' : 'Submit Timesheet?'}
                        </h3>
                        {!hasErrors && weekRange && (
                            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                <span className="font-semibold">{weekRange}</span>
                                {totalHours !== undefined && <span> • {totalHours} Hours</span>}
                            </div>
                        )}

                        {hasErrors ? (
                            <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
                                <p className="font-semibold mb-1">Please fix the following issues:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    {validationErrors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                Are you sure you want to submit your timesheet for approval?
                                Once submitted, you cannot make changes directly. You will need to use "Request Edit".
                            </p>
                        )}

                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    {!hasErrors && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm shadow-blue-200 dark:shadow-none transition-colors"
                        >
                            Confirm & Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmitModal;
