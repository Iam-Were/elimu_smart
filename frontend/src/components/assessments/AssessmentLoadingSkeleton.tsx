import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const AssessmentLoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header Skeleton */}
      <Card className="mb-8 bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card Skeleton */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-6" />

          {/* Response Options Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
};

export default AssessmentLoadingSkeleton;
