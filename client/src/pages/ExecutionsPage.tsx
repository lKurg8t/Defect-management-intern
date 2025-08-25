import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Play, BarChart3, Calendar, TrendingUp } from 'lucide-react';

const ExecutionsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Global Executions</h1>
        <p className="text-muted-foreground">Monitor test executions across all projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Play className="text-primary" size={20} />
              <CardTitle>Recent Executions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View the latest test execution results</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Recent
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-primary" size={20} />
              <CardTitle>Execution Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Analyze execution performance and trends</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Analytics
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Calendar className="text-primary" size={20} />
              <CardTitle>Execution Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Schedule and plan test executions</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Schedule
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-primary" size={20} />
              <CardTitle>Performance Trends</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Track execution performance over time</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Trends
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutionsPage;