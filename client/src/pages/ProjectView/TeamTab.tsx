import React, { useState, useEffect } from 'react';
import { listProjectTeam } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, User, Mail, Phone, Award, TrendingUp } from 'lucide-react';

const TeamTab = ({ projectId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await listProjectTeam(projectId);
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [projectId]);

  if (loading) {
    return <div className="text-muted-foreground">Loading team members...</div>;
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Test Lead': return 'status-critical';
      case 'Senior Tester': return 'status-high';
      case 'Automation Engineer': return 'status-medium';
      default: return 'status-low';
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{teamMembers.length}</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {teamMembers.reduce((sum, member) => sum + member.testsExecuted, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tests Executed</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Award className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {teamMembers.reduce((sum, member) => sum + member.bugsFound, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Bugs Found</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <User className="text-info" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {Math.round(teamMembers.reduce((sum, member) => sum + member.testsExecuted, 0) / teamMembers.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Tests per Member</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover-lift">
            <CardContent>
              <div className="space-y-4">
                {/* Member Header */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground text-lg">{member.name}</h3>
                    <span className={`status-pill ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{member.testsExecuted}</div>
                    <div className="text-xs text-muted-foreground">Tests Executed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{member.bugsFound}</div>
                    <div className="text-xs text-muted-foreground">Bugs Found</div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-border hover:bg-muted rounded-lg transition-colors text-sm">
                    <Mail size={14} />
                    <span>Email</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-border hover:bg-muted rounded-lg transition-colors text-sm">
                    <Phone size={14} />
                    <span>Call</span>
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground mb-2">Recent Activity</div>
                  <div className="text-sm text-card-foreground">
                    Last active: 2 hours ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Users size={16} />
              <span>Add Member</span>
            </button>
            <button className="border border-border hover:bg-muted px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Mail size={16} />
              <span>Send Invite</span>
            </button>
            <button className="border border-border hover:bg-muted px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Award size={16} />
              <span>Manage Roles</span>
            </button>
            <button className="border border-border hover:bg-muted px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>Performance Report</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {teamMembers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Users size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No team members assigned</h3>
            <p className="text-muted-foreground mb-6">Add team members to start collaborating on this project</p>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
              Add Team Members
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeamTab;