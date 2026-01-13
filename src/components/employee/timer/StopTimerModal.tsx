import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface StopTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isProofMissing: boolean;
}

const StopTimerModal: React.FC<StopTimerModalProps> = ({ isOpen, onClose, onConfirm, isProofMissing }) => {
    if (!isOpen) return null;

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
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Stop Timer & Save Entry?</h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            This will stop the current timer and save your work log.
                            {isProofMissing && <span className="block mt-2 font-medium text-red-600">⚠️ Proof is missing. You must upload it later to submit the timesheet.</span>}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm shadow-red-200 transition-colors"
                    >
                        Stop & Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StopTimerModal;
