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
  code: string
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
  expiry_date: string
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
  key: number
  unit_price: number
  image: string
  provider_id: string
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
  provider_type: string
  provider_price_id: string
  quantity: number
  trial_ends_at: string
  ends_at: string
  message: string
  stack: string
  additional_info: string
}
