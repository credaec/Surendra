import React, { useState, useEffect } from 'react';
import { Search, Play } from 'lucide-react';


interface ProjectsHeaderProps {
    onSearch: (query: string) => void;
    onStartTimer: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onSearch, onStartTimer }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, onSearch]);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Projects</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View your assigned projects and start tracking time</p>
            </div>

            <div className="flex items-center space-x-3">
                {/* Search Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search project/client..."
                        className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                </div>

                {/* Start Timer Button */}
                <button
                    onClick={onStartTimer}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-colors"
                >
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    Start Timer
                </button>
            </div>
        </div>
    );
};

export default ProjectsHeader;
