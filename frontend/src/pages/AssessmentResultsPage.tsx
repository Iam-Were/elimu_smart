import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardCheck,
  Calendar,
  TrendingUp,
  Loader2,
  ArrowRight,
  Download,
  Share2,
  Trophy,
  Target,
  CheckCircle2,
  Brain,
  GraduationCap,
  Briefcase,
  BookOpen,
  Layers,
} from 'lucide-react';
import { getParse } from '@/config/parse';

interface AssessmentResult {
  id: string;
  type: string;
  title: string;
  completedAt: Date;
  results: {
    hollandCode?: string;
    primaryType?: string;
    scores?: Record<string, number>;
    careerMatches?: Array<{ name: string; compatibility: number }>;
  };
}

interface AssessmentSummary {
  hollandCode: string | null;
  primaryType: string | null;
  topCareers: Array<{ name: string }>;
  assessmentsCompleted: number;
}

const ASSESSMENT_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; ring: string }> = {
  riasec: {
    color: 'text-orange-600',
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    border: 'border-orange-200',
    ring: '#f97316',
    icon: <Brain className="h-5 w-5 text-white" />,
  },
  skills: {
    color: 'text-blue-600',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-200',
    ring: '#3b82f6',
    icon: <TrendingUp className="h-5 w-5 text-white" />,
  },
  university: {
    color: 'text-green-600',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-200',
    ring: '#22c55e',
    icon: <GraduationCap className="h-5 w-5 text-white" />,
  },
  career: {
    color: 'text-purple-600',
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-purple-200',
    ring: '#a855f7',
    icon: <Briefcase className="h-5 w-5 text-white" />,
  },
  subjects: {
    color: 'text-amber-600',
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    border: 'border-amber-200',
    ring: '#f59e0b',
    icon: <BookOpen className="h-5 w-5 text-white" />,
  },
};

const DEFAULT_META = {
  color: 'text-gray-600',
  bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
  border: 'border-gray-200',
  ring: '#6b7280',
  icon: <Layers className="h-5 w-5 text-white" />,
};

const ICON_BG_COLORS: Record<string, string> = {
  riasec: 'from-orange-500 to-orange-600',
  skills: 'from-blue-500 to-blue-600',
  university: 'from-green-500 to-green-600',
  career: 'from-purple-500 to-purple-600',
  subjects: 'from-amber-500 to-amber-600',
};

const TOTAL_ASSESSMENTS = 5;

export const AssessmentResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessmentResults();
  }, []);

  const fetchAssessmentResults = async () => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getUserAssessmentResults', {});
      if (result.success && result.hasResults) {
        setAssessments(result.assessments || []);
        setSummary(result.summary);
      }
    } catch (err) {
      console.error('Failed to fetch assessment results:', err);
      setError('Failed to load your assessment results');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  const handleShare = async (e: React.MouseEvent, assessmentId: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/profile/assessments/${assessmentId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Elimu Smart Assessment Results', url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-3 text-muted-foreground">Loading your assessment results...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-red-600">{error}</p>
                <Button onClick={() => fetchAssessmentResults()} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedCount = assessments.length;
  const progressPct = Math.round((completedCount / TOTAL_ASSESSMENTS) * 100);
  const circumference = 2 * Math.PI * 36; // r=36

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background print:bg-white">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Note: H1 "Assessment Center" is provided by Sprint18Layout */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-orange-500" />
            Your Assessment Results
          </h2>
          <p className="text-muted-foreground">
            View all your completed career assessments and track your progress
          </p>
        </div>

        {/* Hero: Profile at a Glance + Progress Ring */}
        {summary && summary.hollandCode && (
          <Card className="mb-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-orange-600" />
                Your Profile at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Progress Ring */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
                      <circle
                        cx="44" cy="44" r="36"
                        fill="none" stroke="#fed7aa" strokeWidth="8"
                      />
                      <circle
                        cx="44" cy="44" r="36"
                        fill="none" stroke="#f97316" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(progressPct / 100) * circumference} ${circumference}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-orange-600">{completedCount}/{TOTAL_ASSESSMENTS}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Assessments<br />Complete</p>
                </div>

                {/* 3-chip summary */}
                <div className="flex flex-wrap gap-4 flex-1 justify-center md:justify-start">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm min-w-[120px]">
                    <div className="text-3xl font-bold text-orange-600 mb-1">{summary.hollandCode}</div>
                    <p className="text-xs text-muted-foreground">Holland Code</p>
                    <p className="text-xs text-muted-foreground mt-1">{summary.primaryType}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm min-w-[120px]">
                    <div className="text-xl font-bold text-blue-600 mb-1 truncate max-w-[160px]">
                      {summary.topCareers.length > 0 ? summary.topCareers[0].name : '—'}
                    </div>
                    <p className="text-xs text-muted-foreground">Top Career Match</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm min-w-[120px]">
                    <div className="text-3xl font-bold text-green-600 mb-1">{completedCount}</div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xs text-muted-foreground">{TOTAL_ASSESSMENTS - completedCount} remaining</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assessment List */}
        {assessments.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Target className="h-16 w-16 text-muted-foreground/50" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Assessments Completed Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your career journey by completing assessments to discover your strengths and interests.
                  </p>
                  <Button
                    onClick={() => navigate('/assessment')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {assessments.map((assessment) => {
              const meta = ASSESSMENT_META[assessment.type] ?? DEFAULT_META;
              const iconBg = ICON_BG_COLORS[assessment.type] ?? 'from-gray-500 to-gray-600';
              return (
                <Card
                  key={assessment.id}
                  className={`hover:shadow-lg transition-all duration-200 cursor-pointer border ${meta.border}`}
                  onClick={() => navigate(`/profile/assessments/${assessment.type}/${assessment.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 bg-gradient-to-br ${iconBg} rounded-lg`}>
                            {meta.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(assessment.completedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* RIASEC Results Preview */}
                    {assessment.type === 'riasec' && assessment.results && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className={`p-3 ${meta.bg} rounded-lg`}>
                          <p className="text-xs text-muted-foreground mb-1">Holland Code</p>
                          <p className={`text-lg font-bold ${meta.color}`}>
                            {assessment.results.hollandCode}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Primary Type</p>
                          <p className="text-sm font-semibold text-blue-600">
                            {assessment.results.primaryType}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Top Career Match</p>
                          <p className="text-sm font-semibold text-green-600 truncate">
                            {assessment.results.careerMatches?.[0]?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Print / Save PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e: React.MouseEvent) => handleShare(e, assessment.id)}
                      >
                        <Share2 className="mr-2 h-3 w-3" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {assessments.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 print:hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Want to explore more about yourself?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Take additional assessments to refine your career path and discover new opportunities.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/assessment')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  More Assessments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssessmentResultsPage;
