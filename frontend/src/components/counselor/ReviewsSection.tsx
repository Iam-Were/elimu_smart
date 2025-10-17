import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, CheckCircle2, MessageSquare, TrendingUp } from 'lucide-react';
import Parse from 'parse';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
  studentName: string;
  studentAvatar?: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  totalCount: number;
}

interface ReviewsSectionProps {
  counselorId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ counselorId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 5;

  useEffect(() => {
    loadReviews(true);
  }, [counselorId]);

  const loadReviews = async (initial = false) => {
    if (initial) {
      setLoading(true);
      setSkip(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentSkip = initial ? 0 : skip;
      
      const result = await Parse.Cloud.run('getCounselorReviews', {
        counselorId,
        limit,
        skip: currentSkip
      });

      if (result.success) {
        const newReviews = result.reviews.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt)
        }));

        if (initial) {
          setReviews(newReviews);
        } else {
          setReviews(prev => [...prev, ...newReviews]);
        }

        setStats(result.statistics);
        setHasMore(result.pagination.hasMore);
        setSkip(currentSkip + limit);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          Reviews & Ratings
        </CardTitle>
        <CardDescription>
          Feedback from students who have attended sessions
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Rating Overview */}
        {stats && stats.totalReviews > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  {renderStars(Math.round(stats.averageRating), 'lg')}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600 font-semibold mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Highly Rated</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Students recommend
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                      {count} {count === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to book a session and leave a review!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {review.studentAvatar && (
                    <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                  )}
                  <AvatarFallback className="bg-orange-100 text-orange-700">
                    {review.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{review.studentName}</span>
                    {review.isVerified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified Session
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating, 'sm')}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => loadReviews(false)}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More Reviews'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
