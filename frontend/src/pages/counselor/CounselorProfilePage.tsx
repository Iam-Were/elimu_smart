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
  Camera,
} from 'lucide-react';
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

  const avatarInputRef = useRef<HTMLInputElement>(null);

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

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        const imageUrl = parseFile.url() || '';
        user.set('profileImage', imageUrl);
        await user.save();
        setProfileImage(imageUrl);
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
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
      {/* Simplified Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar with camera upload */}
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={fullName} />
                ) : (
                  <AvatarFallback className="bg-transparent text-white text-3xl font-bold">
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
                <Camera className="h-6 w-6 text-white" />
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
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                  <p className="text-lg text-gray-600 mt-1">{title}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1.5 text-sm">
                      <Star className="h-4 w-4 mr-1.5 fill-yellow-600" />
                      {rating.toFixed(1)} rating
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1.5 text-sm">
                      <Users className="h-4 w-4 mr-1.5" />
                      {studentsHelped} students
                    </Badge>
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" />
                      {yearsExperience}+ years
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setEditDialogOpen(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 text-base h-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Column */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* About & Specializations Combined */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Professional Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bio ? (
              <p className="text-gray-700 leading-relaxed text-base">{bio}</p>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="mb-3 text-base">Add your professional bio</p>
                <Button variant="outline" onClick={() => setEditDialogOpen(true)} className="px-5 py-2 text-base h-auto">
                  Add Bio
                </Button>
              </div>
            )}

            <div className="pt-3 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1.5 text-sm"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability & Contact */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Availability & Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-sm font-medium text-yellow-900 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Working Hours
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{availableHours}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{email}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => navigate('/counselor/students')}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2.5 text-base h-auto"
              >
                <Users className="mr-2 h-5 w-5" />
                My Students
              </Button>
              <Button
                onClick={() => navigate('/counselor/sessions')}
                variant="outline"
                className="flex-1 px-5 py-2.5 text-base h-auto"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Sessions
              </Button>
              <Button
                onClick={() => navigate('/inbox')}
                variant="outline"
                className="flex-1 px-5 py-2.5 text-base h-auto"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Messages
              </Button>
            </div>
          </CardContent>
        </Card>
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
