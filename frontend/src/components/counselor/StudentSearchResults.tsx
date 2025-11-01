import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, GraduationCap, Calendar, Trophy } from 'lucide-react';

interface StudentResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  school: string;
  profileCompletion: number;
  assessmentCount: number;
  hasSubscription: boolean;
  careerInterest: string;
  joinedAt: Date;
  lastActive: Date;
}

interface StudentSearchResultsProps {
  results: StudentResult[];
  loading: boolean;
  totalCount: number;
  onReachOut: (student: StudentResult) => void;
}

export const StudentSearchResults: React.FC<StudentSearchResultsProps> = ({
  results,
  loading,
  totalCount,
  onReachOut,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
        <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getProfileCompletionColor = (completion: number) => {
    if (completion >= 80) return 'text-green-600';
    if (completion >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Found {totalCount} {totalCount === 1 ? 'student' : 'students'}
        </h3>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-lg border hover:shadow-md transition-shadow p-5 space-y-4"
          >
            {/* Student Header */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-yellow-600">
                <AvatarFallback className="bg-transparent text-white font-semibold">
                  {getInitials(student.firstName, student.lastName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {student.firstName} {student.lastName}
                </h4>
                <p className="text-sm text-gray-600 truncate">{student.email}</p>
              </div>

              {student.hasSubscription && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  Premium
                </Badge>
              )}
            </div>

            {/* Student Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <span>{student.grade} • {student.school}</span>
              </div>

              {student.careerInterest && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Trophy className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{student.careerInterest} Type</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Last active {getTimeSince(student.lastActive)}</span>
              </div>
            </div>

            {/* Assessment Count */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Assessments</span>
              <span className="font-semibold text-gray-900">{student.assessmentCount}</span>
            </div>

            {/* Profile Completion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Profile Completion</span>
                <span className={`font-semibold ${getProfileCompletionColor(student.profileCompletion)}`}>
                  {student.profileCompletion}%
                </span>
              </div>
              <Progress value={student.profileCompletion} className="h-2" />
            </div>

            {/* Reach Out Button */}
            <Button
              onClick={() => onReachOut(student)}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              size="sm"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Reach Out
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
