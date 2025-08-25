import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, FileText, TrendingUp, Download } from 'lucide-react';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Global Reports</h1>
        <p className="text-muted-foreground">System-wide reporting and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-primary" size={20} />
              <CardTitle>Cross-Project Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View analytics across all projects in the system</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Analytics
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="text-primary" size={20} />
              <CardTitle>Executive Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">High-level metrics and KPIs for leadership</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Dashboard
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
            <p className="text-muted-foreground mb-4">Analyze performance trends over time</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              View Trends
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Download className="text-primary" size={20} />
              <CardTitle>Export Center</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Bulk export and scheduled reports</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Export Data
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;