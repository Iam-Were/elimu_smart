import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Smartphone, Loader2, AlertCircle, Info } from 'lucide-react';
import Parse from 'parse';
import { toast } from 'sonner';

interface MpesaPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  sessionName: string;
  counselorName: string;
  counselorId: string;
  sessionId: string;
}

type PaymentStatus = 'idle' | 'initiating' | 'pending' | 'success' | 'failed' | 'cancelled';

export const MpesaPaymentDialog: React.FC<MpesaPaymentDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  sessionName,
  counselorName,
  counselorId,
  sessionId
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber('');
      setStatus('idle');
      setCheckoutRequestId('');
      setErrorMessage('');
      setProgress(0);
    }
  }, [isOpen]);

  // Poll payment status when pending
  useEffect(() => {
    if (status === 'pending' && checkoutRequestId) {
      const pollInterval = setInterval(async () => {
        try {
          const result = await Parse.Cloud.run('checkMpesaPaymentStatus', {
            checkoutRequestId
          });

          if (result.status === 'success') {
            setStatus('success');
            setProgress(100);
            clearInterval(pollInterval);
            
            // Wait 2 seconds before calling onSuccess
            setTimeout(() => {
              toast.success('Payment successful!');
              onSuccess();
            }, 2000);
          } else if (result.status === 'failed' || result.status === 'cancelled') {
            setStatus(result.status);
            setErrorMessage(result.message || 'Payment failed');
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Payment status check error:', error);
        }
      }, 3000); // Poll every 3 seconds

      // Stop polling after 2 minutes (timeout)
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        if (status === 'pending') {
          setStatus('failed');
          setErrorMessage('Payment timeout. Please try again.');
        }
      }, 120000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [status, checkoutRequestId, onSuccess]);

  // Update progress for pending status
  useEffect(() => {
    if (status === 'pending') {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Cap at 90% until success
          return prev + 5;
        });
      }, 1500);

      return () => clearInterval(progressInterval);
    }
  }, [status]);

  const formatPhoneNumber = (phone: string): string => {
    // Remove spaces, dashes, and leading zeros
    let cleaned = phone.replace(/[\s-]/g, '').replace(/^0+/, '');
    
    // Add Kenya country code if not present
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formatted = formatPhoneNumber(phone);
    // Kenyan phone numbers: 254 + 9 digits (7XX, 1XX, etc.)
    return /^254[17]\d{8}$/.test(formatted);
  };

  const handleInitiatePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setStatus('initiating');
    setErrorMessage('');
    setProgress(10);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const result = await Parse.Cloud.run('initiateMpesaPayment', {
        phoneNumber: formattedPhone,
        amount,
        sessionName,
        counselorName,
        counselorId,
        sessionId
      });

      if (result.success) {
        setCheckoutRequestId(result.checkoutRequestId);
        setStatus('pending');
        setProgress(30);
        toast.info('Check your phone for M-Pesa prompt');
      } else {
        setStatus('failed');
        setErrorMessage(result.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setStatus('failed');
      setErrorMessage(errorMessage);
    }
  };

  const handleCancel = () => {
    if (status === 'pending') {
      setStatus('cancelled');
      toast.info('Payment cancelled');
    }
    onClose();
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
    setProgress(0);
    setCheckoutRequestId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment to book {sessionName} with {counselorName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-900">Amount to Pay</span>
              <span className="text-2xl font-bold text-green-700">
                KES {amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status-based UI */}
          {status === 'idle' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrorMessage('');
                  }}
                  className="text-lg"
                  maxLength={13}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the phone number registered with M-Pesa
                </p>
              </div>

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  You'll receive an M-Pesa prompt on your phone. Enter your M-Pesa PIN to complete the payment.
                </AlertDescription>
              </Alert>
            </>
          )}

          {status === 'initiating' && (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-green-600" />
              <p className="text-sm font-medium">Initiating payment...</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="relative">
                  <Smartphone className="h-16 w-16 text-green-600 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-center">
                  Check your phone for M-Pesa prompt
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Enter your M-Pesa PIN to complete payment
                </p>
              </div>
              
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Waiting for payment confirmation...
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This may take up to 2 minutes. Please don't close this window.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <p className="text-lg font-semibold text-green-700">Payment Successful!</p>
              <p className="text-sm text-muted-foreground text-center">
                Your session has been booked. Redirecting to calendar...
              </p>
              <Progress value={100} className="h-2 w-full" />
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <p className="text-xs text-muted-foreground text-center">
                Please check your M-Pesa balance and try again, or contact support if the issue persists.
              </p>
            </div>
          )}

          {status === 'cancelled' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Payment cancelled</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          {status === 'idle' && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleInitiatePayment}
                disabled={!phoneNumber || phoneNumber.length < 10}
                className="bg-green-600 hover:bg-green-700"
              >
                Pay KES {amount.toLocaleString()}
              </Button>
            </>
          )}

          {status === 'pending' && (
            <Button variant="outline" onClick={handleCancel} className="w-full">
              Cancel Payment
            </Button>
          )}

          {status === 'failed' && (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Close
              </Button>
              <Button onClick={handleRetry} className="flex-1 bg-green-600 hover:bg-green-700">
                Retry Payment
              </Button>
            </div>
          )}

          {(status === 'success' || status === 'cancelled') && (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
