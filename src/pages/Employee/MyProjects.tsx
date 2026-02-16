import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsHeader from '../../components/employee/projects/ProjectsHeader';
import FilterBar from '../../components/employee/projects/FilterBar';
import type { ProjectStatusFilter } from '../../components/employee/projects/FilterBar';
import ProjectsGrid from '../../components/employee/projects/ProjectsGrid';
import EmptyState from '../../components/employee/projects/EmptyState';
import type { Project } from '../../types/schema';
import { backendService } from '../../services/backendService';

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
            const assignments = backendService.getUserAssignments(user.id);
            const allCategories = backendService.getTaskCategories();

            // ... (rest of assignment logic)
            // Pre-fetch entries for calculations (Optimization: Get all for user once)
            const userEntries = backendService.getEntries(user.id);

            const assignedTaskProjects: Project[] = assignments.map(asn => {
                const category = allCategories.find(c => c.id === asn.categoryId);

                // ... (existing logic)
                const trackedMinutes = userEntries
                    .filter(e => e.categoryId === asn.categoryId)
                    .reduce((sum, e) => sum + e.durationMinutes, 0);

                let managerName = 'Unknown Manager';
                if (asn.assignedBy) {
                    const assigner = backendService.getUsers().find(u => u.id === asn.assignedBy);
                    if (assigner) managerName = assigner.name;
                }

                return {
                    id: asn.id,
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
                    totalTrackedMinutes: trackedMinutes,
                    currency: 'USD',
                    billingMode: 'HOURLY',
                    rateLogic: 'DEFAULT',
                    entryRules: {
                        isBillableDefault: false,
                        requiresProof: false,
                        allowOvertime: false
                    },
                    categoryId: asn.categoryId,
                    managerName: managerName
                } as unknown as Project;
            });

            // 2. Get standard projects
            const allProjects = backendService.getProjects();



            const currentMonthStart = new Date();
            currentMonthStart.setDate(1);
            currentMonthStart.setHours(0, 0, 0, 0);

            const standardProjects = allProjects
                .filter(p => p.teamMembers && p.teamMembers.some(member => member.userId === user.id))
                .map(p => {
                    // ... (existing map logic)
                    const projectMinutes = userEntries
                        .filter(e => {
                            const entryDate = new Date(e.date);
                            return e.projectId === p.id && entryDate >= currentMonthStart;
                        })
                        .reduce((sum, e) => sum + e.durationMinutes, 0);

                    return {
                        ...p,
                        totalTrackedMinutes: projectMinutes
                    };
                });



            // 3. Combine with Fallback for Consistency
            let combined = [...assignedTaskProjects, ...standardProjects];
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
        // Check if this projectId corresponds to a "Task Assignment" which acts as a category shortcut
        // We look for the custom 'categoryId' property we added in the mapping above
        const project = mockProjects.find(p => p.id === projectId);

        if (project && (project as any).categoryId) {
            // It is an assigned task category
            navigate('/employee/timer', {
                state: {
                    autoStart: true,
                    projectId: 'p1', // Default fallback project for direct task assignments
                    categoryId: (project as any).categoryId
                }
            });
        } else {
            // Standard Project
            navigate('/employee/timer', { state: { projectId } });
        }
    };

    const handleViewDetails = (projectId: string) => {
        navigate(`/employee/projects/${projectId}`);
    };

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
                        viewMode={viewMode}
                    />
                ) : (
                    <EmptyState onRefresh={() => { setSearchQuery(''); setStatusFilter('ACTIVE'); }} />
                )}
            </ErrorBoundary>

        </div>
    );
};

// Error Boundary (Moved Outside)
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

export default MyProjectsPage;

