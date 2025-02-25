import type { Model } from '@stacksjs/types'
import { faker } from '@stacksjs/faker'
import { schema } from '@stacksjs/validation'

export default {
  name: 'LoyaltyReward',
  table: 'loyalty_rewards',
  primaryKey: 'id',
  autoIncrement: false, // Using UUID instead of auto-increment

  traits: {
    useUuid: true,
    useTimestamps: true,
    useSearch: {
      displayable: ['id', 'name', 'points_required', 'reward_type', 'is_active'],
      searchable: ['name', 'description', 'reward_type'],
      sortable: ['points_required', 'created_at', 'updated_at'],
      filterable: ['reward_type', 'is_active'],
    },

    useSeeder: {
      count: 15,
    },

    useApi: {
      uri: 'loyalty-rewards',
      routes: ['index', 'store', 'show'],
    },

    observe: true,
  },

  belongsTo: ['Product'],

  attributes: {
    name: {
      required: true,
      order: 1,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        const rewardTypes = ['DISCOUNT', 'FREE_ITEM', 'PRIORITY_SERVICE']
        const type = faker.helpers.arrayElement(rewardTypes)

        switch (type) {
          case 'DISCOUNT':
            const percentage = faker.number.int({ min: 5, max: 50 })
            return `${percentage}% discount on your order`
          case 'FREE_ITEM':
            return `Free ${faker.commerce.productName()}`
          case 'PRIORITY_SERVICE':
            return `Priority ${faker.helpers.arrayElement(['service', 'delivery', 'seating', 'checkout'])}`
          default:
            return `Loyalty reward`
        }
      },
    },

    description: {
      required: false,
      order: 2,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.lorem.paragraph(),
    },

    points_required: {
      required: true,
      order: 3,
      fillable: true,
      validation: {
        rule: schema.number().min(1),
      },
      factory: () => faker.number.int({ min: 100, max: 5000 }),
    },

    reward_type: {
      required: true,
      order: 4,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        const types = ['DISCOUNT', 'FREE_ITEM', 'PRIORITY_SERVICE']
        return faker.helpers.arrayElement(types)
      },
    },

    discount_percentage: {
      required: false,
      order: 5,
      fillable: true,
      validation: {
        rule: schema.number().min(0).max(100),
      },
      factory: () => {
        const type = faker.helpers.arrayElement(['DISCOUNT', 'FREE_ITEM', 'PRIORITY_SERVICE'])
        return type === 'DISCOUNT' ? faker.number.int({ min: 5, max: 50 }) : null
      },
    },

    free_product_id: {
      required: false,
      order: 6,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        const type = faker.helpers.arrayElement(['DISCOUNT', 'FREE_ITEM', 'PRIORITY_SERVICE'])
        return type === 'FREE_ITEM' ? faker.string.uuid() : null
      },
    },

    is_active: {
      required: false,
      order: 7,
      fillable: true,
      validation: {
        rule: schema.boolean(),
      },
      factory: () => faker.datatype.boolean({ probability: 0.9 }), // 90% active
    },

    expiry_days: {
      required: false,
      order: 8,
      fillable: true,
      validation: {
        rule: schema.number().min(0),
      },
      factory: () => faker.helpers.arrayElement([7, 14, 30, 60, 90]),
    },

    image_url: {
      required: false,
      order: 9,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.image.url(),
    },
  },

  dashboard: {
    highlight: true,
  },
} satisfies Model
