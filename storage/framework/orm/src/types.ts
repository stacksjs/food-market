import type { PersonalAccessTokensTable } from '../src/models/AccessToken'
import type { CouponsTable } from '../src/models/Coupon'
import type { ErrorsTable } from '../src/models/Error'
import type { FailedJobsTable } from '../src/models/FailedJob'
import type { JobsTable } from '../src/models/Job'
import type { LoyaltyPointsTable } from '../src/models/LoyaltyPoint'
import type { LoyaltyRewardsTable } from '../src/models/LoyaltyReward'
import type { OrdersTable } from '../src/models/Order'
import type { PaymentMethodsTable } from '../src/models/PaymentMethod'
import type { PaymentProductsTable } from '../src/models/PaymentProduct'
import type { PaymentTransactionsTable } from '../src/models/PaymentTransaction'
import type { ProductsTable } from '../src/models/Product'
import type { ProductCategoriesTable } from '../src/models/ProductCategory'
import type { RequestsTable } from '../src/models/Request'
import type { SubscriptionsTable } from '../src/models/Subscription'
import type { TeamsTable } from '../src/models/Team'
import type { TransactionsTable } from '../src/models/Transaction'
import type { UsersTable } from '../src/models/User'

export interface TeamUsersTable {
  id?: number
  user_id: number
  team_id: number
}

export interface TeamUsersTable {
  id?: number
  team_id: number
  user_id: number
}

export interface MigrationsTable {
  name: string
  timestamp: string
}
export interface PasskeysTable {
  id?: number
  cred_public_key: string
  user_id: number
  webauthn_user_id: string
  counter: number
  credential_type: string
  device_type: string
  backup_eligible: boolean
  backup_status: boolean
  transports?: string
  created_at?: Date
  last_used_at: string
}

export interface Database {
  products: ProductsTable
  orders: OrdersTable
  coupons: CouponsTable
  transactions: TransactionsTable
  loyalty_points: LoyaltyPointsTable
  loyalty_rewards: LoyaltyRewardsTable
  product_categories: ProductCategoriesTable
  team_users: TeamUsersTable
  users: UsersTable
  failed_jobs: FailedJobsTable
  personal_access_tokens: PersonalAccessTokensTable
  payment_methods: PaymentMethodsTable
  payment_transactions: PaymentTransactionsTable
  teams: TeamsTable
  requests: RequestsTable
  jobs: JobsTable
  subscriptions: SubscriptionsTable
  payment_products: PaymentProductsTable
  errors: ErrorsTable
  passkeys: PasskeysTable
  migrations: MigrationsTable
}
