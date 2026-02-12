import React from 'react';
import type { Project, TaskCategory } from '../../../types/schema';

interface TimerFormProps {
    projects: Project[];
    categories: TaskCategory[];
    selectedProject: string;
    selectedCategory: string;
    notes: string;
    onProjectChange: (val: string) => void;
    onCategoryChange: (val: string) => void;
    onNotesChange: (val: string) => void;
    readOnlyProject?: boolean;
    readOnlyCategory?: boolean;
}

const TimerForm: React.FC<TimerFormProps> = ({
    projects,
    categories,
    selectedProject,
    selectedCategory,
    notes,
    onProjectChange,
    onCategoryChange,
    onNotesChange,
    readOnlyProject,
    readOnlyCategory
}) => {
    // Find selected category to check rules
    const categoryDetails = categories.find(c => c.id === selectedCategory);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Work Details</h3>

            <div className="grid grid-cols-1 gap-6">
                {/* Row 1: Project & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedProject}
                            onChange={(e) => onProjectChange(e.target.value)}
                            disabled={readOnlyProject}
                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500"
                        >
                            <option value="">Select Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            disabled={readOnlyCategory}
                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500"
                        >
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Row 2: Notes */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Notes {categoryDetails?.isNotesRequired && <span className="text-red-400 text-xs font-normal ml-1">(Required)</span>}
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="What are you working on?"
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimerForm;
