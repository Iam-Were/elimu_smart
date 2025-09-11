import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Linkedin, 
  ExternalLink, 
  CheckCircle, 
  TrendingUp,
  MessageSquare,
  Award,
  BookOpen,
  Target,
  Lightbulb
} from 'lucide-react';
import Parse from '@/config/parse';

interface ProfessionalInsight {
  name: string;
  title: string;
  company: string;
  careerPath: string[];
  education: string;
  keyInsights: string[];
  linkedinUrl?: string;
  inspirationQuote: string;
}

interface NetworkingRecommendation {
  category: string;
  description: string;
  strategy: string;
  messageTemplate: string;
}

interface ProfileOptimization {
  headlines: string[];
  summaryTemplate: string;
  skillsSuggestions: string[];
  keywordOptimization: string[];
}

export const ProfessionalNetworkingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'insights' | 'networking' | 'content'>('profile');
  const [professionalInsights, setProfessionalInsights] = useState<ProfessionalInsight[]>([]);
  const [networkingRecommendations, setNetworkingRecommendations] = useState<NetworkingRecommendation[]>([]);
  const [profileOptimization, setProfileOptimization] = useState<ProfileOptimization | null>(null);
  const [loading, setLoading] = useState(true);
  const [userIndustry] = useState<string>('technology');

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        const result = await Parse.Cloud.run('getLinkedInProfessionalInsights', {
          industry: userIndustry,
          careerLevel: 'entry'
        });
        
        setProfessionalInsights(result.industryLeaders || []);
        setNetworkingRecommendations(result.networkingRecommendations || []);
        setProfileOptimization(result.profileOptimization || null);
      } catch (error) {
        console.error('Error fetching professional data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [userIndustry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional Networking Hub</h1>
              <p className="text-gray-600">Build your professional network and industry connections</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-blue-900 font-medium">Why Professional Networking Matters</p>
              <p className="text-blue-800 text-sm">85% of jobs are filled through networking. Start building meaningful professional relationships now!</p>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="grid w-full grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'profile' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4" />
              Profile Builder
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'insights' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Industry Insights
            </button>
            <button
              onClick={() => setActiveTab('networking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'networking' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Networking Strategy
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'content' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Content Strategy
            </button>
          </div>

          {/* Profile Optimization Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">LinkedIn Profile Optimization</h3>
                  </div>
                  <p className="text-gray-600">
                    Create a compelling student LinkedIn profile that attracts opportunities
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Headline Suggestions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Professional Headlines</h4>
                    <div className="space-y-2">
                      {profileOptimization?.headlines.map((headline, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                          <p className="text-gray-800">{headline}</p>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigator.clipboard.writeText(headline)}
                          >
                            Copy Headline
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Suggestions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recommended Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileOptimization?.skillsSuggestions.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary Template</h3>
                  <p className="text-gray-600">
                    Customize this template for your LinkedIn summary
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-800 whitespace-pre-line text-sm">
                      {profileOptimization?.summaryTemplate}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button 
                      onClick={() => navigator.clipboard.writeText(profileOptimization?.summaryTemplate || '')}
                      className="w-full"
                    >
                      Copy Summary Template
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open LinkedIn Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Industry Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Kenya Industry Leaders to Follow</h3>
                  </div>
                  <p className="text-gray-600">
                    Learn from successful professionals in your field
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionalInsights.map((leader, index) => (
                      <Card key={index} className="border border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {leader.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{leader.name}</h4>
                              <p className="text-sm text-gray-600">{leader.title}</p>
                              <p className="text-sm text-blue-600">{leader.company}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2">Career Path:</h5>
                            <div className="space-y-1">
                              {leader.careerPath.map((step, stepIndex) => (
                                <div key={stepIndex} className="text-sm text-gray-600 flex items-center">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                  {step}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2">Key Insights:</h5>
                            <div className="space-y-1">
                              {leader.keyInsights.map((insight, insightIndex) => (
                                <p key={insightIndex} className="text-sm text-gray-600 italic">
                                  "{insight}"
                                </p>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                            <p className="text-sm text-blue-800 italic">"{leader.inspirationQuote}"</p>
                          </div>
                          
                          {leader.linkedinUrl && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full"
                              onClick={() => window.open(leader.linkedinUrl, '_blank')}
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              View LinkedIn Profile
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Networking Strategy Tab */}
          {activeTab === 'networking' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Strategic Networking Plan</h3>
                  </div>
                  <p className="text-gray-600">
                    Build meaningful professional relationships step by step
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {networkingRecommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {recommendation.category}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {recommendation.description}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-800 text-sm">Strategy:</h5>
                          <p className="text-gray-600 text-sm">{recommendation.strategy}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800 text-sm">Message Template:</h5>
                          <div className="p-3 bg-gray-50 rounded border">
                            <p className="text-gray-700 text-sm">{recommendation.messageTemplate}</p>
                          </div>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigator.clipboard.writeText(recommendation.messageTemplate)}
                          >
                            Copy Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Networking Progress Tracker</h3>
                  <p className="text-gray-600">
                    Track your professional networking goals
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { goal: "Optimize LinkedIn Profile", completed: true, progress: 100 },
                      { goal: "Connect with 10 Alumni", completed: false, progress: 70 },
                      { goal: "Follow 20 Industry Leaders", completed: false, progress: 45 },
                      { goal: "Join 5 Professional Groups", completed: false, progress: 20 },
                      { goal: "Share 1 Industry Insight", completed: false, progress: 0 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          )}
                          <span className={`text-sm ${item.completed ? 'text-green-800' : 'text-gray-700'}`}>
                            {item.goal}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.completed ? 'bg-green-600' : 'bg-orange-600'}`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-10">{item.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Strategy Tab */}
          {activeTab === 'content' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Professional Content Strategy</h3>
                </div>
                <p className="text-gray-600">
                  Build your professional brand through thoughtful content sharing
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Content Ideas for Students</h4>
                    <div className="space-y-3">
                      {[
                        "Share insights from your coursework and projects",
                        "Comment thoughtfully on industry news and trends", 
                        "Write about challenges you're solving in your studies",
                        "Share your learning journey and skill development",
                        "Highlight achievements and project milestones",
                        "Ask thoughtful questions to industry professionals"
                      ].map((idea, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <p className="text-gray-700 text-sm">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Engagement Best Practices</h4>
                    <div className="space-y-3">
                      {[
                        "Post 2-3 times per week for consistent visibility",
                        "Engage with others' content before posting your own",
                        "Use relevant hashtags to increase discoverability",
                        "Tag professionals when appropriate and respectful",
                        "Share articles with your personal insights added",
                        "Respond to comments on your posts promptly"
                      ].map((practice, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-gray-700 text-sm">{practice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};