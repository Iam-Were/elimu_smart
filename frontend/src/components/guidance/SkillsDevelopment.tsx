import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getParse } from '@/config/parse';
import { TrendingUp, Code, Play, Clock, Star } from 'lucide-react';

const SkillsDevelopment: React.FC = () => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartCourse = async (courseId: string) => {
    setIsStarting(true);
    try {
      const Parse = getParse();
      // Uses Parse function: logUserActivity
      await Parse.Cloud.run('logUserActivity', {
        activityType: 'skills_course_started',
        details: { courseId }
      });
    } catch (error) {
      console.error('Course tracking failed:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const skillAreas = [
    { name: 'Technical', score: 65, color: 'bg-blue-500' },
    { name: 'Communication', score: 40, color: 'bg-green-500' },
    { name: 'Leadership', score: 55, color: 'bg-purple-500' },
    { name: 'Business', score: 30, color: 'bg-orange-500' },
    { name: 'Creative', score: 20, color: 'bg-pink-500' }
  ];

  const courses = [
    {
      id: '1',
      title: 'Web Development Fundamentals',
      provider: 'CodeWithKenya',
      duration: '8 weeks',
      level: 'Beginner',
      rating: 4.8,
      students: 1243,
      price: 'Free',
      progress: 0
    },
    {
      id: '2',
      title: 'Digital Marketing Essentials',
      provider: 'Market Pro Kenya',
      duration: '6 weeks',
      level: 'Beginner',
      rating: 4.6,
      students: 1567,
      price: 'KSh 5,000',
      progress: 25
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Note: H1 "Guidance Center" is provided by Sprint18Layout */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Build Job-Ready Skills</h2>
          <p className="text-muted-foreground">Develop practical skills employers want</p>
        </div>

        <Card className="border-orange-200 bg-gradient-to-r from-orange-50/50 to-background">
          <CardHeader>
            <CardTitle>Your Skills Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {skillAreas.map((skill) => (
                <div key={skill.name} className="text-center">
                  <div className={`w-10 h-10 ${skill.color} rounded-full flex items-center justify-center text-white mx-auto mb-2`}>
                    <Code className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium text-sm mb-2">{skill.name}</h4>
                  <Progress value={skill.score} className="h-2 mb-1" />
                  <span className="text-xs text-muted-foreground">{skill.score}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Take Skills Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">150+</div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">12,000+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">60%</div>
            <div className="text-sm text-muted-foreground">Get Jobs</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{course.students} students</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{course.duration}</span>
                  </div>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600">{course.price}</span>
                  <Button
                    onClick={() => handleStartCourse(course.id)}
                    disabled={isStarting}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isStarting ? 'Starting...' : course.progress > 0 ? 'Continue' : 'Start Learning'}
                    <Play className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded border border-orange-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">1</div>
                <h4 className="font-medium">Foundation Skills</h4>
                <p className="text-sm text-muted-foreground">Communication and basic digital literacy</p>
              </div>
              <div className="p-4 rounded border border-blue-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">2</div>
                <h4 className="font-medium">Technical Skills</h4>
                <p className="text-sm text-muted-foreground">Job-specific technical capabilities</p>
              </div>
              <div className="p-4 rounded border border-green-100">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2 text-green-600 font-bold">3</div>
                <h4 className="font-medium">Leadership</h4>
                <p className="text-sm text-muted-foreground">Advanced skills for career growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsDevelopment;