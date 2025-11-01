import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Star,
  MapPin,
  Mail,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  Edit,
  Check,
  X,
} from 'lucide-react';

export const CounselorProfilePage = () => {
  const { user } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bio, setBio] = useState(user?.get('bio') || '');
  const [specializations, setSpecializations] = useState<string[]>(
    user?.get('specializations') || ['Career Guidance', 'University Placement']
  );
  const [availableHours, setAvailableHours] = useState(
    user?.get('availableHours') || 'Mon-Fri: 9am-5pm, Sat: 10am-2pm'
  );

  const firstName = user?.get('firstName') || 'Demo';
  const lastName = user?.get('lastName') || 'Counselor';
  const fullName = `${firstName} ${lastName}`;
  const email = user?.get('email') || 'counselor@elimu.com';
  const location = user?.get('location') || 'Nairobi, Kenya';
  const title = user?.get('title') || 'Career Counselor';
  const rating = user?.get('rating') || 4.7;
  const yearsExperience = user?.get('yearsExperience') || 10;

  // Mock stats - replace with real data from useCounselorStats
  const stats = {
    studentsHelped: 247,
    sessionCompletion: 95,
    avgResponseTime: 2.3,
    totalSessions: 312,
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSaveProfile = async () => {
    try {
      if (user) {
        user.set('bio', bio);
        user.set('specializations', specializations);
        user.set('availableHours', availableHours);
        await user.save();
        toast.success('Profile updated successfully!');
        setEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-transparent text-white text-3xl font-bold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{fullName}</h1>
                  <p className="text-yellow-100 text-lg mb-3">{title}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-yellow-50">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {email}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {yearsExperience}+ years
                    </div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditDialogOpen(true)}
                  className="bg-white text-yellow-600 hover:bg-yellow-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-200 fill-yellow-200" />
                  <span className="font-semibold text-white text-lg">{rating.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="h-5 w-5 text-yellow-200" />
                  <span className="font-semibold text-white">{stats.studentsHelped}</span>
                  <span className="text-yellow-100 text-sm">students helped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Professional Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {bio ? (
                  <p className="text-gray-700 leading-relaxed">{bio}</p>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">Tell students what makes you a great counselor</p>
                    <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                      Add Bio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec, index) => (
                    <Badge
                      key={index}
                      className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-700">
                      {stats.sessionCompletion}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Session Completion</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700">
                      {stats.avgResponseTime}h
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Avg Response Time</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">
                      {stats.totalSessions}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-700">{rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600 mt-1">Student Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Availability */}
          <div className="space-y-6">
            {/* Availability */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm font-medium text-yellow-900 mb-2">Working Hours</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{availableHours}</p>
                  </div>

                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  View My Students
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Sessions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Check Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Professional Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about your counseling approach, experience, and what makes you effective..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                maxLength={500}
              />
              <p className="text-sm text-gray-500">{bio.length}/500 characters</p>
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <Label htmlFor="specializations">Specializations (comma-separated)</Label>
              <Input
                id="specializations"
                placeholder="e.g., Career Guidance, STEM Careers, University Placement"
                value={specializations.join(', ')}
                onChange={(e) =>
                  setSpecializations(
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label htmlFor="availability">Available Hours</Label>
              <Textarea
                id="availability"
                placeholder="e.g., Mon-Fri: 9am-5pm, Sat: 10am-2pm"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-yellow-600 hover:bg-yellow-700">
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
