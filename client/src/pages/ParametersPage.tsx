import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings, Database, Wrench, Shield } from 'lucide-react';

const ParametersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Global Parameters</h1>
        <p className="text-muted-foreground">System-wide configuration and parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Settings className="text-primary" size={20} />
              <CardTitle>System Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configure system-wide settings and preferences</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Configure System
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Database className="text-primary" size={20} />
              <CardTitle>Data Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage data retention and storage settings</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Manage Data
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Wrench className="text-primary" size={20} />
              <CardTitle>Integration Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configure integrations with external tools</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Manage Integrations
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="text-primary" size={20} />
              <CardTitle>Security Parameters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configure security policies and access controls</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Security Settings
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParametersPage;