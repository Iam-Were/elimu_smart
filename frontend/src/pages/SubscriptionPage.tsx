import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Crown, Loader2, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';

export const SubscriptionPage = () => {
  const { plans, userSubscription, isLoading, initiatePayment, checkPaymentStatus, cancelSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setPendingSubscriptionId] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!phoneNumber || !selectedPlan) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await initiatePayment(selectedPlan, phoneNumber);

      if (result.success) {
        setPendingSubscriptionId(result.subscriptionId);
        toast.success('Payment Request Sent', {
          description: 'Please check your phone for the M-Pesa prompt'
        });

        // Start polling for payment status
        pollPaymentStatus(result.subscriptionId);
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Payment Failed', {
        description: error instanceof Error ? error.message : 'Failed to initiate payment'
      });
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (subscriptionId: string) => {
    let attempts = 0;
    const maxAttempts = 20; // Poll for 2 minutes (20 * 6 seconds)

    const poll = setInterval(async () => {
      attempts++;

      try {
        const status = await checkPaymentStatus(subscriptionId);

        if (status.success) {
          clearInterval(poll);
          setIsProcessing(false);
          setPendingSubscriptionId(null);
          setSelectedPlan(null);
          setPhoneNumber('');
          toast.success('Subscription Activated!', {
            description: 'Your premium features are now available'
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setIsProcessing(false);
          toast.warning('Payment Status Unknown', {
            description: 'Please check your subscription status manually'
          });
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setIsProcessing(false);
        }
      }
    }, 6000); // Poll every 6 seconds
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
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isProcessing || (userSubscription?.plan === plan.id && userSubscription?.status === 'active')}
              >
                {userSubscription?.plan === plan.id && userSubscription?.status === 'active' ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* M-Pesa Payment Form */}
      {selectedPlan && (
        <Card className="max-w-md mx-auto border-orange-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>
                  {plans.find(p => p.id === selectedPlan)?.name}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPlan(null);
                  setPhoneNumber('');
                }}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-900">M-Pesa Payment</span>
              </div>
              <p className="text-sm text-orange-800">
                Enter your M-Pesa phone number to receive a payment prompt
              </p>
            </div>

            <div>
              <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isProcessing}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: 254XXXXXXXXX
              </p>
            </div>

            {isProcessing && (
              <Alert className="bg-blue-50 border-blue-200">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Waiting for M-Pesa payment confirmation... Please check your phone and enter your PIN.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              onClick={handlePayment}
              disabled={isProcessing || !phoneNumber}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Pay with M-Pesa
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Cancel Subscription Option */}
      {userSubscription && userSubscription.status === 'active' && userSubscription.plan !== 'free' && !selectedPlan && (
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
