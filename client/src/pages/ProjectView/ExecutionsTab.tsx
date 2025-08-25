import React, { useState, useEffect } from 'react';
import { listProjectExecutions } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/common/primitives';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Play, Calendar, User, FileText } from 'lucide-react';

const ExecutionsTab = ({ projectId }) => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const data = await listProjectExecutions(projectId);
        setExecutions(data);
      } catch (error) {
        console.error('Error fetching executions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, [projectId]);

  if (loading) {
    return <div className="text-muted-foreground">Loading executions...</div>;
  }

  // Mock chart data
  const chartData = [
    { date: '2024-03-01', passed: 12, failed: 3, blocked: 1 },
    { date: '2024-03-02', passed: 15, failed: 2, blocked: 0 },
    { date: '2024-03-03', passed: 8, failed: 5, blocked: 2 },
    { date: '2024-03-04', passed: 18, failed: 1, blocked: 1 },
    { date: '2024-03-05', passed: 14, failed: 4, blocked: 0 }
  ];

  const getStatusPillType = (result) => {
    switch (result) {
      case 'Passed': return 'success';
      case 'Failed': return 'danger';
      case 'Blocked': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Execution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Execution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Bar dataKey="passed" stackId="a" fill="hsl(var(--success))" />
              <Bar dataKey="failed" stackId="a" fill="hsl(var(--danger))" />
              <Bar dataKey="blocked" stackId="a" fill="hsl(var(--warning))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Executions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Test Case</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Result</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Executed By</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((execution, index) => (
                  <tr 
                    key={execution.id} 
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono text-sm text-primary">{execution.testCaseId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill status={getStatusPillType(execution.result)}>
                        {execution.result}
                      </StatusPill>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="text-sm">{execution.executedBy}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-sm">{execution.date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {execution.notes || 'No notes'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Play className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {executions.filter(e => e.result === 'Passed').length}
              </div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
              <Play className="text-danger" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {executions.filter(e => e.result === 'Failed').length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Play className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {executions.filter(e => e.result === 'Blocked').length}
              </div>
              <div className="text-sm text-muted-foreground">Blocked</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <FileText className="text-info" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{executions.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty state */}
      {executions.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Play size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No executions yet</h3>
            <p className="text-muted-foreground">Test executions will appear here once tests are run</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExecutionsTab;