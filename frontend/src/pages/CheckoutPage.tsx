import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Check,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  ArrowLeft,
  Award,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const CheckoutPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plans, initiatePayment, checkPaymentStatus } = useSubscription();

  const [plan, setPlan] = useState<typeof plans[0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'initiating' | 'waiting' | 'verifying'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

  useEffect(() => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) {
      toast.error('Invalid plan selected');
      navigate('/subscription');
      return;
    }
    setPlan(selectedPlan);
  }, [planId, plans, navigate]);

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = digits;
    if (digits.startsWith('0')) {
      formatted = '254' + digits.slice(1);
    } else if (digits.startsWith('254')) {
      formatted = digits;
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      formatted = '254' + digits;
    }
    return formatted.slice(0, 12);
  };

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^254[17]\d{8}$/;
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setIsPhoneValid(validatePhoneNumber(formatted));
  };

  const handlePayment = async () => {
    if (!plan || !isPhoneValid) return;

    setIsProcessing(true);
    setPaymentStep('initiating');

    try {
      const result = await initiatePayment(plan.id, phoneNumber);

      if (result.success) {
        setCheckoutRequestId(result.checkoutRequestId);
        setPaymentStep('waiting');

        // Poll for payment status
        pollPaymentStatus(result.subscriptionId);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment Failed', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      setIsProcessing(false);
      setPaymentStep('idle');
    }
  };

  const pollPaymentStatus = async (subscriptionId: string) => {
    let attempts = 0;
    const maxAttempts = 40;

    const poll = setInterval(async () => {
      attempts++;

      if (attempts === 2) {
        setPaymentStep('verifying');
      }

      try {
        const status = await checkPaymentStatus(subscriptionId);

        if (status.success && status.status === 'active') {
          clearInterval(poll);

          // Trigger confetti
          const duration = 3000;
          const animationEnd = Date.now() + duration;

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
              clearInterval(interval);
              return;
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
              particleCount,
              startVelocity: 30,
              spread: 360,
              origin: { x: Math.random(), y: Math.random() - 0.2 },
              colors: ['#f97316', '#22c55e', '#3b82f6', '#eab308']
            });
          }, 250);

          toast.success('Payment Successful!', {
            description: 'Your subscription is now active'
          });

          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else if (status.status === 'failed') {
          clearInterval(poll);
          toast.error('Payment Failed', {
            description: status.message || 'Please try again'
          });
          setIsProcessing(false);
          setPaymentStep('idle');
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          toast.error('Payment Timeout', {
            description: 'Please check your subscription status'
          });
          setIsProcessing(false);
          setPaymentStep('idle');
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setIsProcessing(false);
          setPaymentStep('idle');
        }
      }
    }, 6000);
  };

  if (!plan) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Button
        variant="ghost"
        onClick={() => navigate('/subscription')}
        className="mb-6"
        disabled={isProcessing}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plans
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Plan Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
              <CardDescription>Review your selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">{plan.name}</span>
                  {plan.popular && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-orange-600">
                  KES {plan.price.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  per {plan.duration === 'monthly' ? 'month' : 'year'}
                </p>
              </div>

              {plan.savings && (
                <Alert className="bg-green-50 border-green-200">
                  <Award className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>Save KES {plan.savings.toLocaleString()}</strong> with this plan
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3 pt-3 border-t">
                <p className="font-semibold text-sm">What's included:</p>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Payment Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Payment Details</CardTitle>
              <CardDescription>Complete your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trust Signal */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    Secure M-Pesa Payment
                  </p>
                  <p className="text-xs text-green-700">
                    PCI-DSS compliant • 256-bit encryption
                  </p>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-700 ml-auto">
                  Verified
                </Badge>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  M-Pesa Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <span className="text-sm font-medium text-muted-foreground">🇰🇪 +254</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="712345678"
                    value={phoneNumber.startsWith('254') ? phoneNumber.slice(3) : phoneNumber}
                    onChange={handlePhoneChange}
                    className="text-base h-12 pl-20 pr-10"
                    disabled={isProcessing}
                    autoFocus
                    autoComplete="tel"
                  />
                  {phoneNumber && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isPhoneValid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Enter your Safaricom number (7XX or 1XX format)
                </p>
              </div>

              {/* Payment Status */}
              {isProcessing && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <AlertDescription className="text-blue-900 ml-2">
                    <div className="space-y-2">
                      {paymentStep === 'initiating' && (
                        <>
                          <p className="font-semibold">Step 1/3: Initiating Payment</p>
                          <p className="text-sm">Sending M-Pesa prompt to {phoneNumber}...</p>
                        </>
                      )}
                      {paymentStep === 'waiting' && (
                        <>
                          <p className="font-semibold">Step 2/3: Waiting for Confirmation</p>
                          <p className="text-sm">
                            Check your phone for M-Pesa notification and enter your PIN
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-blue-700">
                            <Smartphone className="h-3 w-3" />
                            <span>Look for a popup on your phone screen</span>
                          </div>
                        </>
                      )}
                      {paymentStep === 'verifying' && (
                        <>
                          <p className="font-semibold">Step 3/3: Verifying Payment</p>
                          <p className="text-sm">Confirming payment with Safaricom M-Pesa...</p>
                        </>
                      )}
                      {checkoutRequestId && (
                        <p className="text-xs text-blue-700 mt-2">
                          Transaction ID: {checkoutRequestId.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={!isPhoneValid || isProcessing}
                className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-5 w-5" />
                    Pay KES {plan.price.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By completing this purchase, you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Trust & FAQ */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-background">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">30-Day Money-Back Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  When will my subscription start?
                </p>
                <p className="text-muted-foreground">
                  Immediately after payment confirmation. You'll have instant access to all premium features.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Can I cancel anytime?
                </p>
                <p className="text-muted-foreground">
                  Yes! Cancel anytime from your account settings. You'll keep access until the end of your billing period.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Is M-Pesa payment safe?
                </p>
                <p className="text-muted-foreground">
                  Absolutely. All transactions are encrypted and processed through Safaricom's secure M-Pesa platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
