import { useState } from 'react';
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
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

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
    setErrorMessage('');

    try {
      // Initiate payment
      const Parse = await import('parse').then(m => m.default);
      const result = await Parse.Cloud.run('initiateSubscriptionPayment', {
        planId: plan.id,
        phoneNumber: phoneNumber.replace(/\s+/g, '')
      });

      if (result.success) {
        setCheckoutRequestId(result.checkoutRequestId);
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
      onError?.(message);
    }
  };

  const pollPaymentStatus = async (subscriptionId: string) => {
    let attempts = 0;
    const maxAttempts = 40; // Poll for 4 minutes (40 * 6 seconds)

    const poll = setInterval(async () => {
      attempts++;

      try {
        const Parse = await import('parse').then(m => m.default);
        const status = await Parse.Cloud.run('checkSubscriptionPaymentStatus', {
          subscriptionId
        });

        if (status.success && status.status === 'active') {
          clearInterval(poll);
          setPaymentStatus('success');
          setTimeout(() => {
            setOpen(false);
            onSuccess?.();
            // Reset form
            setPhoneNumber('');
            setPaymentStatus('idle');
            setCheckoutRequestId('');
          }, 3000); // Show success for 3 seconds
        } else if (status.status === 'failed') {
          clearInterval(poll);
          setPaymentStatus('error');
          setErrorMessage(status.message || 'Payment failed');
          onError?.(status.message || 'Payment failed');
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setPaymentStatus('error');
          setErrorMessage('Payment timeout. Please check your subscription status.');
          onError?.('Payment timeout');
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setPaymentStatus('error');
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
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-base h-12 pl-11"
                disabled={paymentStatus === 'processing'}
                autoFocus
                autoComplete="tel"
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Format: 254XXXXXXXXX (include country code)
            </p>
          </div>

          {/* Status Feedback */}
          {paymentStatus === 'processing' && (
            <Alert className="bg-blue-50 border-blue-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-900 ml-2">
                <div className="space-y-1">
                  <p className="font-semibold">STK Push Sent</p>
                  <p className="text-sm">
                    Check your phone and enter your M-Pesa PIN to complete payment
                  </p>
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
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-900 ml-2">
                <p className="font-semibold">Payment Successful!</p>
                <p className="text-sm mt-1">
                  Your subscription is now active. Redirecting...
                </p>
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
