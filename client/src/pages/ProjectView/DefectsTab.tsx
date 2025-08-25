import React, { useState, useEffect } from 'react';
import { listProjectDefects } from '../../services/api';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/common/primitives';
import { Search, Filter, Bug, Calendar, User } from 'lucide-react';

const DefectsTab = ({ projectId }) => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        const data = await listProjectDefects(projectId);
        setDefects(data);
      } catch (error) {
        console.error('Error fetching defects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefects();
  }, [projectId]);

  const getStatusPillType = (status) => {
    switch (status) {
      case 'Open': return 'danger';
      case 'Assigned': return 'warning';
      case 'Escalated': return 'danger';
      case 'Retest': return 'info';
      case 'To Deploy': return 'warning';
      case 'Reopen': return 'danger';
      case 'Closed': return 'success';
      default: return 'muted';
    }
  };

  const getSeverityPillType = (severity) => {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'muted';
      default: return 'muted';
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading defects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search defects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Escalated">Escalated</option>
              <option value="Retest">Retest</option>
              <option value="To Deploy">To Deploy</option>
              <option value="Reopen">Reopen</option>
              <option value="Closed">Closed</option>
            </select>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="all">All Severity</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Defects Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Severity</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody>
              {defects.map((defect, index) => (
                <tr 
                  key={defect.id} 
                  className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-sm text-primary">{defect.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-card-foreground">{defect.title}</div>
                    {defect.relatedTestCaseId && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Related: {defect.relatedTestCaseId}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusPill status={getSeverityPillType(defect.severity)}>
                      {defect.severity}
                    </StatusPill>
                  </td>
                  <td className="py-3 px-4">
                    <StatusPill status={getStatusPillType(defect.status)}>
                      {defect.status}
                    </StatusPill>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-muted-foreground" />
                      <span className="text-sm">{defect.owner || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(defect.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-muted-foreground">
                      {defect.updatedAt 
                        ? new Date(defect.updatedAt).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
              <Bug className="text-danger" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {defects.filter(d => d.severity === 'Critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Bug className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {defects.filter(d => d.severity === 'High').length}
              </div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Bug className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {defects.filter(d => d.status === 'Closed').length}
              </div>
              <div className="text-sm text-muted-foreground">Closed</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <Bug className="text-info" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{defects.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty state */}
      {defects.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Bug size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No defects found</h3>
            <p className="text-muted-foreground">Great! No bugs have been reported for this project</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DefectsTab;