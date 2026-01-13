import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    validationErrors: string[];
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onConfirm, validationErrors }) => {
    if (!isOpen) return null;

    const hasErrors = validationErrors.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${hasErrors ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {hasErrors ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {hasErrors ? 'Submission Blocked' : 'Submit Timesheet?'}
                        </h3>

                        {hasErrors ? (
                            <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <p className="font-semibold mb-1">Please fix the following issues:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    {validationErrors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                Are you sure you want to submit your timesheet for approval?
                                Once submitted, you cannot make changes directly. You will need to use "Request Edit".
                            </p>
                        )}

                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    {!hasErrors && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
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
