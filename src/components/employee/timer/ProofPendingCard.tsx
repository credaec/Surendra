import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

const ProofPendingCard: React.FC = () => {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900">Missing Proof</h3>
                    <p className="text-xs text-amber-700 mt-1">
                        You have 2 time entries from yesterday that require proof documents.
                    </p>
                    <button className="mt-2 text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center">
                        Upload Now <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProofPendingCard;
