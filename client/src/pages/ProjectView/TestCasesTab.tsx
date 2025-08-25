import React, { useState, useEffect } from 'react';
import { listProjectTestCases } from '../../services/api';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/common/primitives';
import { Search, Filter, Eye, Calendar, User } from 'lucide-react';

const TestCasesTab = ({ projectId }) => {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const data = await listProjectTestCases(projectId);
        setTestCases(data);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [projectId]);

  const getStatusPillType = (status) => {
    switch (status) {
      case 'Passed': return 'success';
      case 'Failed': return 'danger';
      case 'Blocked': return 'warning';
      case 'Not Executed': return 'muted';
      default: return 'info';
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading test cases...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search test cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-border hover:bg-muted rounded-lg transition-colors">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Cases List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Workstream</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tester</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.map((testCase, index) => (
                    <tr 
                      key={testCase.id} 
                      className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                      onClick={() => setSelectedTestCase(testCase)}
                    >
                      <td className="py-3 px-4 font-mono text-sm">{testCase.id}</td>
                      <td className="py-3 px-4 font-medium">{testCase.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{testCase.workstream}</td>
                      <td className="py-3 px-4 text-sm">{testCase.type}</td>
                      <td className="py-3 px-4">
                        <StatusPill status={getStatusPillType(testCase.executionStatus)}>
                          {testCase.executionStatus}
                        </StatusPill>
                      </td>
                      <td className="py-3 px-4 text-sm">{testCase.tester}</td>
                      <td className="py-3 px-4">
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Test Case Details Drawer */}
        <div className="lg:col-span-1">
          {selectedTestCase ? (
            <Card className="sticky top-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground mb-2">{selectedTestCase.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm text-muted-foreground font-mono">{selectedTestCase.id}</span>
                    <StatusPill status={getStatusPillType(selectedTestCase.executionStatus)}>
                      {selectedTestCase.executionStatus}
                    </StatusPill>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedTestCase.description}</p>
                </div>

                {selectedTestCase.steps && (
                  <div>
                    <h4 className="font-medium text-card-foreground mb-2">Test Steps</h4>
                    <ol className="space-y-2">
                      {selectedTestCase.steps.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex">
                          <span className="font-medium text-primary mr-2">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Expected Results</h4>
                  <p className="text-sm text-muted-foreground">{selectedTestCase.expectedResults}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                      <Calendar size={14} />
                      <span>Planned Date</span>
                    </div>
                    <div className="font-medium">{selectedTestCase.plannedDate || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                      <Calendar size={14} />
                      <span>Actual Date</span>
                    </div>
                    <div className="font-medium">{selectedTestCase.actualDate || 'Not executed'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                      <User size={14} />
                      <span>Tester</span>
                    </div>
                    <div className="font-medium">{selectedTestCase.tester || 'Unassigned'}</div>
                  </div>
                </div>

                {selectedTestCase.failedStatusDescription && (
                  <div className="border border-danger/20 bg-danger/5 p-3 rounded-lg">
                    <h4 className="font-medium text-danger mb-1">Failure Details</h4>
                    <p className="text-sm text-muted-foreground">{selectedTestCase.failedStatusDescription}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground py-2 rounded-lg font-medium transition-colors text-sm">
                    Execute
                  </button>
                  <button className="flex-1 border border-border hover:bg-muted py-2 rounded-lg font-medium transition-colors text-sm">
                    Edit
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <div className="text-center py-8">
                <Eye size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Select a test case to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCasesTab;