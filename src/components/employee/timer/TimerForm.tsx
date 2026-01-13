import React from 'react';
import type { Project, TaskCategory } from '../../../types/schema';

// Mock Data (reused for now)
const projectsMock: Partial<Project>[] = [
    { id: 'p1', name: 'BCS Skylights', code: 'PRJ-001' },
    { id: 'p2', name: 'Dr. Wade Residence', code: 'PRJ-002' },
    { id: 'p3', name: 'Internal Training', code: 'INT-001' }
];

const categoriesMock: TaskCategory[] = [
    { id: 'c1', name: 'Engineering', isBillable: true, isNotesRequired: true, isProofRequired: false },
    { id: 'c2', name: 'Drafting', isBillable: true, isNotesRequired: false, isProofRequired: true },
    { id: 'c3', name: 'Meeting', isBillable: true, isNotesRequired: true, isProofRequired: false },
];

interface TimerFormProps {
    selectedProject: string;
    selectedCategory: string;
    notes: string;
    onProjectChange: (val: string) => void;
    onCategoryChange: (val: string) => void;
    onNotesChange: (val: string) => void;
    readOnly?: boolean;
}

const TimerForm: React.FC<TimerFormProps> = ({
    selectedProject,
    selectedCategory,
    notes,
    onProjectChange,
    onCategoryChange,
    onNotesChange,
    readOnly
}) => {
    // Find selected category to check rules
    const categoryDetails = categoriesMock.find(c => c.id === selectedCategory);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Work Details</h3>

            <div className="grid grid-cols-1 gap-6">
                {/* Row 1: Project & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedProject}
                            onChange={(e) => onProjectChange(e.target.value)}
                            disabled={readOnly}
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        >
                            <option value="">Select Project...</option>
                            {projectsMock.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            disabled={readOnly}
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        >
                            <option value="">Select Category...</option>
                            {categoriesMock.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Row 2: Notes */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Notes {categoryDetails?.isNotesRequired && <span className="text-red-400 text-xs font-normal ml-1">(Required)</span>}
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="What are you working on?"
                        className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimerForm;
