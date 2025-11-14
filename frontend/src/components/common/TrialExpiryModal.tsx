import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles } from 'lucide-react';
import { getParse } from '@/config/parse';

interface SubscriptionInfo {
  status: string;
  plan: string;
  isTrial: boolean;
  daysRemaining?: number;
}

export function TrialExpiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const navigate = useNavigate();

  const checkTrialExpiry = useCallback(async () => {
    if (hasShownModal) return;

    try {
      const Parse = await getParse();
      const user = Parse.User.current();

      if (!user) return;

      const subscription: SubscriptionInfo = await Parse.Cloud.run('getUserSubscription');

      // Show modal if trial just expired or expiring within 7 days
      if (subscription.isTrial && subscription.daysRemaining !== undefined) {
        if (subscription.daysRemaining <= 0 || subscription.daysRemaining <= 7) {
          setIsOpen(true);
          setHasShownModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking trial expiry:', error);
    }
  }, [hasShownModal]);

  useEffect(() => {
    checkTrialExpiry();
  }, [checkTrialExpiry]);

  const handleUpgrade = () => {
    setIsOpen(false);
    navigate('/subscription');
  };

  const handleUseFree = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Your Premium Trial is Ending Soon
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Continue enjoying unlimited access to career guidance and counselor support
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          {/* Premium Plan */}
          <div className="p-6 rounded-xl border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-purple-50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-bold rounded-full">
              Recommended
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
              Continue Premium
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Direct messaging with any counselor</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Book 1-on-1 counseling sessions</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Priority Q&A responses (24-hour guarantee)</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Advanced career assessments & reports</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">University application assistance</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">
                KES 1,500
                <span className="text-base font-normal text-gray-600">/month</span>
              </p>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold py-6"
            >
              Upgrade to Premium
            </Button>
          </div>

          {/* Free Plan */}
          <div className="p-6 rounded-xl border border-gray-300 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Free Plan
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">All career assessments</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">University course search</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Community Q&A forum</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Career resources library</p>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">Direct counselor messaging</p>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">Session booking</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">
                KES 0
                <span className="text-base font-normal text-gray-600">/month</span>
              </p>
            </div>

            <Button
              onClick={handleUseFree}
              variant="outline"
              className="w-full py-6 font-semibold"
            >
              Continue with Free
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          You can upgrade anytime from the Subscription page
        </p>
      </DialogContent>
    </Dialog>
  );
}
