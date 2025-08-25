import React, { useState, useEffect } from 'react';
import { listProjectTestCycles } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/common/primitives';
import { Play, Calendar, CheckCircle, Clock } from 'lucide-react';

const TestCyclesTab = ({ projectId }) => {
  const [testCycles, setTestCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestCycles = async () => {
      try {
        const data = await listProjectTestCycles(projectId);
        setTestCycles(data);
      } catch (error) {
        console.error('Error fetching test cycles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCycles();
  }, [projectId]);

  if (loading) {
    return <div className="text-muted-foreground">Loading test cycles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Test Cycles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testCycles.map((cycle) => (
          <Card key={cycle.id} className="hover-lift cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cycle.name}</CardTitle>
                <Play className="text-primary" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="font-medium">{cycle.durationDays} days</span>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Period</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{cycle.startDate}</div>
                    <div className="text-xs text-muted-foreground">to {cycle.endDate}</div>
                  </div>
                </div>

                {/* Test Cases Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Test Cases</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle size={14} className="text-muted-foreground" />
                    <span className="font-medium">{cycle.testCaseCount}</span>
                  </div>
                </div>

                {/* Execution Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Execution</span>
                    <span className="text-sm font-medium">{cycle.executionPct}%</span>
                  </div>
                  <ProgressBar value={cycle.executionPct} />
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground py-2 rounded-lg font-medium transition-colors text-sm">
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-border hover:bg-muted rounded-lg transition-colors">
                    <Calendar size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Test Cycles Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{testCycles.length}</div>
              <div className="text-sm text-muted-foreground">Total Cycles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {testCycles.filter(c => c.executionPct === 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {testCycles.filter(c => c.executionPct > 0 && c.executionPct < 100).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {testCycles.reduce((sum, c) => sum + c.testCaseCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Test Cases</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {testCycles.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Play size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No test cycles yet</h3>
            <p className="text-muted-foreground mb-6">Create your first test cycle to get started</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
              Create Test Cycle
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TestCyclesTab;