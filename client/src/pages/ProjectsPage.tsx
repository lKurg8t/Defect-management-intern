import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProjects } from '../services/api';
import { Card } from '@/components/ui/card';
import { StatusPill, ProgressBar } from '@/components/common/primitives';
import { Plus, Users, Bug, CheckCircle, MoreVertical, Calendar, FolderOpen } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage and monitor your testing projects</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>NEW PROJECT</span>
        </button>
      </div>

      {/* Projects Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Project Name</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Description</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Progress</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Team Size</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Bugs</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Test Cases</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Start Date</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr 
                  key={project.id} 
                  className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  }`}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-card-foreground">{project.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {project.description}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusPill status={project.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3 min-w-[120px]">
                      <ProgressBar value={project.progress} className="flex-1" />
                      <span className="text-sm font-medium text-muted-foreground">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{project.teamSize}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Bug size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{project.bugs}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{project.testCases}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar size={16} />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu actions
                      }}
                    >
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty state if no projects */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">Get started by creating your first project</p>
          <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;