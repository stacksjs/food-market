import type { VineType } from '@stacksjs/types'
import type { Request } from '../core/router/src/request'

interface ValidationField {
  rule: VineType
  message: Record<string, string>
}

interface CustomAttributes {
  [key: string]: ValidationField
}

interface RequestDataProduct {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  inventory_count: number
  category_id: string
  preparation_time: number
  allergens: string // Store as JSON string
  nutritional_info: string // Store as JSON string
  product_category_id: number
  created_at?: Date
  updated_at?: Date
}
export interface ProductRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'description' | 'image_url' | 'category_id') => string) & ((key: 'price' | 'inventory_count' | 'preparation_time') => number) & ((key: 'is_available') => boolean) & ((key: 'allergens' | 'nutritional_info') => string) & ((key: 'product_category_id') => string)

  all: () => RequestDataProduct
  id: number
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  inventory_count: number
  category_id: string
  preparation_time: number
  allergens: string // Store as JSON string
  nutritional_info: string // Store as JSON string
  product_category_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataOrder {
  id: number
  customer_id: string
  status: string
  total_amount: number
  tax_amount: number
  discount_amount: number
  delivery_fee: number
  tip_amount: number
  order_type: string
  delivery_address: string
  special_instructions: string
  estimated_delivery_time: string // Store as ISO date string
  applied_coupon_id: string
  order_items: string // Store as JSON string
  coupon_id: number
  created_at?: Date
  updated_at?: Date
}
export interface OrderRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'customer_id' | 'status' | 'order_type' | 'delivery_address' | 'special_instructions' | 'applied_coupon_id') => string) & ((key: 'total_amount' | 'tax_amount' | 'discount_amount' | 'delivery_fee' | 'tip_amount') => number) & ((key: 'estimated_delivery_time') => string) & ((key: 'order_items') => string) & ((key: 'coupon_id') => string)

  all: () => RequestDataOrder
  id: number
  customer_id: string
  status: string
  total_amount: number
  tax_amount: number
  discount_amount: number
  delivery_fee: number
  tip_amount: number
  order_type: string
  delivery_address: string
  special_instructions: string
  estimated_delivery_time: string // Store as ISO date string
  applied_coupon_id: string
  order_items: string // Store as JSON string
  coupon_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataCoupon {
  id: number
  code: string
  description: string
  discount_type: string
  discount_value: number
  min_order_amount: number
  max_discount_amount: number
  free_product_id: string
  is_active: boolean
  usage_limit: number
  usage_count: number
  start_date: string
  end_date: string
  applicable_products: string
  applicable_categories: string
  created_at?: Date
  updated_at?: Date
}
export interface CouponRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'code' | 'description' | 'discount_type' | 'free_product_id' | 'start_date' | 'end_date' | 'applicable_products' | 'applicable_categories') => string) & ((key: 'discount_value' | 'min_order_amount' | 'max_discount_amount' | 'usage_limit' | 'usage_count') => number) & ((key: 'is_active') => boolean)

  all: () => RequestDataCoupon
  id: number
  code: string
  description: string
  discount_type: string
  discount_value: number
  min_order_amount: number
  max_discount_amount: number
  free_product_id: string
  is_active: boolean
  usage_limit: number
  usage_count: number
  start_date: string
  end_date: string
  applicable_products: string
  applicable_categories: string
  created_at?: Date
  updated_at?: Date
}

interface RequestDataTransaction {
  id: number
  order_id: string
  amount: number
  status: string
  payment_method: string
  payment_details: string // Store as JSON string
  transaction_reference: string
  loyalty_points_earned: number
  loyalty_points_redeemed: number
  user_id: number
  created_at?: Date
  updated_at?: Date
}
export interface TransactionRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'order_id' | 'status' | 'payment_method' | 'transaction_reference') => string) & ((key: 'amount' | 'loyalty_points_earned' | 'loyalty_points_redeemed') => number) & ((key: 'payment_details') => string) & ((key: 'user_id') => string)

  all: () => RequestDataTransaction
  id: number
  order_id: string
  amount: number
  status: string
  payment_method: string
  payment_details: string // Store as JSON string
  transaction_reference: string
  loyalty_points_earned: number
  loyalty_points_redeemed: number
  user_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataLoyaltyPoint {
  id: number
  wallet_id: string
  points: number
  source: string
  source_reference_id: string
  description: string
  expiry_date: string
  is_used: boolean
  created_at?: Date
  updated_at?: Date
}
export interface LoyaltyPointRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'wallet_id' | 'source' | 'source_reference_id' | 'description' | 'expiry_date') => string) & ((key: 'points') => number) & ((key: 'is_used') => boolean)

  all: () => RequestDataLoyaltyPoint
  id: number
  wallet_id: string
  points: number
  source: string
  source_reference_id: string
  description: string
  expiry_date: string
  is_used: boolean
  created_at?: Date
  updated_at?: Date
}

interface RequestDataLoyaltyReward {
  id: number
  name: string
  description: string
  points_required: number
  reward_type: string
  discount_percentage: number
  free_product_id: string
  is_active: boolean
  expiry_days: number
  image_url: string
  created_at?: Date
  updated_at?: Date
}
export interface LoyaltyRewardRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'description' | 'reward_type' | 'free_product_id' | 'image_url') => string) & ((key: 'points_required' | 'discount_percentage' | 'expiry_days') => number) & ((key: 'is_active') => boolean)

  all: () => RequestDataLoyaltyReward
  id: number
  name: string
  description: string
  points_required: number
  reward_type: string
  discount_percentage: number
  free_product_id: string
  is_active: boolean
  expiry_days: number
  image_url: string
  created_at?: Date
  updated_at?: Date
}

interface RequestDataProductCategory {
  id: number
  name: string
  description: string
  image_url: string
  is_active: boolean
  parent_category_id: string
  display_order: number
  created_at?: Date
  updated_at?: Date
}
export interface ProductCategoryRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'description' | 'image_url' | 'parent_category_id') => string) & ((key: 'is_active') => boolean) & ((key: 'display_order') => number)

  all: () => RequestDataProductCategory
  id: number
  name: string
  description: string
  image_url: string
  is_active: boolean
  parent_category_id: string
  display_order: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataUser {
  id: number
  name: string
  email: string
  job_title: string
  password: string
  created_at?: Date
  updated_at?: Date
}
export interface UserRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'email' | 'job_title' | 'password') => string)

  all: () => RequestDataUser
  id: number
  name: string
  email: string
  job_title: string
  password: string
  created_at?: Date
  updated_at?: Date
}

interface RequestDataFailedJob {
  id: number
  connection: string
  queue: string
  payload: string
  exception: string
  failed_at: date
  created_at?: Date
  updated_at?: Date
}
export interface FailedJobRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'connection' | 'queue' | 'payload' | 'exception') => string) & ((key: 'failed_at') => date)

  all: () => RequestDataFailedJob
  id: number
  connection: string
  queue: string
  payload: string
  exception: string
  failed_at: date
  created_at?: Date
  updated_at?: Date
}

interface RequestDataAccessToken {
  id: number
  name: string
  token: string
  plain_text_token: string
  abilities: string[]
  last_used_at: date
  expires_at: date
  revoked_at: date
  ip_address: string
  device_name: string
  is_single_use: boolean
  team_id: number
  created_at?: Date
  updated_at?: Date
}
export interface AccessTokenRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'token' | 'plain_text_token' | 'ip_address' | 'device_name') => string) & ((key: 'abilities') => string[]) & ((key: 'last_used_at' | 'expires_at' | 'revoked_at') => date) & ((key: 'is_single_use') => boolean) & ((key: 'team_id') => string)

  all: () => RequestDataAccessToken
  id: number
  name: string
  token: string
  plain_text_token: string
  abilities: string[]
  last_used_at: date
  expires_at: date
  revoked_at: date
  ip_address: string
  device_name: string
  is_single_use: boolean
  team_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataPaymentMethod {
  id: number
  type: string
  last_four: number
  brand: string
  exp_month: number
  exp_year: number
  is_default: boolean
  provider_id: string
  user_id: number
  created_at?: Date
  updated_at?: Date
}
export interface PaymentMethodRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'type' | 'brand' | 'provider_id') => string) & ((key: 'last_four' | 'exp_month' | 'exp_year') => number) & ((key: 'is_default') => boolean) & ((key: 'user_id') => string)

  all: () => RequestDataPaymentMethod
  id: number
  type: string
  last_four: number
  brand: string
  exp_month: number
  exp_year: number
  is_default: boolean
  provider_id: string
  user_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataPaymentTransaction {
  id: number
  name: string
  description: string
  amount: number
  type: string
  provider_id: string
  payment_method_id: number
  created_at?: Date
  updated_at?: Date
}
export interface PaymentTransactionRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'description' | 'type' | 'provider_id') => string) & ((key: 'amount') => number) & ((key: 'payment_method_id') => string)

  all: () => RequestDataPaymentTransaction
  id: number
  name: string
  description: string
  amount: number
  type: string
  provider_id: string
  payment_method_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataTeam {
  id: number
  name: string
  company_name: string
  email: string
  billing_email: string
  status: string
  description: string
  path: string
  is_personal: boolean
  created_at?: Date
  updated_at?: Date
}
export interface TeamRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'company_name' | 'email' | 'billing_email' | 'status' | 'description' | 'path') => string) & ((key: 'is_personal') => boolean)

  all: () => RequestDataTeam
  id: number
  name: string
  company_name: string
  email: string
  billing_email: string
  status: string
  description: string
  path: string
  is_personal: boolean
  created_at?: Date
  updated_at?: Date
}

interface RequestDataRequest {
  id: number
  method: string[]
  path: string
  status_code: number
  duration_ms: number
  ip_address: string
  memory_usage: number
  user_agent: string
  error_message: string
  deleted_at?: Date
  created_at?: Date
  updated_at?: Date
}
export interface RequestRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'method') => string[]) & ((key: 'path' | 'ip_address' | 'user_agent' | 'error_message') => string) & ((key: 'status_code' | 'duration_ms' | 'memory_usage') => number)

  all: () => RequestDataRequest
  id: number
  method: string[]
  path: string
  status_code: number
  duration_ms: number
  ip_address: string
  memory_usage: number
  user_agent: string
  error_message: string
  deleted_at?: Date
  created_at?: Date
  updated_at?: Date
}

interface RequestDataJob {
  id: number
  queue: string
  payload: string
  attempts: number
  available_at: number
  reserved_at: date
  created_at?: Date
  updated_at?: Date
}
export interface JobRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'queue' | 'payload') => string) & ((key: 'attempts' | 'available_at') => number) & ((key: 'reserved_at') => date)

  all: () => RequestDataJob
  id: number
  queue: string
  payload: string
  attempts: number
  available_at: number
  reserved_at: date
  created_at?: Date
  updated_at?: Date
}

interface RequestDataSubscription {
  id: number
  type: string
  provider_id: string
  provider_status: string
  unit_price: number
  provider_type: string
  provider_price_id: string
  quantity: number
  trial_ends_at: string
  ends_at: string
  last_used_at: string
  user_id: number
  created_at?: Date
  updated_at?: Date
}
export interface SubscriptionRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'type' | 'provider_id' | 'provider_status' | 'provider_type' | 'provider_price_id' | 'trial_ends_at' | 'ends_at' | 'last_used_at') => string) & ((key: 'unit_price' | 'quantity') => number) & ((key: 'user_id') => string)

  all: () => RequestDataSubscription
  id: number
  type: string
  provider_id: string
  provider_status: string
  unit_price: number
  provider_type: string
  provider_price_id: string
  quantity: number
  trial_ends_at: string
  ends_at: string
  last_used_at: string
  user_id: number
  created_at?: Date
  updated_at?: Date
}

interface RequestDataPaymentProduct {
  id: number
  name: string
  description: number
  key: number
  unit_price: number
  status: string
  image: string
  provider_id: string
  created_at?: Date
  updated_at?: Date
}
export interface PaymentProductRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'name' | 'status' | 'image' | 'provider_id') => string) & ((key: 'description' | 'key' | 'unit_price') => number)

  all: () => RequestDataPaymentProduct
  id: number
  name: string
  description: number
  key: number
  unit_price: number
  status: string
  image: string
  provider_id: string
  created_at?: Date
  updated_at?: Date
}

interface RequestDataError {
  id: number
  type: string
  message: string
  stack: string
  status: number
  additional_info: string
  created_at?: Date
  updated_at?: Date
}
export interface ErrorRequestType extends Request {
  validate: (attributes?: CustomAttributes) => void
  get: ((key: 'id') => number) & ((key: 'type' | 'message' | 'stack' | 'additional_info') => string) & ((key: 'status') => number)

  all: () => RequestDataError
  id: number
  type: string
  message: string
  stack: string
  status: number
  additional_info: string
  created_at?: Date
  updated_at?: Date
}

export type ModelRequest = ProductRequestType | OrderRequestType | CouponRequestType | TransactionRequestType | LoyaltyPointRequestType | LoyaltyRewardRequestType | ProductCategoryRequestType | UserRequestType | FailedJobRequestType | AccessTokenRequestType | PaymentMethodRequestType | PaymentTransactionRequestType | TeamRequestType | RequestRequestType | JobRequestType | SubscriptionRequestType | PaymentProductRequestType | ErrorRequestType
