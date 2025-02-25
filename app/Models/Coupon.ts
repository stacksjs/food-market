import type { Model } from '@stacksjs/types'
import { faker } from '@stacksjs/faker'
import { schema } from '@stacksjs/validation'

export default {
  name: 'Coupon',
  table: 'coupons',
  primaryKey: 'id',
  autoIncrement: false, // Using UUID instead of auto-increment

  traits: {
    useUuid: true,
    useTimestamps: true,
    useSearch: {
      displayable: ['id', 'code', 'discount_type', 'discount_value', 'is_active', 'start_date', 'end_date'],
      searchable: ['code', 'description', 'discount_type'],
      sortable: ['created_at', 'start_date', 'end_date', 'discount_value', 'usage_count'],
      filterable: ['discount_type', 'is_active'],
    },

    useSeeder: {
      count: 15,
    },

    useApi: {
      uri: 'coupons',
      routes: ['index', 'store', 'show'],
    },

    observe: true,
  },

  belongsTo: ['Product'],
  hasMany: ['Order'],

  attributes: {
    code: {
      required: true,
      unique: true,
      order: 1,
      fillable: true,
      validation: {
        rule: schema.string().maxLength(50),
        message: {
          maxLength: 'Code must have a maximum of 50 characters',
        },
      },
      factory: () => faker.string.alphanumeric(8).toUpperCase(),
    },

    description: {
      required: false,
      order: 2,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => faker.commerce.productDescription(),
    },

    discount_type: {
      required: true,
      order: 3,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        const types = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_ITEM']
        return faker.helpers.arrayElement(types)
      },
    },

    discount_value: {
      required: true,
      order: 4,
      fillable: true,
      validation: {
        rule: schema.number().min(0.01),
      },
      factory: () => {
        const type = faker.helpers.arrayElement(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_ITEM'])

        if (type === 'PERCENTAGE') {
          return faker.number.float({ min: 5, max: 50, precision: 0.01 })
        }
        else {
          return Number.parseFloat(faker.commerce.price({ min: 1, max: 100, dec: 2 }))
        }
      },
    },

    min_order_amount: {
      required: false,
      order: 5,
      fillable: true,
      validation: {
        rule: schema.number().min(0),
      },
      factory: () => Number.parseFloat(faker.commerce.price({ min: 0, max: 50, dec: 2 })),
    },

    max_discount_amount: {
      required: false,
      order: 6,
      fillable: true,
      validation: {
        rule: schema.number().min(0),
      },
      factory: () => faker.helpers.maybe(() => Number.parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })), { probability: 0.7 }),
    },

    free_product_id: {
      required: false,
      order: 7,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        // Only provide a product ID if the discount type is FREE_ITEM
        const type = faker.helpers.arrayElement(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_ITEM'])
        return type === 'FREE_ITEM' ? faker.string.uuid() : null
      },
    },

    is_active: {
      required: false,
      order: 8,
      fillable: true,
      validation: {
        rule: schema.boolean(),
      },
      factory: () => faker.datatype.boolean({ probability: 0.8 }),
    },

    usage_limit: {
      required: false,
      order: 9,
      fillable: true,
      validation: {
        rule: schema.number().min(1),
      },
      factory: () => faker.helpers.maybe(() => faker.number.int({ min: 1, max: 100 }), { probability: 0.6 }),
    },

    usage_count: {
      required: false,
      order: 10,
      fillable: true,
      validation: {
        rule: schema.number().min(0),
      },
      factory: () => faker.number.int({ min: 0, max: 50 }),
    },

    start_date: {
      required: true,
      order: 11,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        const startDate = faker.date.recent()
        return startDate.toISOString()
      },
    },

    end_date: {
      required: true,
      order: 12,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        const future = faker.date.future()
        return future.toISOString()
      },
    },

    applicable_products: {
      required: false,
      order: 13,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        // 70% chance of being applicable to all products (empty array)
        if (faker.datatype.boolean({ probability: 0.7 })) {
          return JSON.stringify([])
        }

        // Otherwise, generate 1-5 random product IDs
        const count = faker.number.int({ min: 1, max: 5 })
        const productIds = Array.from({ length: count }, () => faker.string.uuid())
        return JSON.stringify(productIds)
      },
    },

    applicable_categories: {
      required: false,
      order: 14,
      fillable: true,
      validation: {
        rule: schema.string(),
      },
      factory: () => {
        // 70% chance of being applicable to all categories (empty array)
        if (faker.datatype.boolean({ probability: 0.7 })) {
          return JSON.stringify([])
        }

        // Otherwise, generate 1-3 random category IDs
        const count = faker.number.int({ min: 1, max: 3 })
        const categoryIds = Array.from({ length: count }, () => faker.string.uuid())
        return JSON.stringify(categoryIds)
      },
    },
  },

  dashboard: {
    highlight: true,
  },
} satisfies Model
