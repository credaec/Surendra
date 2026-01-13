import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsHeader from '../../components/employee/projects/ProjectsHeader';
import FilterBar from '../../components/employee/projects/FilterBar';
import type { ProjectStatusFilter } from '../../components/employee/projects/FilterBar';
import ProjectsGrid from '../../components/employee/projects/ProjectsGrid';
import EmptyState from '../../components/employee/projects/EmptyState';
import type { Project } from '../../types/schema';

const MyProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('ACTIVE');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mock Projects Data
    const mockProjects: Project[] = [
        {
            id: 'p1',
            code: 'PRJ-001',
            name: 'BCS Skylights',
            clientId: 'c1',
            clientName: 'Boston Construction Services',
            status: 'ACTIVE',
            type: 'HOURLY',
            priority: 'HIGH',
            startDate: '2025-11-01',
            endDate: '2026-03-01',
            estimatedHours: 120,
            currency: 'USD',
            billingMode: 'HOURLY_RATE',
            rateLogic: 'CATEGORY_BASED_RATE',
            teamMembers: [],
            entryRules: { allowManual: true, billableDefault: true, requireApproval: true },
            alerts: [],
            usedHours: 45,
            billableHours: 45
        },
        {
            id: 'p2',
            code: 'PRJ-002',
            name: 'Dr. Wade Residence',
            clientId: 'c2',
            clientName: 'Dr. Emily Wade',
            status: 'ACTIVE',
            type: 'FIXED',
            priority: 'MEDIUM',
            startDate: '2026-01-05',
            estimatedHours: 40,
            currency: 'USD',
            billingMode: 'FIXED_FEE',
            rateLogic: 'GLOBAL_PROJECT_RATE',
            teamMembers: [],
            entryRules: { allowManual: true, billableDefault: true, requireApproval: true },
            alerts: [],
            usedHours: 12,
            billableHours: 12
        },
        {
            id: 'p3',
            code: 'INT-001',
            name: 'Internal Training',
            clientId: 'internal',
            clientName: 'Credence Internal',
            status: 'PLANNED',
            type: 'INTERNAL',
            priority: 'LOW',
            startDate: '2026-02-01',
            estimatedHours: 10,
            currency: 'USD',
            billingMode: 'HOURLY_RATE',
            rateLogic: 'EMPLOYEE_BASED_RATE',
            teamMembers: [],
            entryRules: { allowManual: true, billableDefault: false, requireApproval: false },
            alerts: [],
            usedHours: 0,
            billableHours: 0
        },
        {
            id: 'p4',
            code: 'PRJ-003',
            name: 'City Mall Expansion',
            clientId: 'c3',
            clientName: 'Urban Developers',
            status: 'COMPLETED',
            type: 'HOURLY',
            priority: 'CRITICAL',
            startDate: '2025-06-01',
            endDate: '2025-12-31',
            estimatedHours: 500,
            currency: 'USD',
            billingMode: 'HOURLY_RATE',
            rateLogic: 'CATEGORY_BASED_RATE',
            teamMembers: [],
            entryRules: { allowManual: true, billableDefault: true, requireApproval: true },
            alerts: [],
            usedHours: 480,
            billableHours: 450
        }
    ];

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
