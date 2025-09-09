import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, GraduationCap, Target, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UniversityPlacementCards from '../components/cards/UniversityPlacementCards';
import { useDynamicDashboard } from '../hooks/useDynamicDashboard';

const PlacementPage: React.FC = () => {
  const {
    universityPlacement,
    cutoffAnalysis,
    courseRecommendations,
    loading: dashboardLoading,
    logActivity
  } = useDynamicDashboard();
  
  const pageLoadTime = Date.now();
  
  // Track placement page visit
  useEffect(() => {
    logActivity('page_visit', {
      page: 'placement',
      section: 'university_placement_hub',
      timestamp: new Date().toISOString()
    });

    // Track page duration on unmount
    return () => {
      const duration = Date.now() - pageLoadTime;
      logActivity('page_duration', {
        page: 'placement',
        duration: Math.round(duration / 1000),
        timeSpent: duration
      });
    };
  }, [logActivity, pageLoadTime]);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-orange-900">
          University Placement Hub
        </h1>
        <p className="text-lg text-orange-700 max-w-3xl mx-auto">
          Navigate Kenya's university placement system with AI-powered insights. 
          Get personalized KUCCPS guidance and maximize your placement opportunities.
        </p>
      </div>

      {/* Dynamic Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              {dashboardLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {cutoffAnalysis ? cutoffAnalysis.currentPoints.toFixed(1) : '42.5'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Your Cutoff Points</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
              {dashboardLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {courseRecommendations ? courseRecommendations.totalMatches : '12'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Course Matches</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
              {dashboardLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {universityPlacement ? universityPlacement.eligiblePrograms.length : '8'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Universities</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
              {dashboardLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {cutoffAnalysis 
                ? `${Math.min(95, Math.round((cutoffAnalysis.currentPoints / cutoffAnalysis.averageRequired) * 100))}%`
                : '75%'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Placement Probability</p>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Actions */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">High Priority Actions</h2>
          <p className="text-muted-foreground">Complete these tasks to improve your placement chances</p>
        </div>
        
        <UniversityPlacementCards 
          category="all" 
          size="large" 
          maxCards={2}
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Placement Tools */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Placement Tools & Resources</h2>
          <p className="text-muted-foreground">Everything you need for successful university placement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Eligibility Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">Eligibility</Badge>
            </h3>
            <UniversityPlacementCards 
              category="eligibility" 
              size="medium" 
              showAll={true}
            />
          </div>

          {/* Placement Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700">Placement</Badge>
            </h3>
            <UniversityPlacementCards 
              category="placement" 
              size="medium" 
              showAll={true}
            />
          </div>

          {/* Recommendations Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">Recommendations</Badge>
            </h3>
            <UniversityPlacementCards 
              category="recommendations" 
              size="medium" 
              showAll={true}
            />
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-700">Progress</Badge>
            </h3>
            <UniversityPlacementCards 
              category="progress" 
              size="medium" 
              showAll={true}
            />
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-orange-50 rounded-lg p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-orange-900">About KUCCPS Placement</h3>
          <p className="text-orange-800 leading-relaxed">
            The Kenya University and Colleges Central Placements Service (KUCCPS) determines university 
            placement based on cutoff points calculated from your KCSE results. Our AI-powered system 
            simplifies this complex process, providing personalized recommendations and real-time guidance 
            to maximize your placement opportunities.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="text-orange-700 border-orange-300">Government Sponsored</Badge>
            <Badge variant="outline" className="text-orange-700 border-orange-300">Course Matching</Badge>
            <Badge variant="outline" className="text-orange-700 border-orange-300">Institution Selection</Badge>
            <Badge variant="outline" className="text-orange-700 border-orange-300">Scholarship Opportunities</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementPage;