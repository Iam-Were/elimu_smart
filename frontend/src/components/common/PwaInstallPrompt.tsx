import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 30) {
        return; // Don't show again for 30 days
      }
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as never)['MSStream'];
    setIsIOS(isIOSDevice);

    // For iOS, show manual install instructions after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds on iOS
      return () => clearTimeout(timer);
    }

    // For Android/Desktop Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500 md:left-auto md:right-4 md:w-96">
      <Card className="relative border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-xl">
        <Button
          variant="ghost"
          className="absolute right-2 top-2 h-6 w-6 rounded-full p-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
            <Download className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-gray-900">Install Elimu Smart App</h3>

            {isIOS ? (
              <div className="space-y-2 text-sm text-gray-600">
                <p>Install this app on your iPhone:</p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Tap the Share button <span className="text-blue-500">⎋</span></li>
                  <li>Select "Add to Home Screen"</li>
                  <li>Tap "Add"</li>
                </ol>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Get instant access, work offline, and receive notifications about your career journey.
              </p>
            )}

            {!isIOS && deferredPrompt && (
              <Button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
