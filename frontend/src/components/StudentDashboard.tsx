import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  GraduationCap, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Calendar, 
  MapPin, 
  Star,
  ChevronRight,
  BarChart3,
  Users,
  Award,
  Clock,
  LogOut
} from 'lucide-react';
import { kuccpsService, KuccpsPlacementData } from '../services/kuccpsService';

interface StudentDashboardProps {
  onSignOut?: () => void;
}

const StudentDashboard = ({ onSignOut }: StudentDashboardProps) => {
  const [kuccpsData, setKuccpsData] = useState<KuccpsPlacementData[]>([]);
  const [loading, setLoading] = useState(true);
  const studentGrade = 82.3; // Mock student predicted grade

  useEffect(() => {
    const loadKuccpsData = async () => {
      try {
        const recommendedCourses = await kuccpsService.getRecommendedCourses(studentGrade);
        setKuccpsData(recommendedCourses);
      } catch (error) {
        console.error('Error loading KUCCPS data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKuccpsData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex!</h1>
            <p className="text-gray-600 mt-1">Continue your career journey</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Form 4 Student
            </Badge>
            <Button className="bg-primary hover:bg-primary/90">
              Complete Assessment
            </Button>
            <Button 
              variant="outline" 
              onClick={onSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Career Match</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">KCSE Prediction</p>
                  <p className="text-2xl font-bold text-gray-900">B+</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Universities</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Scholarships</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* KUCCPS Placement Tracker */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>KUCCPS Placement Tracker</span>
                  </span>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading KUCCPS data...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kuccpsData.slice(0, 2).map((course, index) => {
                      const latestCutoff = course.cut_off_2016 || course.cut_off_2015 || course.cut_off_2014 || 0;
                      const matchPercentage = kuccpsService.calculateMatchPercentage(studentGrade, latestCutoff);
                      const matchLevel = kuccpsService.getMatchLevel(matchPercentage);
                      const gradientColors = index === 0 
                        ? 'from-blue-50 to-blue-100' 
                        : 'from-green-50 to-green-100';
                      const badgeColors = index === 0 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700';

                      return (
                        <Card key={course.similar_code} className={`bg-gradient-to-br ${gradientColors} border-0`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {course.course_name.length > 20 
                                  ? course.course_name.substring(0, 20) + '...' 
                                  : course.course_name}
                              </h4>
                              <Badge className={badgeColors}>{matchLevel}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{course.uni_code}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Cut-off Points</span>
                                <span className="font-medium">{latestCutoff}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Your Prediction</span>
                                <span className="font-medium text-green-600">{studentGrade}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{width: `${Math.min(matchPercentage, 100)}%`}}
                                ></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Recent KUCCPS Updates</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>New cut-off points released for 2024</span>
                      <span className="text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>University of Nairobi adds new programs</span>
                      <span className="text-gray-500">1 week ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Recommendations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Recommended Career Paths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Software Developer</h4>
                          <p className="text-sm text-gray-600">Technology</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">95% Match</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Data Scientist</h4>
                          <p className="text-sm text-gray-600">Analytics</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">89% Match</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-primary hover:bg-primary/90" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Take Career Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Universities
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Award className="w-4 h-4 mr-2" />
                  Browse Scholarships
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Ask Counselor
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">University Fair</h5>
                    <p className="text-sm text-gray-600">KICC, Nairobi</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Aug 15, 2024</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">Career Webinar</h5>
                    <p className="text-sm text-gray-600">Tech Careers in Kenya</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Aug 20, 2024</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">KCSE Mock Exams</h5>
                    <p className="text-sm text-gray-600">Preparation Tips</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Sep 1, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Career Assessment</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>University Applications</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
