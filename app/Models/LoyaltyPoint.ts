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
      factory: () => {
        const sources = ['ORDER', 'PROMOTION', 'REFERRAL', 'MANUAL']
        return faker.helpers.arrayElement(sources)
      },
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
      factory: () => {
        const source = faker.helpers.arrayElement(['ORDER', 'PROMOTION', 'REFERRAL', 'MANUAL'])

        switch (source) {
          case 'ORDER':
            return `Points earned from order #${faker.string.alphanumeric(8).toUpperCase()}`
          case 'PROMOTION':
            return `Bonus points from ${faker.company.buzzPhrase()} promotion`
          case 'REFERRAL':
            return `Referral bonus for inviting ${faker.person.fullName()}`
          case 'MANUAL':
            return `Manual adjustment by ${faker.person.fullName()}`
          default:
            return `Loyalty points entry`
        }
      },
    },

    expiry_date: {
      required: false,
      order: 6,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        // 70% chance of having an expiry date
        if (faker.datatype.boolean({ probability: 0.7 })) {
          // Set expiry date between 3 months and 1 year from now
          const future = faker.date.future({ years: 1, refDate: new Date(Date.now() + 7776000000) })
          return future.toISOString()
        }
        return null
      },
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
