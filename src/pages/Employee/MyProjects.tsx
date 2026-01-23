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
        if (user) {
            // 1. Get real assigned tasks
            const assignments = mockBackend.getUserAssignments(user.id);
            const allCategories = mockBackend.getTaskCategories();

            // Convert assignments to "Project" compatible structure for display
            // This is a UI adaptation since we are mixing Projects and Task Categories in one view
            const assignedTaskProjects: Project[] = assignments.map(asn => {
                const category = allCategories.find(c => c.id === asn.categoryId);
                return {
                    id: asn.id, // Assignment ID
                    code: 'TASK',
                    name: category ? category.name : 'Unknown Task',
                    clientId: 'internal',
                    clientName: 'Task Assignment',
                    description: 'Directly assigned task category',
                    status: 'ACTIVE',
                    type: 'INTERNAL',
                    priority: 'MEDIUM',
                    startDate: asn.assignedAt,
                    teamMembers: [{ userId: user.id, role: user.role, joinedAt: asn.assignedAt }],
                    budgetAmount: 0,
                    consumedBudget: 0,
                    estimatedHours: 0,
                    totalTrackedMinutes: 0,
                    currency: 'USD',
                    billingMode: 'HOURLY',
                    rateLogic: 'DEFAULT',
                    entryRules: {
                        isBillableDefault: false,
                        requiresProof: false,
                        allowOvertime: false
                    }
                } as unknown as Project;
            });

            // 2. Get standard projects
            const allProjects = mockBackend.getProjects();
            const standardProjects = allProjects.filter(p =>
                p.teamMembers && p.teamMembers.some(member => member.userId === user.id)
            );

            // 3. Combine with Fallback for Consistency
            let combined = [...assignedTaskProjects, ...standardProjects];

            // 4. Fallback if empty to match Dashboard Widget (Demo Consistency)
            // REMOVED STATIC FALLBACK per audit
            // The empty state component will handle zero projects.

            setMockProjects(combined);
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
        navigate(`/employee/projects/${projectId}`);
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
