import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsHeader from '../../components/employee/projects/ProjectsHeader';
import FilterBar from '../../components/employee/projects/FilterBar';
import type { ProjectStatusFilter } from '../../components/employee/projects/FilterBar';
import ProjectsGrid from '../../components/employee/projects/ProjectsGrid';
import EmptyState from '../../components/employee/projects/EmptyState';
import type { Project } from '../../types/schema';
import { mockBackend } from '../../services/mockBackend';

import { useAuth } from '../../context/AuthContext';

const MyProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get logged-in user
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('ACTIVE');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Fetch Projects from Backend
    const [mockProjects, setMockProjects] = useState<Project[]>([]);

    React.useEffect(() => {
        // Filter projects where logged-in user is in the team
        const allProjects = mockBackend.getProjects();
        if (user) {
            const assignedProjects = allProjects.filter(p =>
                p.teamMembers && p.teamMembers.some(member => member.userId === user.id)
            );
            setMockProjects(assignedProjects);
        }
    }, [user]);

    // Filter Logic
    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Handlers
    const handleStartTimer = (projectId?: string) => {
        // Navigate to Timer page with project pre-selected (via state)
        navigate('/employee/timer', { state: { projectId } });
    };

    const handleViewDetails = (projectId: string) => {
        console.log("View Project Details", projectId);
        // navigate(`/employee/projects/${projectId}`);
    };

    // Error Boundary (Inline)
    class ErrorBoundary extends React.Component<{ name: string, children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
        constructor(props: any) {
            super(props);
            this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error: Error) {
            return { hasError: true, error };
        }
        componentDidCatch(error: Error, errorInfo: any) {
            console.error(`Error in ${this.props.name}:`, error, errorInfo);
        }
        render() {
            if (this.state.hasError) {
                return (
                    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <strong>Error in {this.props.name}:</strong>
                        <pre className="mt-2 text-xs overflow-auto">{this.state.error?.message}</pre>
                    </div>
                );
            }
            return this.props.children;
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-12">

            <ErrorBoundary name="Header">
                <ProjectsHeader
                    onSearch={setSearchQuery}
                    onStartTimer={() => handleStartTimer()}
                />
            </ErrorBoundary>

            <ErrorBoundary name="FilterBar">
                <FilterBar
                    currentFilter={statusFilter}
                    onFilterChange={setStatusFilter}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            </ErrorBoundary>

            <ErrorBoundary name="ProjectsGrid">
                {filteredProjects.length > 0 ? (
                    <ProjectsGrid
                        projects={filteredProjects}
                        onStartTimer={handleStartTimer}
                        onViewDetails={handleViewDetails}
                    />
                ) : (
                    <EmptyState onRefresh={() => { setSearchQuery(''); setStatusFilter('ACTIVE'); }} />
                )}
            </ErrorBoundary>

        </div>
    );
};

export default MyProjectsPage;
