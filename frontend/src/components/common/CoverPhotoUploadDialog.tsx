import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { getParse } from '@/config/parse';

interface CoverPhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCover?: string;
  onUploadSuccess: (imageUrl: string) => void;
}

export const CoverPhotoUploadDialog: React.FC<CoverPhotoUploadDialogProps> = ({
  open,
  onOpenChange,
  currentCover,
  onUploadSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_DIMENSION = 1920; // Max width for cover photos (wider than profile)

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
          if (width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP with quality 0.85 (slightly higher quality for covers)
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
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

    // Instant upload
    setUploading(true);

    try {
      // Compress image to WebP format
      const compressedData = await compressImage(file);

      // Upload to backend
      const Parse = await getParse();
      const result = await Parse.Cloud.run('uploadCoverPhoto', {
        imageData: compressedData,
        fileName: file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      });

      // Success
      onUploadSuccess(result.url);

      // Show success toast
      const { toast } = await import('sonner');
      toast.success('Cover photo updated!');

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
        currentUser.unset('coverPhoto');
        await currentUser.save();

        const { toast } = await import('sonner');
        toast.success('Cover photo removed');

        onUploadSuccess('');
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to remove cover photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cover photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Photo Preview */}
          <div className="flex justify-center">
            <div className="w-full h-32 rounded-lg border-4 border-gray-100 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
              {currentCover ? (
                <img
                  src={currentCover}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Upload className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="cover-photo-upload"
            />

            {/* Upload Button */}
            <label htmlFor="cover-photo-upload" className="w-full">
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
                    Upload cover photo
                  </>
                )}
              </Button>
            </label>

            {/* Delete Button - Only if cover exists */}
            {currentCover && (
              <Button
                type="button"
                variant="ghost"
                disabled={uploading}
                onClick={handleDelete}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete cover photo
              </Button>
            )}

            {/* Cancel Button */}
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
            JPG, PNG or WebP. Max size 5MB.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
