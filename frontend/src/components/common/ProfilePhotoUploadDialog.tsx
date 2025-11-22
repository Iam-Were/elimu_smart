import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { getParse } from '@/config/parse';

interface ProfilePhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage?: string;
  userInitials?: string;
  onUploadSuccess: (imageUrl: string) => void;
}

export const ProfilePhotoUploadDialog: React.FC<ProfilePhotoUploadDialogProps> = ({
  open,
  onOpenChange,
  currentImage,
  userInitials = 'U',
  onUploadSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_DIMENSION = 1200; // Max width/height for compression

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Image size must be less than 5MB';
    }
    return null;
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions (maintain aspect ratio)
          if (width > height) {
            if (width > MAX_DIMENSION) {
              height = (height * MAX_DIMENSION) / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width = (width * MAX_DIMENSION) / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP with quality 0.8 for better compression
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Instant upload (LinkedIn pattern)
    setUploading(true);

    try {
      // Compress image to WebP format
      const compressedData = await compressImage(file);

      // Upload to backend
      const Parse = await getParse();
      const result = await Parse.Cloud.run('uploadProfileImage', {
        imageData: compressedData,
        fileName: file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      });

      // Success
      onUploadSuccess(result.url);

      // Show success toast
      const { toast } = await import('sonner');
      toast.success('Profile picture updated!');

      // Close dialog after brief delay
      setTimeout(() => {
        onOpenChange(false);
        setError(null);
      }, 1000);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    try {
      setUploading(true);
      const Parse = await getParse();
      const currentUser = Parse.User.current();

      if (currentUser) {
        currentUser.unset('profileImage');
        await currentUser.save();

        const { toast } = await import('sonner');
        toast.success('Profile picture removed');

        onUploadSuccess('');
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to remove profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Large Avatar Preview - LinkedIn Style */}
          <div className="flex justify-center">
            <Avatar className="h-40 w-40 border-4 border-gray-100">
              <AvatarImage src={currentImage} />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-4xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons - LinkedIn Pattern */}
          <div className="flex flex-col gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="profile-photo-upload"
            />

            {/* Upload Button */}
            <label htmlFor="profile-photo-upload" className="w-full">
              <Button
                type="button"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload photo
                  </>
                )}
              </Button>
            </label>

            {/* Delete Button - Only if photo exists */}
            {currentImage && (
              <Button
                type="button"
                variant="ghost"
                disabled={uploading}
                onClick={handleDelete}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete photo
              </Button>
            )}

            {/* Cancel Button - Always visible */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setError(null);
                onOpenChange(false);
              }}
              disabled={uploading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          {/* File Requirements */}
          <p className="text-xs text-center text-muted-foreground">
            JPG, PNG or WebP. Max size 2MB.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
