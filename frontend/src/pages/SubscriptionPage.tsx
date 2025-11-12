import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Crown, Loader2, X, Shield, Users, Award, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { plans, userSubscription, isLoading, cancelSubscription } = useSubscription();

  // KUCCPS Countdown (assuming KUCCPS applications open April 15, 2026)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [studentsUpgradedToday, setStudentsUpgradedToday] = useState(12);

  useEffect(() => {
    const kuccpsDeadline = new Date('2026-04-15T23:59:59');

    const updateCountdown = () => {
      const now = new Date();
      const diff = kuccpsDeadline.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown({ days, hours, minutes });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Simulate live counter (increments every 10-30 minutes)
  useEffect(() => {
    const randomDelay = Math.random() * 20 * 60 * 1000 + 10 * 60 * 1000; // 10-30 minutes
    const timer = setTimeout(() => {
      setStudentsUpgradedToday(prev => prev + 1);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [studentsUpgradedToday]);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will have access until the end of your billing period.')) {
      return;
    }

    try {
      await cancelSubscription();
      toast.success('Subscription Cancelled', {
        description: 'You will have access until the end of your billing period'
      });
    } catch (error) {
      toast.error('Cancellation Failed', {
        description: error instanceof Error ? error.message : 'Failed to cancel subscription'
      });
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock your full potential with personalized career guidance, unlimited assessments, and expert counselor support
        </p>

        {/* Current Subscription Status */}
        {userSubscription && userSubscription.status !== 'free' && (
          <Alert className="mt-6 max-w-2xl mx-auto bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <Crown className="h-5 w-5 text-orange-600" />
            <AlertDescription className="text-orange-900">
              <strong>Active Subscription:</strong> {userSubscription.planName || userSubscription.plan}
              {userSubscription.expiresAt && (
                <span className="ml-2">
                  • Expires: {new Date(userSubscription.expiresAt).toLocaleDateString()}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Trust Badges Section */}
      <div className="mb-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-background">
            <CardContent className="pt-2 pb-2 sm:pt-6 sm:pb-6">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[9px] sm:text-sm">30-Day Money-Back Guarantee</h3>
                  <p className="text-[7px] sm:text-xs text-muted-foreground">Risk-free trial period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-background">
            <CardContent className="pt-2 pb-2 sm:pt-6 sm:pb-6">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[9px] sm:text-sm">Trusted by 2,000+ Students</h3>
                  <p className="text-[7px] sm:text-xs text-muted-foreground">Across Kenya</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-background">
            <CardContent className="pt-2 pb-2 sm:pt-6 sm:pb-6">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Award className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[9px] sm:text-sm">Safaricom M-Pesa Verified</h3>
                  <p className="text-[7px] sm:text-xs text-muted-foreground">Secure payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Urgency Banner - KUCCPS Countdown */}
      {countdown.days > 0 && countdown.days < 180 && (
        <Alert className="mb-8 max-w-4xl mx-auto bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300">
          <Clock className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold">KUCCPS Applications Open Soon!</p>
                <p className="text-sm">Upgrade now to get expert guidance before the deadline</p>
              </div>
              <div className="flex items-center gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{countdown.days}</p>
                  <p className="text-xs">Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{countdown.hours}</p>
                  <p className="text-xs">Hours</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{countdown.minutes}</p>
                  <p className="text-xs">Minutes</p>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Social Proof - Live Counter */}
      <div className="mb-8 max-w-4xl mx-auto">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-background">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    <span className="text-2xl font-bold text-green-600">{studentsUpgradedToday}</span> students upgraded today
                  </p>
                  <p className="text-xs text-muted-foreground">Join 2,000+ Kenyan students achieving their goals</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <Users className="mr-1 h-3 w-3" />
                Growing Community
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-orange-500 border-2 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-0 sm:px-4 sm:py-1 text-[8px] sm:text-xs">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-lg sm:text-3xl font-bold text-orange-600">
                  {plan.price === 0 ? 'Free' : `KES ${plan.price.toLocaleString()}`}
                </span>
                <span className="text-[9px] sm:text-sm text-muted-foreground">
                  {plan.duration === 'forever' ? '' : `/${plan.duration === 'monthly' ? 'month' : 'year'}`}
                </span>
              </CardDescription>
              {plan.savings && (
                <Badge variant="secondary" className="w-fit mt-1 sm:mt-2 text-[7px] sm:text-xs px-1 py-0 sm:px-2">
                  Save KES {plan.savings.toLocaleString()}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              <ul className="space-y-1 sm:space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-1 sm:gap-2">
                    <Check className="h-3 w-3 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[8px] sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-3 sm:p-6">
              {plan.price === 0 ? (
                <Button
                  className="w-full text-[9px] sm:text-sm min-h-[28px] sm:min-h-[40px]"
                  variant="outline"
                  disabled
                >
                  Current Plan
                </Button>
              ) : userSubscription?.plan === plan.id && userSubscription?.status === 'active' ? (
                <Button
                  className="w-full text-[9px] sm:text-sm min-h-[28px] sm:min-h-[40px]"
                  variant="default"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full text-[9px] sm:text-sm min-h-[28px] sm:min-h-[40px]"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => navigate(`/checkout/${plan.id}`)}
                >
                  Select Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Cancel Subscription Option */}
      {userSubscription && userSubscription.status === 'active' && userSubscription.plan !== 'free' && (
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={handleCancelSubscription}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Subscription
          </Button>
        </div>
      )}
    </div>
  );
};
