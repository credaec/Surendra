import React from 'react';
import { FolderOpen, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
    onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No projects assigned yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm text-center">
                Contact your Project Manager or Admin to get assigned to a project correctly.
            </p>
            <button
                onClick={onRefresh}
                className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
                <RefreshCcw className="h-4 w-4 mr-2 text-slate-500" />
                Refresh list
            </button>
        </div>
    );
};

export default EmptyState;
