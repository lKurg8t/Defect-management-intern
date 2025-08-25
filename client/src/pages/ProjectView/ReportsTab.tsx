import React, { useState, useEffect } from 'react';
import { listProjectReports } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

const ReportsTab = ({ projectId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await listProjectReports(projectId);
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [projectId]);

  if (loading) {
    return <div className="text-muted-foreground">Loading reports...</div>;
  }

  const handleExport = (format) => {
    // Mock export functionality
    console.log(`Exporting in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary" size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>Last generated: March 15, 2024</span>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>PDF</span>
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="flex-1 border border-border hover:bg-muted py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generation Options */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Report Type
                </label>
                <select className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                  <option>Execution Summary</option>
                  <option>Defect Analysis</option>
                  <option>Test Coverage</option>
                  <option>Performance Metrics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date Range
                </label>
                <select className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Current Sprint</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Include Sections
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Executive Summary',
                  'Test Execution Details',
                  'Defect Analysis',
                  'Coverage Metrics',
                  'Team Performance',
                  'Trend Analysis',
                  'Recommendations',
                  'Appendices'
                ].map((section) => (
                  <label key={section} className="flex items-center space-x-2 text-sm">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-input"
                    />
                    <span>{section}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-border hover:bg-muted rounded-lg font-medium transition-colors">
                Preview
              </button>
              <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium transition-colors flex items-center space-x-2">
                <FileText size={16} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats for Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Reports Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">156</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">3.2 MB</div>
              <div className="text-sm text-muted-foreground">Avg. Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">2.5s</div>
              <div className="text-sm text-muted-foreground">Avg. Generation Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {reports.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <BarChart3 size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No reports available</h3>
            <p className="text-muted-foreground mb-6">Generate your first report to get insights into your project</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
              Generate Report
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsTab;