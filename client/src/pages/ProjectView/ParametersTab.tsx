import React, { useState, useEffect } from 'react';
import { listProjectParameters } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings, Info, Wrench, Calendar } from 'lucide-react';

const ParametersTab = ({ projectId }) => {
  const [parameters, setParameters] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const data = await listProjectParameters(projectId);
        setParameters(data);
      } catch (error) {
        console.error('Error fetching parameters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParameters();
  }, [projectId]);

  if (loading) {
    return <div className="text-muted-foreground">Loading parameters...</div>;
  }

  const parameterSections = [
    {
      title: 'Test Configuration',
      icon: Settings,
      items: [
        { label: 'Test Type', value: parameters.testType || 'Not specified', description: 'Type of testing being performed' },
        { label: 'Test Mode', value: parameters.testMode || 'Not specified', description: 'Testing approach and methodology' }
      ]
    },
    {
      title: 'Tools & Environment',
      icon: Wrench,
      items: [
        { label: 'Testing Tools', value: parameters.tools?.join(', ') || 'Not specified', description: 'Tools used for test automation and execution' },
        { label: 'Product', value: parameters.product || 'Not specified', description: 'Product or system under test' }
      ]
    },
    {
      title: 'Test Cycles',
      icon: Calendar,
      items: Object.entries(parameters.cycles || {}).map(([key, value]) => ({
        label: key.toUpperCase(),
        value: `${value} cycles`,
        description: `Number of ${key} test cycles planned`
      }))
    }
  ];

  return (
    <div className="space-y-6">
      {/* Parameter Sections */}
      {parameterSections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <section.icon className="text-primary" size={20} />
              </div>
              <CardTitle>{section.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-start py-3 border-b border-border last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-card-foreground">{item.label}</span>
                      {item.description && (
                        <div className="group relative">
                          <Info size={14} className="text-muted-foreground cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-card-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* System Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <Info className="text-info" size={20} />
            </div>
            <CardTitle>System Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Project Metadata</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created Date</span>
                  <span>January 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span>March 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project ID</span>
                  <span className="font-mono">{projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span>1.2.0</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-card-foreground mb-3">Configuration Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Test Environment</span>
                  <span className="status-pill status-active">Configured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Test Data</span>
                  <span className="status-pill status-active">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Automation Setup</span>
                  <span className="status-pill status-development">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team Access</span>
                  <span className="status-pill status-completed">Granted</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent>
          <div className="flex justify-center">
            <button className="px-6 py-3 border border-border hover:bg-muted rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Settings size={16} />
              <span>Edit Project Parameters</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {Object.keys(parameters).length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Settings size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No parameters configured</h3>
            <p className="text-muted-foreground mb-6">Set up project parameters to define testing scope and configuration</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
              Configure Parameters
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ParametersTab;