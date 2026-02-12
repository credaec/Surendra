import React from 'react';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type ProjectStatusFilter = 'ACTIVE' | 'PLANNED' | 'ON_HOLD' | 'COMPLETED';

interface FilterBarProps {
    currentFilter: ProjectStatusFilter;
    onFilterChange: (filter: ProjectStatusFilter) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    currentFilter,
    onFilterChange,
    viewMode,
    onViewModeChange
}) => {
    const filters: { label: string, value: ProjectStatusFilter }[] = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Planned', value: 'PLANNED' },
        { label: 'On Hold', value: 'ON_HOLD' },
        { label: 'Completed', value: 'COMPLETED' },
    ];

    return (
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 -mx-6 px-6 py-3 mb-6 flex items-center justify-between transition-colors">

            {/* Status Filters */}
            <div className="flex items-center space-x-1">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            currentFilter === filter.value
                                ? "bg-slate-900 dark:bg-blue-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-3">

                {/* View Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'grid' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                        title="Grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'list' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                        title="List View"
                    >
                        <ListIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
