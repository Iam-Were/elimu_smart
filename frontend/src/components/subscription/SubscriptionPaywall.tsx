import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Lock, Sparkles } from 'lucide-react';

interface SubscriptionPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'messaging' | 'sessions' | 'premium';
}

const featureDetails = {
  messaging: {
    title: 'Premium Feature: Direct Messaging',
    description: 'Get personalized 1-on-1 guidance from experienced counselors with guaranteed 24-hour response times.',
    icon: <Lock className="h-12 w-12 text-amber-500" />,
    benefits: [
      'Private messaging with assigned counselor',
      '24-hour response guarantee',
      'Unlimited message history',
      'Read receipts & online status',
      'File & image sharing (coming soon)',
    ],
  },
  sessions: {
    title: 'Premium Feature: Session Booking',
    description: 'Schedule one-on-one video or phone sessions with counselors for in-depth career guidance.',
    icon: <Sparkles className="h-12 w-12 text-amber-500" />,
    benefits: [
      'Book 30, 60, or 90-minute sessions',
      'Video, phone, or in-person options',
      'Pre-session questionnaire',
      'Post-session action plan',
      'Session notes & recordings',
    ],
  },
  premium: {
    title: 'Upgrade to Premium',
    description: 'Unlock all premium features and get personalized guidance to achieve your career goals.',
    icon: <Sparkles className="h-12 w-12 text-amber-500" />,
    benefits: [
      'Direct messaging with counselors',
      'Priority session booking',
      'Personalized career roadmap',
      'Monthly progress reviews',
      'Exclusive workshops & webinars',
    ],
  },
};

export const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
  isOpen,
  onClose,
  feature,
}) => {
  const navigate = useNavigate();
  const details = featureDetails[feature];

  const handleUpgrade = () => {
    onClose();
    navigate('/subscription');
  };

  const handleViewPricing = () => {
    onClose();
    navigate('/subscription#pricing');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              {details.icon}
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {details.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {details.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          <div className="flex items-center justify-center">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-sm">
              Premium Only
            </Badge>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">What's included:</p>
            {details.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            onClick={handleUpgrade}
          >
            Upgrade to Premium
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewPricing}
          >
            View Pricing Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPaywall;
