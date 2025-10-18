import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconContainer } from '@/components/ui/icon-container';
import {
  Users,
  MessageSquare,
  Heart,
  BookOpen,
  Calendar,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionPaywall } from '@/components/subscription/SubscriptionPaywall';

interface StudentGuidanceCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconEmphasis: 'subtle' | 'medium' | 'high';
  status: 'available' | 'active' | 'urgent' | 'premium';
  actionText: string;
  actionLink: string;
  value?: string;
  change?: string;
  isDynamic?: boolean;
  isPremium?: boolean;
}

// Freemium guidance cards - Free tier + Premium tier
const studentGuidanceCards: StudentGuidanceCard[] = [
  // FREE TIER (3 cards) - Subtle emphasis
  {
    id: 'community-qa',
    title: 'Ask Community',
    description: 'Get answers from counselors & peers',
    icon: Users,
    iconEmphasis: 'subtle', // Free informational - subtle
    status: 'available',
    actionText: 'Ask Question',
    actionLink: '/guidance/community-qa',
    value: 'Free',
    change: '200+ questions answered',
    isDynamic: false,
    isPremium: false
  },
  {
    id: 'career-resources',
    title: 'Career Resources',
    description: 'Guides, videos, and planning tools',
    icon: BookOpen,
    iconEmphasis: 'subtle', // Free browsing - subtle
    status: 'available',
    actionText: 'Browse Resources',
    actionLink: '/guidance/resources',
    value: 'Free',
    change: '50+ resources available',
    isDynamic: false,
    isPremium: false
  },
  {
    id: 'crisis-support',
    title: 'Crisis Resources',
    description: 'Verified 24/7 helplines',
    icon: Heart,
    iconEmphasis: 'medium', // Urgent but free - medium emphasis
    status: 'urgent',
    actionText: 'Get Help Now',
    actionLink: '/guidance/crisis',
    value: 'Free',
    change: 'Childline Kenya, NACADA',
    isDynamic: false,
    isPremium: false
  },

  // PREMIUM TIER (2 cards) - Medium emphasis (important paid features)
  {
    id: 'counselor-inbox',
    title: 'Messages',
    description: 'Private 1-on-1 guidance',
    icon: MessageSquare,
    iconEmphasis: 'medium', // Premium feature - medium
    status: 'premium',
    actionText: 'Upgrade to Message',
    actionLink: '/inbox',
    value: 'Premium',
    change: '24hr response guaranteed',
    isDynamic: true,
    isPremium: true
  },
  {
    id: 'book-session',
    title: 'Book Session',
    description: 'Schedule video/phone meeting',
    icon: Calendar,
    iconEmphasis: 'medium', // Premium feature - medium
    status: 'premium',
    actionText: 'View Pricing',
    actionLink: '/guidance/book-session',
    value: 'Premium',
    change: 'From KES 1,500/session',
    isDynamic: false,
    isPremium: true
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'urgent': return 'text-red-600 dark:text-red-400';
    case 'premium': return 'text-amber-600 dark:text-amber-400';
    case 'active': return 'text-blue-600 dark:text-blue-400';
    default: return 'text-green-600 dark:text-green-400';
  }
};

interface StudentGuidanceCardsProps {
  className?: string;
  showAll?: boolean;
  maxCards?: number;
}

export const StudentGuidanceCards: React.FC<StudentGuidanceCardsProps> = ({
  className,
  showAll = false,
  maxCards = 4,
}) => {
  const navigate = useNavigate();
  const { logActivity } = useDynamicDashboard();
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<'messaging' | 'sessions' | 'premium'>('messaging');

  // Update cards with backend data
  const getUpdatedCards = () => {
    return studentGuidanceCards.map(card => {
      if (!card.isDynamic) return card;

      switch (card.id) {
        case 'counselor-support':
          return { ...card, value: 'Available', change: 'Counselors online' };
        case 'quick-questions':
          return { ...card, value: 'Free', change: '2-4 hour response' };
        case 'career-mentorship':
          return { ...card, value: 'Free', change: 'Monthly meetings' };
        default:
          return card;
      }
    });
  };

  const displayedCards = getUpdatedCards().slice(0, showAll ? undefined : maxCards);

  // Check if user has active subscription
  const hasActiveSubscription = () => {
    if (subscriptionLoading) return false;
    if (!userSubscription) return false;

    const isActive = userSubscription.status === 'active';
    const notExpired = userSubscription.expiresAt
      ? new Date(userSubscription.expiresAt) > new Date()
      : false;

    return isActive && notExpired;
  };

  const handleCardClick = (card: StudentGuidanceCard) => {
    try {
      logActivity('guidance_card_click', {
        cardId: card.id,
        cardTitle: card.title,
        isPremium: card.isPremium,
        hasSubscription: hasActiveSubscription()
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }

    // Check if premium feature requires subscription
    if (card.isPremium && !hasActiveSubscription()) {
      // Determine paywall feature type
      if (card.id === 'counselor-inbox') {
        setPaywallFeature('messaging');
      } else if (card.id === 'book-session') {
        setPaywallFeature('sessions');
      } else {
        setPaywallFeature('premium');
      }
      setPaywallOpen(true);
      return;
    }

    // Navigate normally if not premium or has subscription
    navigate(card.actionLink);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Subscription Paywall Modal */}
      <SubscriptionPaywall
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature={paywallFeature}
      />

      {/* Clean card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedCards.map((card) => (
          <Card
            key={card.id}
            className={cn(
              "cursor-pointer hover:shadow-lg transition-all duration-200",
              "border-slate-200/30 dark:border-slate-700/30",
              "hover:scale-[1.02]",
              card.isPremium && !hasActiveSubscription() && "ring-2 ring-amber-300/50 dark:ring-amber-500/50"
            )}
            onClick={() => handleCardClick(card)}
          >
            <CardHeader className="flex flex-col items-center text-center space-y-3 pb-4">
              <IconContainer
                icon={card.icon}
                emphasis={card.iconEmphasis}
                theme={card.isPremium ? 'neutral' : 'student'}
                size="lg"
              />
              <div className="w-full">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
                  {card.title}
                  {card.isPremium && (
                    <Lock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  )}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">{card.description}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  getStatusColor(card.status),
                  card.isPremium && "bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700"
                )}
              >
                {card.isPremium ? 'Premium' : card.status}
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {card.value || 'Ready'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {card.change || 'Click to access'}
                </p>
              </div>
              <Button
                size="sm"
                className={cn(
                  "w-full font-semibold",
                  card.isPremium && !hasActiveSubscription()
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(card);
                }}
              >
                {card.isPremium && !hasActiveSubscription()
                  ? card.actionText
                  : card.actionText.replace('Upgrade to ', '').replace('View Pricing', 'Open')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary stats */}
      {!showAll && studentGuidanceCards.length > maxCards && (
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {studentGuidanceCards.filter(card => card.status === 'available').length}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Available Now</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {studentGuidanceCards.filter(card => card.value === 'Free').length}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Free Services</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGuidanceCards;
