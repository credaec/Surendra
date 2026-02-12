import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, User as UserIcon, Briefcase, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { backendService } from '../../services/backendService';
import { useLanguage } from '../../context/LanguageContext';

interface SearchResult {
    id: string;
    type: 'PAGE' | 'PROJECT' | 'EMPLOYEE';
    title: string;
    subtitle?: string;
    path: string;
    icon?: React.ReactNode;
}

const GlobalSearch: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const staticPages: SearchResult[] = [
        { id: 'page_dashboard', type: 'PAGE', title: t('Dashboard', 'Dashboard'), path: '/admin/dashboard', icon: <FileText className="h-4 w-4" /> },
        { id: 'page_timer', type: 'PAGE', title: t('Time Tracker', 'Time Tracker'), path: '/employee/timer', icon: <FileText className="h-4 w-4" /> },
        { id: 'page_projects', type: 'PAGE', title: t('Projects', 'Projects'), path: '/admin/projects', icon: <Briefcase className="h-4 w-4" /> },
        { id: 'page_team', type: 'PAGE', title: t('Team Management', 'Team Management'), path: '/admin/team', icon: <UserIcon className="h-4 w-4" /> },
        { id: 'page_approvals', type: 'PAGE', title: t('Approvals', 'Approvals'), path: '/admin/approvals', icon: <FileText className="h-4 w-4" /> },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchQuery = query.toLowerCase();
        const newResults: SearchResult[] = [];

        // 1. Search Pages
        const matchedPages = staticPages.filter(page =>
            page.title.toLowerCase().includes(searchQuery)
        );
        newResults.push(...matchedPages);

        // 2. Search Projects (from Backend)
        const projects = backendService.getProjects();
        const matchedProjects = projects
            .filter(p => p.name.toLowerCase().includes(searchQuery) || p.clientName.toLowerCase().includes(searchQuery))
            .map(p => ({
                id: p.id,
                type: 'PROJECT' as const,
                title: p.name,
                subtitle: p.clientName,
                path: '/projects', // TODO: Go to detail
                icon: <Briefcase className="h-4 w-4" />
            }));
        newResults.push(...matchedProjects);

        // 3. Search Employees (from Backend)
        const users = backendService.getUsers();
        const matchedUsers = users
            .filter(u => u.name.toLowerCase().includes(searchQuery) || u.email.toLowerCase().includes(searchQuery))
            .map(u => ({
                id: u.id,
                type: 'EMPLOYEE' as const,
                title: u.name,
                subtitle: u.designation,
                path: '/team', // TODO: Go to detail or filter
                icon: <UserIcon className="h-4 w-4" />
            }));
        newResults.push(...matchedUsers);

        setResults(newResults);
        setIsOpen(true);
        setSelectedIndex(0);

    }, [query]);

    const handleSelect = (result: SearchResult) => {
        setQuery('');
        setIsOpen(false);
        navigate(result.path);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-md group" ref={containerRef}>
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                    <Search className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 sm:text-sm font-medium transition-all duration-300"
                    placeholder={t('Search projects, employees...', 'Search projects, employees...')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (query) setIsOpen(true); }}
                />
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 mt-3 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[500px] overflow-y-auto">
                    <div className="px-3 space-y-1">
                        {results.map((result, index) => (
                            <button
                                key={result.id}
                                onClick={() => handleSelect(result)}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group/item transition-all duration-200 ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-100 dark:ring-blue-900/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="flex items-center min-w-0">
                                    <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover/item:scale-110 ${result.type === 'PAGE' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                        result.type === 'PROJECT' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                                            'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {result.icon}
                                    </div>
                                    <div className="ml-4 min-w-0 flex-1">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center">
                                            {result.title}
                                            {result.type !== 'PAGE' && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/40 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                                    {result.type}
                                                </span>
                                            )}
                                        </div>
                                        {result.subtitle && (
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-500 truncate mt-0.5">{result.subtitle}</div>
                                        )}
                                    </div>
                                </div>
                                {(index === selectedIndex) && (
                                    <div className="bg-blue-600 dark:bg-blue-400 rounded-full p-1 ml-2 shadow-lg shadow-blue-500/20">
                                        <ArrowRight className="h-3.5 w-3.5 text-white dark:text-slate-950" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div className="absolute top-full left-0 mt-3 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 py-12 text-center z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">No results found for <span className="text-slate-900 dark:text-white">"{query}"</span></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;

