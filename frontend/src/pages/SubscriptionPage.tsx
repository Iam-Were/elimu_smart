import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Crown, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentDialog } from '@/components/payment/PaymentDialog';

export const SubscriptionPage = () => {
  const { plans, userSubscription, isLoading, cancelSubscription, reload } = useSubscription();

  const handlePaymentSuccess = () => {
    toast.success('Subscription Activated!', {
      description: 'Your premium features are now available'
    });
    reload(); // Refresh subscription status
  };

  const handlePaymentError = (error: string) => {
    toast.error('Payment Failed', {
      description: error
    });
  };

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
      <div className="text-center mb-12">
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

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-orange-500 border-2 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-orange-600">
                  {plan.price === 0 ? 'Free' : `KES ${plan.price.toLocaleString()}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.duration === 'forever' ? '' : `/${plan.duration === 'monthly' ? 'month' : 'year'}`}
                </span>
              </CardDescription>
              {plan.savings && (
                <Badge variant="secondary" className="w-fit mt-2">
                  Save KES {plan.savings.toLocaleString()}
                </Badge>
              )}
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {plan.price === 0 ? (
                <Button
                  className="w-full"
                  variant="outline"
                  disabled
                >
                  Current Plan
                </Button>
              ) : userSubscription?.plan === plan.id && userSubscription?.status === 'active' ? (
                <Button
                  className="w-full"
                  variant="default"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <PaymentDialog
                  plan={plan}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  trigger={
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Select Plan
                    </Button>
                  }
                />
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
