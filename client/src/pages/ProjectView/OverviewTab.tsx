import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/common/primitives';
import { Bug, CheckCircle, PlayCircle, Target, TrendingUp, Clock } from 'lucide-react';

const OverviewTab = ({ project }) => {
  const overviewStats = {
    bugs: project?.bugs ?? 0,
    testCases: project?.testCases ?? 0,
    testCycles: project?.stats?.testCycles ?? 0,
    executions: project?.stats?.executions ?? 0,
    coverage: project?.stats?.coverage ?? 0,
    successRate: project?.stats?.successRate ?? 0
  };

  const timeline = [];

  const recentActivity = [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
              <Bug className="text-danger" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{overviewStats.bugs}</div>
              <div className="text-sm text-muted-foreground">Total Bugs</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{overviewStats.testCases}</div>
              <div className="text-sm text-muted-foreground">Test Cases</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <PlayCircle className="text-info" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{overviewStats.testCycles}</div>
              <div className="text-sm text-muted-foreground">Test Cycles</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Target className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{overviewStats.executions}</div>
              <div className="text-sm text-muted-foreground">Executions</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{overviewStats.coverage}%</div>
              <div className="text-sm text-muted-foreground">Coverage</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{overviewStats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Test Coverage</span>
                <span className="text-sm font-medium">{overviewStats.coverage}%</span>
              </div>
              <ProgressBar value={overviewStats.coverage} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium">{overviewStats.successRate}%</span>
              </div>
              <ProgressBar value={overviewStats.successRate} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    item.type === 'success' ? 'bg-success' :
                    item.type === 'warning' ? 'bg-warning' :
                    'bg-info'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-card-foreground">{item.event}</div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium text-card-foreground">{activity.user}</span>
                      <span className="text-muted-foreground"> {activity.action}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;