import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, User as UserIcon, Briefcase, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBackend } from '../../services/mockBackend';
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

    // Static Pages Map
    const staticPages: SearchResult[] = [
        { id: 'page_dashboard', type: 'PAGE', title: t('Dashboard', 'Dashboard'), path: '/dashboard', icon: <FileText className="h-4 w-4" /> },
        { id: 'page_timer', type: 'PAGE', title: t('Time Tracker', 'Time Tracker'), path: '/employee/timer', icon: <FileText className="h-4 w-4" /> },
        { id: 'page_projects', type: 'PAGE', title: t('Projects', 'Projects'), path: '/projects', icon: <Briefcase className="h-4 w-4" /> },
        { id: 'page_team', type: 'PAGE', title: t('Team Management', 'Team Management'), path: '/team', icon: <UserIcon className="h-4 w-4" /> },
        { id: 'page_approvals', type: 'PAGE', title: t('Approvals', 'Approvals'), path: '/approvals', icon: <FileText className="h-4 w-4" /> },
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
        const projects = mockBackend.getProjects();
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
        const users = mockBackend.getUsers();
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
        <div className="relative w-96" ref={containerRef}>
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </span>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                    placeholder={t('Search projects, employees...', 'Search projects, employees...')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (query) setIsOpen(true); }}
                />
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                    {/* Categories could be added here if needed */}
                    <div className="px-2">
                        {results.map((result, index) => (
                            <button
                                key={result.id}
                                onClick={() => handleSelect(result)}
                                className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between group transition-colors ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center min-w-0">
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${result.type === 'PAGE' ? 'bg-indigo-50 text-indigo-600' :
                                        result.type === 'PROJECT' ? 'bg-orange-50 text-orange-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                        {result.icon}
                                    </div>
                                    <div className="ml-3 min-w-0 flex-1">
                                        <div className="text-sm font-medium text-slate-900 truncate">
                                            {result.title}
                                            {result.type !== 'PAGE' && (
                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 uppercase tracking-wide">
                                                    {result.type}
                                                </span>
                                            )}
                                        </div>
                                        {result.subtitle && (
                                            <div className="text-xs text-slate-500 truncate">{result.subtitle}</div>
                                        )}
                                    </div>
                                </div>
                                {index === selectedIndex && (
                                    <ArrowRight className="h-4 w-4 text-blue-400 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 py-8 text-center z-50">
                    <p className="text-sm text-slate-500">No results found for "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
