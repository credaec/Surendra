import React from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../../../types/schema';

interface ProjectsGridProps {
    projects: Project[];
    onStartTimer: (projectId: string) => void;
    onViewDetails: (projectId: string) => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, onStartTimer, onViewDetails }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="h-full">
                    <ProjectCard
                        project={project}
                        onStartTimer={onStartTimer}
                        onViewDetails={onViewDetails}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProjectsGrid;
