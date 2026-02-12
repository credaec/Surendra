import React from 'react';
import { FolderOpen, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
    onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No projects assigned yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm text-center">
                Contact your Project Manager or Admin to get assigned to a project correctly.
            </p>
            <button
                onClick={onRefresh}
                className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <RefreshCcw className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                Refresh list
            </button>
        </div>
    );
};

export default EmptyState;
