import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardSummary } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusPill, ProgressBar } from '@/components/common/primitives';
import { Users, Bug, CheckCircle, FolderOpen, Plus, FileText, Settings } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const { kpis = {}, weeklyActivity = [], bugDistribution = { critical:{count:0,percentage:0}, high:{count:0,percentage:0}, medium:{count:0,percentage:0} }, recentProjects = [] } = dashboardData || {};

  // Colors for charts
  const chartColors = {
    critical: '#ef4444',
    high: '#f59e0b', 
    medium: '#3b82f6'
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderOpen className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{kpis.totalProjects.value}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-xs text-success font-medium">{kpis.totalProjects.subtitle}</div>
            </div>
          </div>
        </Card>

        <Card className="hover-lift">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{kpis.testsCompleted.value}</div>
              <div className="text-sm text-muted-foreground">Tests Completed</div>
              <div className="text-xs text-success font-medium">{kpis.testsCompleted.subtitle}</div>
            </div>
          </div>
        </Card>

        <Card className="hover-lift">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <Bug className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{kpis.pendingBugs.value}</div>
              <div className="text-sm text-muted-foreground">Pending Bugs</div>
              <div className="text-xs text-warning font-medium">{kpis.pendingBugs.subtitle}</div>
            </div>
          </div>
        </Card>

        <Card className="hover-lift">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
              <Users className="text-info" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{kpis.teamMembers.value}</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
              <div className="text-xs text-info font-medium">{kpis.teamMembers.subtitle}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Test Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="tests" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--info))" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bug Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bug Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Critical</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <span className="font-medium">{bugDistribution.critical.count}</span>
                  <span className="text-sm text-muted-foreground">({bugDistribution.critical.percentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="font-medium">{bugDistribution.high.count}</span>
                  <span className="text-sm text-muted-foreground">({bugDistribution.high.percentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medium</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-info"></div>
                  <span className="font-medium">{bugDistribution.medium.count}</span>
                  <span className="text-sm text-muted-foreground">({bugDistribution.medium.percentage}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Projects</h2>
          <button 
            onClick={() => navigate('/projects')}
            className="text-primary hover:text-primary-hover font-medium text-sm"
          >
            View All Projects →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <Card key={project.id} className="hover-lift cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-card-foreground">{project.name}</h3>
                  <StatusPill status={project.status} />
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Bug size={14} />
                    <span>{project.bugs}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle size={14} />
                    <span>{project.testCases}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{project.teamSize}</span>
                  </div>
                </div>
                
                <button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2.5 rounded-lg font-medium transition-colors text-sm">
                  VIEW PROJECT
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
              <Plus className="text-primary" size={20} />
              <span className="font-medium">Create Project</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
              <FileText className="text-primary" size={20} />
              <span className="font-medium">Generate Report</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
              <Settings className="text-primary" size={20} />
              <span className="font-medium">Manage Team</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;