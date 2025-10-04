import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  savings?: number;
}

interface UserSubscription {
  status: string;
  plan: string;
  planName?: string;
  expiresAt: Date | null;
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const Parse = await getParse();

      // Load subscription plans
      const plansResponse = await Parse.Cloud.run('getSubscriptionPlans');
      setPlans(plansResponse.plans || []);

      // Load user subscription
      const subscription = await Parse.Cloud.run('getUserSubscription');
      setUserSubscription(subscription);

      setError(null);
    } catch (err) {
      console.error('Error loading subscription data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async (planId: string, phoneNumber: string) => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('initiateSubscriptionPayment', { planId, phoneNumber });
      return result;
    } catch (err) {
      console.error('Error initiating payment:', err);
      throw err;
    }
  };

  const checkPaymentStatus = async (subscriptionId: string) => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('checkSubscriptionPaymentStatus', { subscriptionId });
      if (result.success) {
        await loadSubscriptionData(); // Reload subscription data
      }
      return result;
    } catch (err) {
      console.error('Error checking payment status:', err);
      throw err;
    }
  };

  const cancelSubscription = async () => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('cancelSubscription');
      await loadSubscriptionData(); // Reload subscription data
      return result;
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      throw err;
    }
  };

  return {
    plans,
    userSubscription,
    isLoading,
    error,
    initiatePayment,
    checkPaymentStatus,
    cancelSubscription,
    reload: loadSubscriptionData
  };
};
