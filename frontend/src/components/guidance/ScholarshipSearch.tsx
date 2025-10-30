import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getParse } from '@/config/parse';
import { useScholarshipMatches } from '@/hooks/useScholarshipMatches';
import { Award, Search, Calendar, DollarSign, Star, Loader2 } from 'lucide-react';

const ScholarshipSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Use scholarship matches hook
  const { data: scholarshipData, isLoading, error } = useScholarshipMatches();

  const handleStartApplication = async (scholarshipId: string) => {
    setIsApplying(true);
    try {
      const Parse = getParse();
      // Uses Parse function: logUserActivity
      await Parse.Cloud.run('logUserActivity', {
        activityType: 'scholarship_application_started',
        details: { scholarshipId }
      });
    } catch (error) {
      console.error('Application tracking failed:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const scholarships = scholarshipData?.scholarships || [];
  const filteredScholarships = scholarships.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Note: H1 "Guidance Center" is provided by Sprint18Layout */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Find Scholarships & Funding</h2>
          <p className="text-muted-foreground">Discover opportunities that match your profile</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? <Loader2 className="h-6 w-6 mx-auto animate-spin" /> : scholarshipData?.matches || 0}
            </div>
            <div className="text-sm text-muted-foreground">Matches</div>
          </Card>
          <Card className="text-center p-4">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? <Loader2 className="h-6 w-6 mx-auto animate-spin" /> : scholarshipData?.totalValue || 'KSh 0'}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </Card>
          <Card className="text-center p-4">
            <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? <Loader2 className="h-6 w-6 mx-auto animate-spin" /> : scholarshipData?.newThisWeek || 0}
            </div>
            <div className="text-sm text-muted-foreground">New This Week</div>
          </Card>
          <Card className="text-center p-4">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? <Loader2 className="h-6 w-6 mx-auto animate-spin" /> : filteredScholarships.length}
            </div>
            <div className="text-sm text-muted-foreground">Available Now</div>
          </Card>
        </div>

        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="border-orange-200">
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mb-4" />
              <p className="text-muted-foreground">Loading scholarship matches...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <p className="text-red-900 font-semibold mb-2">Failed to load scholarships</p>
              <p className="text-red-700 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredScholarships.length === 0 && (
          <Card className="border-orange-200">
            <CardContent className="py-12 text-center">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No scholarships found</p>
              <p className="text-muted-foreground">Try adjusting your search or check back later for new opportunities.</p>
            </CardContent>
          </Card>
        )}

        {/* Scholarship List */}
        <div className="space-y-4">
          {!isLoading && filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                      <p className="text-muted-foreground">{scholarship.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {scholarship.matchScore}% Match
                    </div>
                    <Badge className="bg-green-100 text-green-700">Open</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Deadline: {scholarship.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{scholarship.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                  <Button
                    onClick={() => handleStartApplication(scholarship.id)}
                    disabled={isApplying}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isApplying ? 'Starting...' : 'Start Application'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-orange-200 bg-gradient-to-r from-orange-50/50 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              Application Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Start Early</h4>
                <p className="text-muted-foreground">Begin your search in Form 3 for best chances</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Meet Requirements</h4>
                <p className="text-muted-foreground">Ensure you qualify before applying</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tell Your Story</h4>
                <p className="text-muted-foreground">Personal statements are crucial for success</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipSearch;