import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const ContentModeration: React.FC = () => {
  const stats = {
    total: 2847,
    pending: 23,
    approved: 2756,
    flagged: 68
  };

  const handleAction = (action: string) => {
    toast.success('Action Completed', {
      description: `Content has been ${action}d successfully`
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Content Moderation</h1>
            <p className="text-lg text-muted-foreground">
              Review and moderate user-generated content
            </p>
          </div>
          <div className="flex gap-2">
            {stats.pending > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {stats.pending} Pending Review
              </Badge>
            )}
            {stats.flagged > 0 && (
              <Badge variant="destructive">
                {stats.flagged} Flagged
              </Badge>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-sm text-muted-foreground uppercase font-bold">
                  Total Content
                </p>
                <span>👁️</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-sm text-muted-foreground uppercase font-bold">
                  Pending Review
                </p>
                <span>🕐</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-sm text-muted-foreground uppercase font-bold">
                  Approved
                </p>
                <span>✅</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-sm text-muted-foreground uppercase font-bold">
                  Flagged
                </p>
                <span>⚠️</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
            </div>
          </Card>
        </div>

        {/* Content Management Message */}
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Content Moderation System</h3>
          <p className="text-muted-foreground mb-4">
            Advanced moderation tools will be available in the full platform release.
          </p>
          <button 
            onClick={() => handleAction('process')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
          >
            Process All Pending
          </button>
        </Card>
      </div>
    </div>
  );
};