import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  BookOpen,
  LogOut,
  Video,
  Phone,
  Mail
} from 'lucide-react';

interface CounselorDashboardProps {
  onSignOut?: () => void;
}

const CounselorDashboard = ({ onSignOut }: CounselorDashboardProps) => {
  const [counselorStats, setCounselorStats] = useState({
    totalStudents: 156,
    activeChats: 8,
    scheduledSessions: 12,
    completedSessions: 89,
    averageRating: 4.8,
    responseTime: '2.5 hours'
  });

  const [upcomingSessions, setUpcomingSessions] = useState([
    { id: 1, student: 'Alice Wanjiku', time: '10:00 AM', type: 'Career Guidance', status: 'confirmed' },
    { id: 2, student: 'John Mwangi', time: '2:00 PM', type: 'University Selection', status: 'pending' },
    { id: 3, student: 'Grace Akinyi', time: '4:30 PM', type: 'Subject Mapping', status: 'confirmed' }
  ]);

  const [recentChats, setRecentChats] = useState([
    { id: 1, student: 'David Kiprotich', message: 'Thank you for the career advice!', time: '5 min ago', unread: false },
    { id: 2, student: 'Mary Njeri', message: 'Can we schedule a follow-up session?', time: '12 min ago', unread: true },
    { id: 3, student: 'Peter Ochieng', message: 'I have questions about engineering courses', time: '1 hour ago', unread: true }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your students and counseling sessions</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              Senior Counselor
            </Badge>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2">{counselorStats.averageRating}/5</span>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{counselorStats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Chats</p>
                  <p className="text-2xl font-bold text-gray-900">{counselorStats.activeChats}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Scheduled Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{counselorStats.scheduledSessions}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Response</p>
                  <p className="text-2xl font-bold text-gray-900">{counselorStats.responseTime}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <Card key={session.id} className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{session.student}</h4>
                            <p className="text-sm text-gray-600">{session.type}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{session.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={session.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {session.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Video className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Student Progress Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Student Progress Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-blue-600">{counselorStats.completedSessions}</h4>
                    <p className="text-sm text-gray-600">Sessions Completed</p>
                    <p className="text-xs text-green-600 mt-1">↗ +15% this month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-green-600">94%</h4>
                    <p className="text-sm text-gray-600">Student Satisfaction</p>
                    <p className="text-xs text-green-600 mt-1">↗ +3% this month</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-orange-600">87%</h4>
                    <p className="text-sm text-gray-600">Goal Achievement</p>
                    <p className="text-xs text-green-600 mt-1">↗ +8% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span>Recent Messages</span>
                  </span>
                  <Badge className="bg-red-100 text-red-700">
                    {recentChats.filter(chat => chat.unread).length} unread
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentChats.map((chat) => (
                  <div key={chat.id} className={`p-3 rounded-lg border ${chat.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{chat.student}</h5>
                        <p className="text-xs text-gray-600 mt-1">{chat.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{chat.time}</p>
                      </div>
                      {chat.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  View All Messages
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-primary hover:bg-primary/90" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Student Resources
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Progress Reports
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sessions Completed</span>
                    <span className="font-medium">24/30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Response Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '98%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Student Satisfaction</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '96%'}}></div>
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

export default CounselorDashboard;
