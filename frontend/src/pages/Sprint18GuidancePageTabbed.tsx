import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDynamicDashboard } from '../hooks/useDynamicDashboard';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { useSubscription } from '@/hooks/useSubscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedCardGrid } from '../components/cards/UnifiedCardGrid';
import { ProfessionalNetworkingPreview } from '../components/professional/ProfessionalNetworkingPreview';
import { SubscriptionPaywall } from '@/components/subscription/SubscriptionPaywall';
import { Loader2, Heart, BookOpen, Calendar, Users, Lock } from 'lucide-react';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GuidanceCard } from '@/types/CardInterfaces';

const Sprint18GuidancePageTabbed: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'services';
  const [showPaywall, setShowPaywall] = useState(false);

  const { logActivity } = useDynamicDashboard();
  const pageLoadTime = Date.now();

  // Subscription status
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();
  const isPremium = userSubscription?.status === 'active';

  // Fetch all guidance cards
  const { cards, loading, error } = useDynamicCards({
    variant: 'guidance'
  });

  // Track guidance page visit
  useEffect(() => {
    logActivity('page_visit', {
      page: 'guidance',
      section: 'guidance_hub',
      tab: activeTab,
      timestamp: new Date().toISOString()
    });

    return () => {
      const duration = Date.now() - pageLoadTime;
      logActivity('page_duration', {
        page: 'guidance',
        tab: activeTab,
        duration: Math.round(duration / 1000),
        timeSpent: duration
      });
    };
  }, [logActivity, pageLoadTime, activeTab]);

  // Type guard for GuidanceCard
  const isGuidanceCard = (card: unknown): card is GuidanceCard => {
    return (card as GuidanceCard).cardType === 'guidance';
  };

  // Filter cards by service type
  const guidanceCards = cards.filter(isGuidanceCard);

  const servicesCards = useMemo(() =>
    guidanceCards.filter(
      card => card.serviceType === 'premium' || card.serviceType === 'booking' || card.serviceType === 'community'
    ), [guidanceCards]
  );

  const resourcesCards = useMemo(() =>
    guidanceCards.filter(card => card.serviceType === 'resources'),
    [guidanceCards]
  );

  // Loading state
  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-sm sm:text-base text-muted-foreground">Loading guidance services...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-8 w-8 text-orange-500" />
          Guidance & Support
        </h1>
        <p className="text-muted-foreground">
          Get personalized career guidance, resources, and support from expert counselors
        </p>
      </div>

      {/* Premium Status Badge */}
      {isPremium ? (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Premium Member</p>
                  <p className="text-sm text-amber-700">Access to all counseling services</p>
                </div>
              </div>
              <Badge className="bg-amber-500 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold text-orange-900 mb-1">Unlock Premium Guidance</p>
                <p className="text-sm text-orange-700">Get 1-on-1 counseling and session bookings</p>
              </div>
              <Button
                onClick={() => (window.location.href = '/subscription')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90"
              >
                View Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Counseling Services</h2>
            <p className="text-muted-foreground mb-6">
              Connect with career counselors through community Q&A, private messaging, or scheduled sessions
            </p>
            <UnifiedCardGrid cards={servicesCards} variant="guidance" />
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Career Resources</h2>
            <p className="text-muted-foreground mb-6">
              Browse guides, videos, and tools to help you plan your career path
            </p>
            {resourcesCards.length > 0 ? (
              <UnifiedCardGrid cards={resourcesCards} variant="guidance" />
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Resource Library Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're building a comprehensive library of career guides and tools
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          {isPremium ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Sessions</h2>
              <p className="text-muted-foreground mb-6">View your upcoming and past counseling sessions</p>

              {/* Upcoming Sessions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No upcoming sessions</p>
                    <Button
                      onClick={() => (window.location.href = '/guidance/book-session')}
                      className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90"
                    >
                      Book a Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Past Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    Past Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No past sessions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-orange-50/50 to-white border-orange-200">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Session booking is available to premium members. Upgrade to schedule 1-on-1 video, phone, or in-person counseling sessions.
                </p>
                <Button
                  onClick={() => (window.location.href = '/subscription')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90"
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Professional Development</h2>
            <p className="text-muted-foreground mb-6">
              Connect with professionals and learn from their career journeys
            </p>
            <ProfessionalNetworkingPreview />
          </div>
        </TabsContent>
      </Tabs>

      {/* Subscription Paywall Modal */}
      {showPaywall && (
        <SubscriptionPaywall isOpen={showPaywall} onClose={() => setShowPaywall(false)} feature="premium" />
      )}
    </div>
  );
};

export default Sprint18GuidancePageTabbed;
