import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { getProject } from '../../services/api';
import { Card } from '@/components/ui/card';
import { StatusPill, ProgressBar } from '@/components/common/primitives';
import { ArrowLeft, FileText, Users, Settings } from 'lucide-react';
import OverviewTab from './OverviewTab';
import TestCasesTab from './TestCasesTab';
import TestCyclesTab from './TestCyclesTab';
import ExecutionsTab from './ExecutionsTab';
import DefectsTab from './DefectsTab';
import ReportsTab from './ReportsTab';
import ParametersTab from './ParametersTab';
import TeamTab from './TeamTab';

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: '', label: 'Overview', component: OverviewTab },
    { id: 'test-cases', label: 'Test Cases', component: TestCasesTab },
    { id: 'test-cycles', label: 'Test Cycles', component: TestCyclesTab },
    { id: 'executions', label: 'Executions', component: ExecutionsTab },
    { id: 'defects', label: 'Defects', component: DefectsTab },
    { id: 'reports', label: 'Reports', component: ReportsTab },
    { id: 'parameters', label: 'Parameters', component: ParametersTab },
    { id: 'team', label: 'Team', component: TeamTab }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        // Normalize shape: server returns { project, stats, parameters, members }
        // UI expects top-level fields like name/status/progress/startDate
        const normalized = data?.project ? { ...data.project, stats: data.stats, parameters: data.parameters, members: data.members } : data;
        setProject(normalized);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Project not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <StatusPill status={project.status} />
              <span className="text-sm text-muted-foreground">
                Started {new Date(project.startDate).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <ProgressBar value={project.progress} className="w-20" />
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-border hover:bg-muted rounded-lg transition-colors">
            <FileText size={16} />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-border hover:bg-muted rounded-lg transition-colors">
            <Users size={16} />
            <span>Manage Team</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-border hover:bg-muted rounded-lg transition-colors">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id ? `${tab.id}` : ''}
              end={tab.id === ''}
              className={({ isActive }) =>
                `px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </Card>

      {/* Tab Content */}
      <div>
        <Routes>
          <Route path="" element={<OverviewTab project={project} />} />
          <Route path="test-cases" element={<TestCasesTab projectId={projectId} />} />
          <Route path="test-cycles" element={<TestCyclesTab projectId={projectId} />} />
          <Route path="executions" element={<ExecutionsTab projectId={projectId} />} />
          <Route path="defects" element={<DefectsTab projectId={projectId} />} />
          <Route path="reports" element={<ReportsTab projectId={projectId} />} />
          <Route path="parameters" element={<ParametersTab projectId={projectId} />} />
          <Route path="team" element={<TeamTab projectId={projectId} />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProjectView;