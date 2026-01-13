import React from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ProofUploadCardProps {
    isRequired: boolean;
    hasFile: boolean;
    onUpload: () => void;
    onRemove: () => void;
}

const ProofUploadCard: React.FC<ProofUploadCardProps> = ({ isRequired, hasFile, onUpload, onRemove }) => {
    if (!isRequired) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden mb-6 animate-in slide-in-from-top-4 duration-500">
            <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">
                            Proof Required
                        </span>
                    </div>
                    <p className="text-xs text-red-600 mt-1 font-medium">Attachment is mandatory for this category.</p>
                </div>
            </div>

            <div className="p-6">
                {!hasFile ? (
                    <div
                        onClick={onUpload}
                        className="border-2 border-dashed border-red-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-red-50/50 transition-colors cursor-pointer group"
                    >
                        <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Click to upload proof</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, or PDF (Max 5MB)</p>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded bg-white border border-slate-200 flex items-center justify-center text-red-500">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 line-clamp-1">site_visit_log_jan14.pdf</p>
                                <p className="text-xs text-slate-500">2.4 MB • Uploaded just now</p>
                            </div>
                        </div>
                        <button
                            onClick={onRemove}
                            className="p-1.5 hover:bg-white hover:text-red-500 rounded-full text-slate-400 transition-colors shadow-sm"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofUploadCard;
