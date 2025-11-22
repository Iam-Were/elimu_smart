import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Plus, Edit, ChevronRight, ExternalLink } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialUrl?: string;
  icon?: React.ReactNode;
}

interface AchievementsCardProps {
  assessments?: Array<{
    id: string;
    type: string;
    title: string;
    completedAt: string;
    results?: {
      hollandCode?: string;
      averageScore?: number;
    };
  }>;
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({
  assessments = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert assessments to achievements
  const achievements: Achievement[] = assessments.map((assessment) => {
    let title = assessment.title;

    if (assessment.type === 'riasec' && assessment.results?.hollandCode) {
      title = `RIASEC Assessment - ${assessment.results.hollandCode} Type`;
    } else if (assessment.type === 'skills' && assessment.results?.averageScore) {
      title = `Skills Assessment - ${assessment.results.averageScore}% Average`;
    }

    return {
      id: assessment.id,
      title,
      issuer: 'Elimu Smart',
      issuedDate: new Date(assessment.completedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      icon: <Trophy className="h-5 w-5" />
    };
  });

  const visibleAchievements = isExpanded ? achievements : achievements.slice(0, 3);
  const hasMore = achievements.length > 3;

  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              Achievements & Milestones
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-gradient-to-br from-orange-50/30 to-white rounded-lg border-2 border-dashed border-orange-200">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <p className="font-semibold text-base mb-2">Start building your achievements</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Complete assessments and reach milestones to earn badges and certifications
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-600" />
            Achievements & Milestones
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Add</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Edit</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleAchievements.map((achievement) => (
          <div key={achievement.id} className="flex gap-4">
            {/* Achievement Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600">
                {achievement.icon}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 mb-1">
                {achievement.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {achievement.issuer}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-sm text-gray-500">
                  Completed: {achievement.issuedDate}
                </p>
                {achievement.credentialUrl && (
                  <button className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                    View credential
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Show All Button */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center pt-4 text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1"
          >
            {isExpanded ? (
              `Show less`
            ) : (
              <>
                Show all {achievements.length} achievements & certifications
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
};
