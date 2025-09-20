import { createClient } from '@/utils/supabase/server';
import {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '@/types';

export class SubscriptionService {
  static async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<Subscription | null> {
    const supabase = await createClient();

    const subscriptionData = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }

    return subscription;
  }

  static async getSubscriptionByPolarId(
    polarId: string
  ): Promise<Subscription | null> {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('polar_subscription_id', polarId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return subscription;
  }

  static async updateSubscription(
    polarId: string,
    updates: UpdateSubscriptionRequest
  ): Promise<Subscription | null> {
    const supabase = await createClient();

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('polar_subscription_id', polarId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return null;
    }

    return subscription;
  }

  static async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const supabase = await createClient();

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user subscriptions:', error);
      return [];
    }

    return subscriptions || [];
  }
}
