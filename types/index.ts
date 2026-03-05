export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export type MemberRole = 'admin' | 'editor';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';

export type PaymentStatus = 'paid' | 'failed' | 'refunded' | 'pending';

export type PaymentMethod = 'mock' | 'stripe' | 'paypal';

export type BillingInterval = 'month' | 'year';

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_interval: BillingInterval;
  vat_row_limit: number | null;
  member_limit: number | null;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  owner_user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionMember {
  id: string;
  subscription_id: string;
  user_id: string;
  role: MemberRole;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberWithUser extends SubscriptionMember {
  users: {
    email: string;
    clerk_user_id: string;
  };
}

export interface Invitation {
  id: string;
  subscription_id: string;
  invited_by: string;
  email: string;
  role: MemberRole;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  paid_at: string;
  created_at: string;
}

export interface Vat {
  id: string;
  subscription_id: string;
  created_by: string;
  last_updated_by: string | null;
  name: string;
  rate: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VatWithCreator extends Vat {
  users: { email: string };
}

export interface UserSubscriptionContext {
  user_id: string;
  clerk_user_id: string;
  email: string;
  member_id: string;
  subscription_id: string;
  role: MemberRole;
  owner_user_id: string;
  is_owner: boolean;
  plan_id: string;
  plan_name: string;
  plan_price: number;
  currency: string;
  billing_interval: BillingInterval;
  vat_row_limit: number | null;
  member_limit: number | null;
  subscription_status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface SubscriptionVatUsage {
  subscription_id: string;
  vat_row_limit: number | null;
  vat_rows_used: number;
  can_add_vat_row: boolean;
}

export interface SubscriptionMemberUsage {
  subscription_id: string;
  member_limit: number | null;
  members_used: number;
  can_add_member: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface CreateVatPayload {
  name: string;
  rate: number;
  is_active?: boolean;
}

export interface UpdateVatPayload {
  name?: string;
  rate?: number;
  is_active?: boolean;
}

export interface InviteMemberPayload {
  email: string;
  role: MemberRole;
}

export interface UpdateMemberRolePayload {
  role: MemberRole;
}

export interface PurchasePlanPayload {
  planId: string;
}