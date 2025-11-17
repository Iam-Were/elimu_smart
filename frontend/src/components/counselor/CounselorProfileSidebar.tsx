import React from 'react';
import Parse from 'parse';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useCounselorStats } from '../../hooks/useCounselorStats';
import { 
  User, 
  Star, 
  Users, 
  Crown, 
  TrendingUp,
  Briefcase,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/button';
import { Badge } from '../ui/badge';

const CounselorProfileSidebar: React.FC = () => {
  const user = Parse.User.current();
  const { stats, isLoading, error } = useCounselorStats();

  if (!user) return null;

  // Get counselor details from user object
  const firstName = user.get('firstName') || '';
  const lastName = user.get('lastName') || '';
  const fullName = `${firstName} ${lastName}`.trim() || user.get('username') || 'Counselor';
  const specializations = user.get('specializations') || ['Career Guidance'];
  const rating = user.get('rating') || 4.7;
  const title = user.get('title') || 'Career Counselor';

  // Get initials for avatar
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="sticky top-6 space-y-4">
      {/* Main Profile Card */}
      <Card className="border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(fullName)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {fullName}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 justify-center">
                <Briefcase className="h-3 w-3" />
                {title}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
              <span className="font-semibold text-yellow-900">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-yellow-700">rating</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 border-t border-yellow-100">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>Unable to load stats</span>
            </div>
          )}

          {/* Stats */}
          {!isLoading && !error && stats && (
            <>
              {/* Student Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    Students
                  </span>
                  <span className="font-semibold text-gray-900">
                    {stats.assignedStudents}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Premium
                  </span>
                  <span className="font-semibold text-yellow-700">
                    {stats.premiumStudents}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Earnings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    This Month
                  </span>
                  <span className="font-semibold text-green-700">
                    KES {stats.monthlyEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Today's Earnings</span>
                  <span className="text-sm font-medium text-gray-700">
                    KES {stats.todayEarnings.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Activity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Active Chats</span>
                  <span className="text-sm font-medium text-blue-700">
                    {stats.activeChats}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Unread Messages</span>
                  <span className="text-sm font-medium text-orange-700">
                    {stats.unreadMessages}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Specializations */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Specializations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {specializations.slice(0, 3).map((spec: string, idx: number) => (
                <Badge 
                  key={idx}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          {/* View Profile Button */}
          <Button
            variant="outline"
            className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            onClick={() => window.location.href = '/counselor/profile'}
          >
            <User className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselorProfileSidebar;
