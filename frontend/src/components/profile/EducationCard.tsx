import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, Edit, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationEntry {
  id: string;
  type: 'current' | 'target';
  institution: string;
  program?: string;
  level?: string;
  expectedDate?: string;
  expectedGrade?: string;
  expectedPoints?: number;
  requiredPoints?: number;
  status?: 'on-track' | 'at-risk' | 'achieved';
}

interface EducationCardProps {
  currentSchool?: string;
  formLevel?: string;
  expectedKCSEDate?: string;
  expectedGrade?: string;
  expectedPoints?: number;
  targetUniversities?: Array<{
    name: string;
    program: string;
    requiredPoints: number;
  }>;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  currentSchool,
  formLevel,
  expectedKCSEDate,
  expectedGrade,
  expectedPoints,
  targetUniversities = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const educationEntries: EducationEntry[] = [];

  // Current education
  if (currentSchool && formLevel) {
    educationEntries.push({
      id: 'current',
      type: 'current',
      institution: currentSchool,
      level: formLevel,
      expectedDate: expectedKCSEDate,
      expectedGrade,
      expectedPoints
    });
  }

  // Target universities
  targetUniversities.forEach((uni, index) => {
    const status: 'on-track' | 'at-risk' | 'achieved' =
      expectedPoints && uni.requiredPoints
        ? expectedPoints >= uni.requiredPoints
          ? 'on-track'
          : 'at-risk'
        : 'on-track';

    educationEntries.push({
      id: `target-${index}`,
      type: 'target',
      institution: uni.name,
      program: uni.program,
      requiredPoints: uni.requiredPoints,
      status
    });
  });

  const visibleEntries = isExpanded ? educationEntries : educationEntries.slice(0, 2);
  const hasMore = educationEntries.length > 2;

  if (educationEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-600" />
              Education
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
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <p className="font-semibold text-base mb-2">Add your education details</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Share your current school and target universities to get personalized recommendations
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
            <GraduationCap className="h-5 w-5 text-orange-600" />
            Education
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
        {visibleEntries.map((entry) => (
          <div key={entry.id} className="flex gap-4">
            {/* Institution Logo/Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 mb-1">
                {entry.institution}
              </h3>

              {entry.type === 'current' && (
                <>
                  <p className="text-sm text-gray-600 mb-1">
                    {entry.level} Student
                  </p>
                  {entry.expectedDate && (
                    <p className="text-sm text-gray-500">
                      Expected KCSE: {entry.expectedDate}
                    </p>
                  )}
                  {entry.expectedGrade && entry.expectedPoints && (
                    <p className="text-sm text-gray-500">
                      Expected Grade: {entry.expectedGrade} ({entry.expectedPoints} points)
                    </p>
                  )}
                </>
              )}

              {entry.type === 'target' && (
                <>
                  <p className="text-sm text-gray-600 mb-1">
                    {entry.program}
                  </p>
                  {entry.requiredPoints && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-gray-500">
                        Required: {entry.requiredPoints} points
                      </p>
                      {entry.status && (
                        <Badge
                          variant={entry.status === 'on-track' ? 'default' : 'destructive'}
                          className={`text-xs ${
                            entry.status === 'on-track'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {entry.status === 'on-track' ? 'On track' : 'At risk'}
                        </Badge>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* See More/Less Button */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center pt-4 text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1"
          >
            {isExpanded ? (
              <>
                ...see less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                ...see more
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
};
