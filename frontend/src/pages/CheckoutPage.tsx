import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { getParse } from '@/config/parse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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
  Clock,
  RefreshCw,
  Download,
  Mail,
  Receipt,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface ReceiptData {
  mpesaReceiptNumber: string;
  amount: number;
  planName: string;
  expiresAt: Date;
  subscriptionId: string;
}

type ConsentState = 'loading' | 'required' | 'pending' | 'given';

export const CheckoutPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plans, initiatePayment, checkPaymentStatus } = useSubscription();

  // Plan
  const [plan, setPlan] = useState<typeof plans[0] | null>(null);

  // Consent
  const [consentState, setConsentState] = useState<ConsentState>('loading');
  const [consentEmail, setConsentEmail] = useState('');
  const [consentName, setConsentName] = useState('');
  const [consentSending, setConsentSending] = useState(false);

  // Payment
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'initiating' | 'waiting' | 'verifying' | 'success'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  // Load selected plan
  useEffect(() => {
    if (plans.length === 0) return;
    const selected = plans.find(p => p.id === planId);
    if (!selected) {
      toast.error('Invalid plan selected');
      navigate('/subscription');
      return;
    }
    setPlan(selected);
  }, [planId, plans, navigate]);

  // Load consent status on mount
  useEffect(() => {
    const load = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getConsentStatus');
        if (result.parentEmail) {
          setConsentEmail(result.parentEmail);
          setParentEmail(result.parentEmail);
        }
        if (result.parentName) setConsentName(result.parentName);
        if (result.parentPhone) {
          const digits = result.parentPhone.replace(/\D/g, '');
          let formatted = digits;
          if (digits.startsWith('0')) formatted = '254' + digits.slice(1);
          else if (!digits.startsWith('254')) formatted = '254' + digits;
          const trimmed = formatted.slice(0, 12);
          setPhoneNumber(trimmed);
          setIsPhoneValid(/^254[17]\d{8}$/.test(trimmed));
        }
        setConsentState(result.consentGiven ? 'given' : 'required');
      } catch {
        // Don't block payment if consent check fails
        setConsentState('given');
      }
    };
    load();
  }, []);

  // Countdown timer during 'waiting' — STK push expires after 60s
  useEffect(() => {
    if (paymentStep !== 'waiting') return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentStep]);

  // Auto-navigate to dashboard after success receipt is shown
  useEffect(() => {
    if (paymentStep !== 'success') return;
    const timer = setTimeout(() => navigate('/dashboard'), 6000);
    return () => clearTimeout(timer);
  }, [paymentStep, navigate]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = digits;
    if (digits.startsWith('0')) formatted = '254' + digits.slice(1);
    else if (digits.startsWith('254')) formatted = digits;
    else if (digits.startsWith('7') || digits.startsWith('1')) formatted = '254' + digits;
    return formatted.slice(0, 12);
  };

  const validatePhoneNumber = (value: string) => /^254[17]\d{8}$/.test(value);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setIsPhoneValid(validatePhoneNumber(formatted));
  };

  const handleSendConsent = async () => {
    if (!consentEmail) {
      toast.error('Please enter a parent / guardian email address');
      return;
    }
    setConsentSending(true);
    try {
      const Parse = getParse();
      await Parse.Cloud.run('requestParentConsent', {
        parentEmail: consentEmail,
        ...(consentName ? { parentName: consentName } : {}),
      });
      setConsentState('pending');
      toast.success('Consent request sent', { description: `Email sent to ${consentEmail}` });
    } catch (err) {
      toast.error('Failed to send consent request', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setConsentSending(false);
    }
  };

  const handleCheckConsent = async () => {
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('getConsentStatus');
      if (result.consentGiven) {
        setConsentState('given');
        toast.success('Consent confirmed! You can now complete payment.');
      } else {
        toast.info('Not yet confirmed. Ask your parent to check their email.');
      }
    } catch {
      toast.error('Could not check consent status');
    }
  };

  const triggerPayment = async () => {
    if (!plan || !isPhoneValid) return;
    setIsProcessing(true);
    setPaymentStep('initiating');
    try {
      const result = await initiatePayment(plan.id, phoneNumber, parentEmail || undefined);
      if (result.success) {
        setCheckoutRequestId(result.checkoutRequestId);
        setPaymentStep('waiting');
        toast.info('Check your phone for M-Pesa prompt');
        pollPaymentStatus(result.subscriptionId, plan);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment Failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
      setIsProcessing(false);
      setPaymentStep('idle');
    }
  };

  const pollPaymentStatus = (subscriptionId: string, currentPlan: typeof plans[0]) => {
    let attempts = 0;
    const maxAttempts = 40;

    const poll = setInterval(async () => {
      attempts++;
      if (attempts === 2) setPaymentStep('verifying');

      try {
        const status = await checkPaymentStatus(subscriptionId);

        if (status.success && status.status === 'active') {
          clearInterval(poll);
          setReceiptData({
            mpesaReceiptNumber: status.mpesaReceiptNumber || '—',
            amount: currentPlan.price,
            planName: currentPlan.name,
            expiresAt: new Date(status.expiresAt),
            subscriptionId,
          });

          const end = Date.now() + 2500;
          const burst = setInterval(() => {
            if (Date.now() > end) { clearInterval(burst); return; }
            confetti({
              particleCount: 50 * ((end - Date.now()) / 2500),
              startVelocity: 30,
              spread: 360,
              origin: { x: Math.random(), y: Math.random() - 0.2 },
              colors: ['#f97316', '#22c55e', '#3b82f6', '#eab308'],
            });
          }, 250);

          setPaymentStep('success');
          toast.success('Payment Successful!', { description: 'Your subscription is now active' });

        } else if (status.status === 'failed') {
          clearInterval(poll);
          toast.error('Payment Failed', { description: status.message || 'Please try again' });
          setIsProcessing(false);
          setPaymentStep('idle');
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          toast.error('Payment Timeout', { description: 'Please check your subscription status' });
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

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (!plan || consentState === 'loading') {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  // ── SUCCESS RECEIPT ───────────────────────────────────────────────────────
  if (paymentStep === 'success' && receiptData) {
    return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center max-w-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700">Payment Confirmed!</h1>
          <p className="text-muted-foreground mt-1">Your subscription is now active</p>
        </div>

        <Card className="w-full border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-green-700" />
                Receipt
              </CardTitle>
              <Badge className="bg-green-700 text-white">Paid</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{receiptData.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-green-700">KES {receiptData.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">M-Pesa Receipt</span>
                <span className="font-mono font-medium">{receiptData.mpesaReceiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Until</span>
                <span className="font-medium">
                  {receiptData.expiresAt.toLocaleDateString('en-KE', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
              {parentEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice sent to</span>
                  <span className="font-medium text-blue-600">{parentEmail}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/billing')}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Redirecting to dashboard in a moment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── CONSENT GATE ──────────────────────────────────────────────────────────
  if (consentState === 'required' || consentState === 'pending') {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => navigate('/subscription')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>

        <div className="max-w-lg mx-auto space-y-6">
          {/* Brand header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Parent Consent Required</h1>
            <p className="text-sm text-muted-foreground mt-1">
              You're subscribing to <strong>{plan.name}</strong> · KES {plan.price.toLocaleString()}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-5">
              {consentState === 'required' && (
                <>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      Under the Kenya Data Protection Act 2019, students under 18 require a parent
                      or guardian's consent before we can activate a paid subscription. We'll send
                      a quick email — it only takes a minute to approve.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="consentName">Parent / Guardian Name</Label>
                      <Input
                        id="consentName"
                        placeholder="e.g. Jane Wanjiru"
                        value={consentName}
                        onChange={e => setConsentName(e.target.value)}
                        disabled={consentSending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consentEmail">
                        Parent / Guardian Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="consentEmail"
                        type="email"
                        placeholder="parent@example.com"
                        value={consentEmail}
                        onChange={e => setConsentEmail(e.target.value)}
                        disabled={consentSending}
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground">
                        A consent link will be sent to this address
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={handleSendConsent}
                    disabled={!consentEmail || consentSending}
                  >
                    {consentSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Consent Request
                      </>
                    )}
                  </Button>
                </>
              )}

              {consentState === 'pending' && (
                <>
                  <div className="flex flex-col items-center py-4 gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                      <Mail className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Consent Request Sent</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Email sent to <strong>{consentEmail}</strong>
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Ask your parent to open the email from Elimu Smart and click{' '}
                      <strong>"I Give My Consent"</strong>. The link is valid for 7 days.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCheckConsent}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      My Parent Has Consented — Check Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setConsentState('required');
                        setConsentEmail('');
                      }}
                    >
                      Send to a Different Email
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── MAIN CHECKOUT (consent given) ─────────────────────────────────────────
  return (
    <div className="container mx-auto py-8 px-4">
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
        {/* Order Summary */}
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

        {/* Payment Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Payment Details</CardTitle>
              <CardDescription>Complete your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trust badge */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Secure M-Pesa Payment</p>
                  <p className="text-xs text-green-700">PCI-DSS compliant · 256-bit encryption</p>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-700 ml-auto">
                  Verified
                </Badge>
              </div>

              {/* Parent / Guardian M-Pesa number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Parent / Guardian M-Pesa Number
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
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
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isPhoneValid
                        ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                        : <AlertCircle className="h-5 w-5 text-orange-500" />}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Your parent's Safaricom number (7XX or 1XX format)
                </p>
              </div>

              {/* Parent email (optional invoice CC) */}
              <div className="space-y-2">
                <Label htmlFor="parentEmail" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Parent / Guardian Email
                  <Badge variant="outline" className="text-xs py-0">Invoice</Badge>
                </Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={e => setParentEmail(e.target.value)}
                  disabled={isProcessing}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Receipt will be emailed to this address after payment
                </p>
              </div>

              {/* Status display */}
              {isProcessing && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600 shrink-0" />
                  <AlertDescription className="text-blue-900 ml-2">
                    <div className="space-y-2">
                      {paymentStep === 'initiating' && (
                        <>
                          <p className="font-semibold">Step 1/3: Sending Prompt</p>
                          <p className="text-sm">Dispatching M-Pesa prompt to +{phoneNumber}...</p>
                        </>
                      )}
                      {paymentStep === 'waiting' && (
                        <>
                          <p className="font-semibold">Step 2/3: Waiting for PIN</p>
                          <p className="text-sm">Enter your M-Pesa PIN on the phone</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-xs text-blue-700">
                              <Smartphone className="h-3 w-3" />
                              <span>Look for M-Pesa popup</span>
                            </div>
                            {countdown > 0 ? (
                              <span className="text-xs font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-800">
                                Expires in {countdown}s
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs border-blue-400 text-blue-700"
                                onClick={triggerPayment}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Resend
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                      {paymentStep === 'verifying' && (
                        <>
                          <p className="font-semibold">Step 3/3: Verifying</p>
                          <p className="text-sm">Confirming with Safaricom M-Pesa...</p>
                        </>
                      )}
                      {checkoutRequestId && (
                        <p className="text-xs text-blue-600 mt-1 font-mono">
                          Ref: {checkoutRequestId.slice(0, 14)}...
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Pay button */}
              <Button
                onClick={triggerPayment}
                disabled={!isPhoneValid || isProcessing}
                className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-5 w-5" />
                    Pay KES {plan.price.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By completing this purchase you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust & FAQ */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-background">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">30-Day Money-Back Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    Not satisfied? Full refund within 30 days, no questions asked.
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
                  Immediately after payment confirmation. Instant access to all premium features.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Can I cancel anytime?
                </p>
                <p className="text-muted-foreground">
                  Yes! Cancel from your account settings. Access continues until end of billing period.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Is M-Pesa payment safe?
                </p>
                <p className="text-muted-foreground">
                  Absolutely. All transactions are processed through Safaricom's secure M-Pesa platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
