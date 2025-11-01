import { useState } from 'react';
import { useStudentSearch } from '@/hooks/counselor/useStudentSearch';
import { StudentSearchFilters } from '@/components/counselor/StudentSearchFilters';
import { StudentSearchResults } from '@/components/counselor/StudentSearchResults';
import { OutreachDialog } from '@/components/counselor/OutreachDialog';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Parse from 'parse';

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

export const DiscoverStudentsPage = () => {
  const navigate = useNavigate();
  const user = Parse.User.current();
  const {
    loading,
    results,
    totalCount,
    searchStudents,
    initiateOutreach,
  } = useStudentSearch();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [grade, setGrade] = useState('all');
  const [school, setSchool] = useState('');
  const [hasAssessments, setHasAssessments] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [careerInterest, setCareerInterest] = useState('all');
  const [minProfileCompletion, setMinProfileCompletion] = useState(0);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'grade' | 'profileCompletion'>('recent');

  // Outreach dialog state
  const [outreachDialogOpen, setOutreachDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  const handleSearch = async () => {
    try {
      await searchStudents({
        searchTerm,
        grade: grade === 'all' ? '' : grade,
        school,
        hasAssessments,
        hasSubscription,
        careerInterest: careerInterest === 'all' ? '' : careerInterest,
        minProfileCompletion,
        sortBy,
      });
    } catch {
      toast.error('Failed to search students. Please try again.');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setGrade('all');
    setSchool('');
    setHasAssessments(null);
    setHasSubscription(null);
    setCareerInterest('all');
    setMinProfileCompletion(0);
    setSortBy('recent');
  };

  const handleReachOut = (student: StudentResult) => {
    setSelectedStudent(student);
    setOutreachDialogOpen(true);
  };

  const handleSendOutreach = async (studentId: string, message: string) => {
    try {
      const response = await initiateOutreach(studentId, message);
      toast.success(`Introduction sent to ${response.studentName}!`);

      // Offer to navigate to inbox
      setTimeout(() => {
        toast.info('You can continue the conversation in your inbox', {
          action: {
            label: 'Go to Inbox',
            onClick: () => navigate('/inbox'),
          },
        });
      }, 1000);
    } catch {
      toast.error('Failed to send introduction. Please try again.');
      throw new Error('Failed to send outreach');
    }
  };

  const counselorName = user
    ? `${user.get('firstName') || ''} ${user.get('lastName') || ''}`.trim() || 'Counselor'
    : 'Counselor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Discover Students</h1>
              <p className="text-yellow-100 mt-1">
                Find and reach out to students who could benefit from your guidance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Filters */}
        <StudentSearchFilters
          searchTerm={searchTerm}
          grade={grade}
          school={school}
          hasAssessments={hasAssessments}
          hasSubscription={hasSubscription}
          careerInterest={careerInterest}
          minProfileCompletion={minProfileCompletion}
          sortBy={sortBy}
          onSearchTermChange={setSearchTerm}
          onGradeChange={setGrade}
          onSchoolChange={setSchool}
          onHasAssessmentsChange={setHasAssessments}
          onHasSubscriptionChange={setHasSubscription}
          onCareerInterestChange={setCareerInterest}
          onMinProfileCompletionChange={setMinProfileCompletion}
          onSortByChange={setSortBy}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Search Results */}
        <StudentSearchResults
          results={results}
          loading={loading}
          totalCount={totalCount}
          onReachOut={handleReachOut}
        />
      </div>

      {/* Outreach Dialog */}
      <OutreachDialog
        open={outreachDialogOpen}
        onOpenChange={setOutreachDialogOpen}
        student={selectedStudent}
        counselorName={counselorName}
        onSend={handleSendOutreach}
      />
    </div>
  );
};
