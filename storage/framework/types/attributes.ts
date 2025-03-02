export interface Attributes {
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
  code: string
  initial_balance: number
  current_balance: number
  currency: string
  status: string
  purchaser_id: string
  recipient_email: string
  recipient_name: string
  personal_message: string
  is_digital: boolean
  is_reloadable: boolean
  is_active: boolean
  expiry_date: string
  last_used_date: string
  template_id: string
  customer_id: string
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
  discount_type: string
  discount_value: number
  min_order_amount: number
  max_discount_amount: number
  free_product_id: string
  usage_limit: number
  usage_count: number
  start_date: string
  end_date: string
  applicable_products: string
  applicable_categories: string
  order_id: string
  amount: number
  payment_method: string
  payment_details: string // Store as JSON string
  transaction_reference: string
  loyalty_points_earned: number
  loyalty_points_redeemed: number
  wallet_id: string
  points: number
  source: string
  source_reference_id: string
  is_used: boolean
  points_required: number
  reward_type: string
  discount_percentage: number
  expiry_days: number
  parent_category_id: string
  display_order: number
  email: string
  job_title: string
  password: string
  connection: string
  queue: string
  payload: string
  exception: string
  failed_at: Date | string
  token: string
  plain_text_token: string
  abilities: string[]
  last_used_at: Date | string
  expires_at: Date | string
  revoked_at: Date | string
  ip_address: string
  device_name: string
  is_single_use: boolean
  type: string
  last_four: number
  brand: string
  exp_month: number
  exp_year: number
  is_default: boolean
  provider_id: string
  company_name: string
  billing_email: string
  path: string
  is_personal: boolean
  method: string[]
  status_code: number
  duration_ms: number
  memory_usage: number
  user_agent: string
  error_message: string
  attempts: number
  available_at: number
  reserved_at: Date | string
  provider_status: string
  unit_price: number
  provider_type: string
  provider_price_id: string
  quantity: number
  trial_ends_at: string
  ends_at: string
  key: number
  image: string
  message: string
  stack: string
  additional_info: string
}
