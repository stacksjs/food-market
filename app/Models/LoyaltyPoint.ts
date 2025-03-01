import type { Model } from '@stacksjs/types'
import { faker } from '@stacksjs/faker'
import { schema } from '@stacksjs/validation'

export default {
  name: 'LoyaltyPoint',
  table: 'loyalty_points',
  primaryKey: 'id',
  autoIncrement: false, // Using UUID instead of auto-increment

  traits: {
    useUuid: true,
    useTimestamps: true,
    useSearch: {
      displayable: ['id', 'wallet_id', 'points', 'source', 'description', 'expiry_date', 'is_used'],
      searchable: ['description', 'source', 'source_reference_id'],
      sortable: ['created_at', 'points', 'expiry_date'],
      filterable: ['wallet_id', 'source', 'is_used'],
    },

    useSeeder: {
      count: 50,
    },

    useApi: {
      uri: 'loyalty-points',
      routes: ['index', 'store', 'show'],
    },

    observe: true,
  },

  attributes: {
    wallet_id: {
      required: true,
      order: 1,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.string.uuid(),
    },

    points: {
      required: true,
      order: 2,
      fillable: true,
      validation: {
        rule: schema.number().min(1),
      },
      factory: () => faker.number.int({ min: 1, max: 500 }),
    },

    source: {
      required: true,
      order: 3,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.helpers.arrayElement(['ORDER', 'PROMOTION', 'REFERRAL', 'MANUAL']),
    },

    source_reference_id: {
      required: false,
      order: 4,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.string.uuid(),
    },

    description: {
      required: false,
      order: 5,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.helpers.arrayElement([
        `Points earned from order #${faker.string.alphanumeric(8).toUpperCase()}`,
        `Bonus points from promotion`,
        `Referral bonus for inviting a friend`,
        `Manual adjustment by administrator`,
      ]),
    },

    expiry_date: {
      required: false,
      order: 6,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.helpers.maybe(() => faker.date.future().toISOString(), { probability: 0.7 }),
    },

    is_used: {
      required: false,
      order: 7,
      fillable: true,
      validation: {
        rule: schema.boolean(),
      },
      factory: () => faker.datatype.boolean({ probability: 0.3 }), // 30% chance of being used
    },
  },

  dashboard: {
    highlight: true,
  },
} satisfies Model
