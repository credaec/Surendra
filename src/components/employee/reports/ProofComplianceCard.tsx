import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { TimeEntry } from '../../../types/schema';
import { backendService } from '../../../services/backendService';

interface ProofComplianceCardProps {
    entries: TimeEntry[];
}

const ProofComplianceCard: React.FC<ProofComplianceCardProps> = ({ entries }) => {
    // Calculate stats
    const stats = useMemo(() => {
        let verified = 0;
        let missing = 0;

        entries.forEach(e => {
            // Logic: If status is approved or proofUploaded is true, it's verified.
            // If it's done (submitted/approved) but no proof, maybe missing?
            // For now, let's say "Drafting" and "Site Visits" require proof.
            // Mock enrichment:
            const categoryId = e.categoryId;
            const categoryName = backendService.getTaskCategories().find(c => c.id === categoryId)?.name || categoryId;

            // Assume category names 'Drafting' and 'Site Visits' require proof
            const proofRequired = ['Drafting', 'Site Visits', 'Construction'].includes(categoryName);
            // Mock proofUploaded based on random or description
            const proofUploaded = e.description?.includes('proof') || false;

            if (proofRequired) {
                if (proofUploaded) verified++;
                else missing++;
            } else {
                verified++; // Auto-verified if no proof needed
            }
        });

        return { verified, missing };
    }, [entries]);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Proof Compliance</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white text-emerald-600 flex items-center justify-center mr-3 shadow-sm">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-800">{stats.verified}</div>
                        <div className="text-xs text-emerald-600 font-medium">Verified Entries</div>
                    </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white text-red-600 flex items-center justify-center mr-3 shadow-sm">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-red-800">{stats.missing}</div>
                        <div className="text-xs text-red-600 font-medium">Missing Proof</div>
                    </div>
                </div>
            </div>

            {stats.missing > 0 && (
                <button className="w-full mt-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    Upload Missing Proofs ({stats.missing})
                </button>
            )}
        </div>
    );
};

export default ProofComplianceCard;
