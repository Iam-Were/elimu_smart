import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCounselorStats } from '@/hooks/useCounselorStats';
import Parse from 'parse';
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
  MessageSquare,
  Video,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CounselorProfilePage = () => {
  const navigate = useNavigate();
  const user = Parse.User.current();
  const { stats } = useCounselorStats();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bio, setBio] = useState(user?.get('bio') || '');
  const [specializations, setSpecializations] = useState<string[]>(
    user?.get('specializations') || ['Career Guidance', 'University Placement']
  );
  const [availableHours, setAvailableHours] = useState(
    user?.get('availableHours') || 'Mon-Fri: 9am-5pm, Sat: 10am-2pm'
  );
  const [profileImage, setProfileImage] = useState<string>(user?.get('profileImage') || '');
  const [bannerImage, setBannerImage] = useState<string>(user?.get('bannerImage') || '');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const firstName = user?.get('firstName') || 'Demo';
  const lastName = user?.get('lastName') || 'Counselor';
  const fullName = `${firstName} ${lastName}`;
  const email = user?.get('email') || 'counselor@elimu.com';
  const location = user?.get('location') || 'Nairobi, Kenya';
  const title = user?.get('title') || 'Career Counselor';
  const rating = user?.get('rating') || 4.7;
  const yearsExperience = user?.get('yearsExperience') || 10;

  // Real stats from API
  const studentsHelped = stats?.assignedStudents || 0;
  const sessionCompletion = 92; // TODO: Add completionRate to backend stats
  const avgResponseTime = 2; // TODO: Add avgResponseTime to backend stats
  const totalSessions = stats?.todaySessions || 0;

  // Profile completion calculation
  const profileCompletion = Math.round(
    ((bio ? 40 : 0) + (specializations.length > 0 ? 30 : 0) + (availableHours ? 30 : 0)) / 100 * 100
  );

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleImageUpload = async (file: File, type: 'profile' | 'banner') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const parseFile = new Parse.File(file.name, file);
      await parseFile.save();

      if (user) {
        const fieldName = type === 'profile' ? 'profileImage' : 'bannerImage';
        const imageUrl = parseFile.url() || '';
        user.set(fieldName, imageUrl);
        await user.save();

        if (type === 'profile') {
          setProfileImage(imageUrl);
          toast.success('Profile picture updated!');
        } else {
          setBannerImage(imageUrl);
          toast.success('Banner image updated!');
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, 'profile');
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, 'banner');
    }
  };

  const handleSaveProfile = async () => {
    // Validation
    if (bio && bio.length < 50) {
      toast.error('Bio must be at least 50 characters');
      return;
    }
    if (specializations.length === 0) {
      toast.error('Please add at least one specialization');
      return;
    }
    if (!availableHours.trim()) {
      toast.error('Please specify your available hours');
      return;
    }

    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LinkedIn-style Hero Section */}
      <div className="bg-white border-b">
        {/* Banner with camera upload */}
        <div className="relative h-32 bg-gradient-to-r from-yellow-500 to-yellow-600 group cursor-pointer">
          {bannerImage && (
            <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
          )}
          <button
            onClick={() => bannerInputRef.current?.click()}
            disabled={uploading}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
            aria-label="Upload banner image"
          >
            <Camera className="h-5 w-5 text-gray-700" />
          </button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerImageChange}
            className="hidden"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            {/* Avatar with camera upload overlay */}
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl bg-gradient-to-br from-yellow-400 to-orange-500">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={fullName} />
                ) : (
                  <AvatarFallback className="bg-transparent text-white text-4xl font-bold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-30"
                aria-label="Upload profile picture"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 mt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                  <p className="text-lg text-gray-600 mt-1">{title}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {email}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {yearsExperience}+ years experience
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditDialogOpen(true)}
                  className="mt-2"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit profile
                </Button>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 mt-4">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-yellow-600" />
                  {rating.toFixed(1)} rating
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                  <Users className="h-3 w-3 mr-1" />
                  {studentsHelped} students
                </Badge>
                {profileCompletion < 100 && (
                  <Badge variant="outline" className="px-3 py-1">
                    {profileCompletion}% complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - LinkedIn Grid Style */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* About Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">About</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                    className="h-8 px-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {bio ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{bio}</p>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-3">Share your counseling philosophy and approach</p>
                    <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                      Add bio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specializations Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className={cn(
                    "p-4 rounded-lg text-center border",
                    "bg-green-50 border-green-100"
                  )}>
                    <div className="text-2xl font-bold text-green-700">
                      {sessionCompletion}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Session completion</div>
                  </div>

                  <div className={cn(
                    "p-4 rounded-lg text-center border",
                    "bg-blue-50 border-blue-100"
                  )}>
                    <div className="text-2xl font-bold text-blue-700">{avgResponseTime}h</div>
                    <div className="text-sm text-gray-600 mt-1">Avg response time</div>
                  </div>

                  <div className={cn(
                    "p-4 rounded-lg text-center border",
                    "bg-purple-50 border-purple-100"
                  )}>
                    <div className="text-2xl font-bold text-purple-700">{totalSessions}</div>
                    <div className="text-sm text-gray-600 mt-1">Total sessions</div>
                  </div>

                  <div className={cn(
                    "p-4 rounded-lg text-center border",
                    "bg-yellow-50 border-yellow-100"
                  )}>
                    <div className="text-2xl font-bold text-yellow-700">{rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600 mt-1">Student rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Availability Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-sm font-medium text-yellow-900 mb-1">Working Hours</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{availableHours}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/counselor/sessions')}
                  className="w-full"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage schedule
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/counselor/students')}
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  My students
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/counselor/sessions')}
                  className="w-full justify-start"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Sessions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/inbox')}
                  className="w-full justify-start"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
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

          <div className="space-y-4 py-4">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about your counseling approach, experience, and what makes you effective..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                {bio.length}/500 characters {bio.length < 50 && bio.length > 0 && '(minimum 50)'}
              </p>
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
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={saving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
