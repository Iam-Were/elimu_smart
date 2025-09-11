import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Linkedin, 
  Users, 
  TrendingUp, 
  ExternalLink,
  Award,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfessionalNetworkingPreview: React.FC = () => {
  // Sample data that would come from useDynamicDashboard in production
  const networkingStats = {
    profileCompleteness: 65,
    connections: 23,
    weeklyGrowth: 5,
    industryEngagement: 8
  };

  const quickTips = [
    "Optimize your Linkedin headline with your career goal",
    "Connect with 3-5 professionals weekly in your field", 
    "Share one insight about your studies each week",
    "Engage with industry content before posting your own"
  ];

  const featuredProfessionals = [
    {
      name: "John Walubengo",
      title: "ICT Lecturer & Digital Policy Expert",
      company: "Multimedia University",
      insight: "Technology in Kenya is growing rapidly - focus on mobile and fintech"
    },
    {
      name: "Juliana Rotich", 
      title: "Co-founder & Executive Director",
      company: "BRCK Inc",
      insight: "Solve real African problems with technology - there's huge opportunity here"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Linkedin className="h-5 w-5" />
            </div>
            Professional Networking Hub
            <Badge className="bg-green-500 text-white">New!</Badge>
          </CardTitle>
          <CardDescription>
            Build your professional network and connect with industry leaders in Kenya
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">
                {networkingStats.profileCompleteness}%
              </div>
              <div className="text-xs text-gray-600">Profile Complete</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {networkingStats.connections}
              </div>
              <div className="text-xs text-gray-600">Connections</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                +{networkingStats.weeklyGrowth}
              </div>
              <div className="text-xs text-gray-600">This Week</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {networkingStats.industryEngagement}
              </div>
              <div className="text-xs text-gray-600">Industry Posts</div>
            </div>
          </div>

          {/* Quick Action Tips */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Quick Networking Wins
            </h4>
            <div className="space-y-2">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Industry Leaders */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              Kenya Tech Leaders to Follow
            </h4>
            
            <div className="space-y-3">
              {featuredProfessionals.map((professional, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{professional.name}</h5>
                      <p className="text-sm text-gray-600">{professional.title}</p>
                      <p className="text-sm text-blue-600">{professional.company}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic mb-3">
                    "{professional.insight}"
                  </p>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Linkedin className="h-3 w-3" />
                    View Profile
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">
                  Ready to Build Your Network?
                </h4>
                <p className="text-sm text-orange-800">
                  Get step-by-step guidance, templates, and connect with industry professionals
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/guidance/professional-networking">
                    <Users className="h-4 w-4 mr-1" />
                    Learn More
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link to="/guidance/professional-networking">
                    <Linkedin className="h-4 w-4 mr-1" />
                    Start Networking
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};