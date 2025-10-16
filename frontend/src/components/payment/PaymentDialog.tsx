import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface PaymentDialogProps {
  plan: SubscriptionPlan;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  trigger?: React.ReactNode;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export function PaymentDialog({
  plan,
  onSuccess,
  onError,
  trigger
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'initiating' | 'waiting' | 'verifying'>('idle');

  // Trigger confetti on payment success
  useEffect(() => {
    if (paymentStatus === 'success') {
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

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
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#f97316', '#22c55e', '#3b82f6', '#eab308']
        });
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          },
          colors: ['#f97316', '#22c55e', '#3b82f6', '#eab308']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [paymentStatus]);

  // Auto-format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Handle different input formats
    let formatted = digits;
    if (digits.startsWith('0')) {
      // Convert 07XX to 2547XX
      formatted = '254' + digits.slice(1);
    } else if (digits.startsWith('254')) {
      // Already in correct format
      formatted = digits;
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      // Add 254 prefix
      formatted = '254' + digits;
    }

    // Limit to 12 digits (254XXXXXXXXX)
    return formatted.slice(0, 12);
  };

  // Validate phone number in real-time
  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^254[17]\d{8}$/;
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setIsPhoneValid(validatePhoneNumber(formatted));

    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
      setPaymentStatus('idle');
    }
  };

  const handlePayment = async () => {
    // Validate phone number
    if (!phoneNumber) {
      setErrorMessage('Please enter your M-Pesa phone number');
      setPaymentStatus('error');
      return;
    }

    // Format validation (254XXXXXXXXX)
    const phoneRegex = /^(?:254)?[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setErrorMessage('Invalid phone number. Format: 254712345678');
      setPaymentStatus('error');
      return;
    }

    setPaymentStatus('processing');
    setPaymentStep('initiating');
    setErrorMessage('');

    try {
      // Step 1: Initiate payment
      const Parse = await import('parse').then(m => m.default);
      const result = await Parse.Cloud.run('initiateSubscriptionPayment', {
        planId: plan.id,
        phoneNumber: phoneNumber.replace(/\s+/g, '')
      });

      if (result.success) {
        setCheckoutRequestId(result.checkoutRequestId);
        setPaymentStep('waiting');
        // Start polling for payment status
        pollPaymentStatus(result.subscriptionId);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const message = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setErrorMessage(message);
      setPaymentStatus('error');
      setPaymentStep('idle');
      onError?.(message);
    }
  };

  const pollPaymentStatus = async (subscriptionId: string) => {
    let attempts = 0;
    const maxAttempts = 40; // Poll for 4 minutes (40 * 6 seconds)

    const poll = setInterval(async () => {
      attempts++;

      // Update step after 10 seconds (user likely entering PIN)
      if (attempts === 2) {
        setPaymentStep('verifying');
      }

      try {
        const Parse = await import('parse').then(m => m.default);
        const status = await Parse.Cloud.run('checkSubscriptionPaymentStatus', {
          subscriptionId
        });

        if (status.success && status.status === 'active') {
          clearInterval(poll);
          setPaymentStatus('success');
          setPaymentStep('idle');
          setTimeout(() => {
            setOpen(false);
            onSuccess?.();
            // Reset form
            setPhoneNumber('');
            setIsPhoneValid(false);
            setPaymentStatus('idle');
            setCheckoutRequestId('');
          }, 3000); // Show success for 3 seconds
        } else if (status.status === 'failed') {
          clearInterval(poll);
          setPaymentStatus('error');
          setPaymentStep('idle');
          setErrorMessage(status.message || 'Payment failed');
          onError?.(status.message || 'Payment failed');
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setPaymentStatus('error');
          setPaymentStep('idle');
          setErrorMessage('Payment timeout. Please check your subscription status.');
          onError?.('Payment timeout');
        }
      } catch {
        // Silent failure - continue polling unless max attempts reached
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setPaymentStatus('error');
          setPaymentStep('idle');
          setErrorMessage('Unable to verify payment status');
          onError?.('Status check failed');
        }
      }
    }, 6000); // Poll every 6 seconds
  };

  const handleClose = () => {
    if (paymentStatus !== 'processing') {
      setOpen(false);
      // Reset form after close animation
      setTimeout(() => {
        setPhoneNumber('');
        setPaymentStatus('idle');
        setErrorMessage('');
        setCheckoutRequestId('');
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            onClick={() => setOpen(true)}
          >
            Upgrade to {plan.name}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Payment</DialogTitle>
          <DialogDescription className="text-base">
            {plan.name} - <span className="font-semibold text-green-600">KES {plan.price.toLocaleString()}</span>
            <span className="text-muted-foreground">/{plan.duration}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Payment Form */}
        <div className="space-y-4 py-4">
          {/* Trust Signals */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-900">
                Secure M-Pesa Payment
              </p>
              <p className="text-xs text-green-700">
                PCI-DSS compliant • 256-bit encryption
              </p>
            </div>
            <Badge variant="outline" className="border-green-600 text-green-700 flex-shrink-0">
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
                disabled={paymentStatus === 'processing'}
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

          {/* Status Feedback with Progressive Steps */}
          {paymentStatus === 'processing' && (
            <Alert className="bg-blue-50 border-blue-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-900 ml-2">
                <div className="space-y-2">
                  {paymentStep === 'initiating' && (
                    <>
                      <p className="font-semibold">Step 1/3: Initiating Payment</p>
                      <p className="text-sm">
                        Sending M-Pesa prompt to {phoneNumber}...
                      </p>
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
                      <p className="text-sm">
                        Confirming payment with Safaricom M-Pesa...
                      </p>
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

          {paymentStatus === 'success' && (
            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
              <CheckCircle2 className="h-6 w-6 text-green-600 animate-pulse" />
              <AlertDescription className="text-green-900 ml-2">
                <div className="space-y-2">
                  <p className="font-bold text-lg">🎉 Congratulations! Payment Successful!</p>
                  <p className="text-sm">
                    Welcome to <span className="font-semibold">{plan.name}</span>! Your premium features are now unlocked.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Unlimited assessments</span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Counselor sessions</span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'error' && errorMessage && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900 ml-2">
                <p className="font-semibold">Payment Failed</p>
                <p className="text-sm mt-1">{errorMessage}</p>
                <p className="text-xs text-red-700 mt-2">
                  Please check your M-Pesa balance and try again
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Info */}
          {paymentStatus === 'idle' && (
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">What you'll get:</p>
              <ul className="space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={paymentStatus === 'processing'}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handlePayment}
            disabled={!phoneNumber || paymentStatus === 'processing' || paymentStatus === 'success'}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {paymentStatus === 'processing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Payment Complete
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                Pay KES {plan.price.toLocaleString()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
