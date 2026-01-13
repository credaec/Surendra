import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ProofComplianceCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Proof Compliance</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white text-emerald-600 flex items-center justify-center mr-3 shadow-sm">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-800">42</div>
                        <div className="text-xs text-emerald-600 font-medium">Verified Entries</div>
                    </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white text-red-600 flex items-center justify-center mr-3 shadow-sm">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-red-800">2</div>
                        <div className="text-xs text-red-600 font-medium">Missing Proof</div>
                    </div>
                </div>
            </div>

            <button className="w-full mt-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                Upload Missing Proofs (2)
            </button>
        </div>
    );
};

export default ProofComplianceCard;
