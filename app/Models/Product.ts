import type { Model } from '@stacksjs/types'
import { faker } from '@stacksjs/faker'
import { schema } from '@stacksjs/validation'

export default {
  name: 'Product',
  table: 'products',
  primaryKey: 'id',
  autoIncrement: false, // Using UUID instead of auto-increment

  traits: {
    useUuid: true,
    useTimestamps: true,
    useSearch: {
      displayable: ['id', 'name', 'description', 'price', 'category_id', 'is_available', 'inventory_count'],
      searchable: ['name', 'description', 'category_id'],
      sortable: ['price', 'created_at', 'updated_at', 'inventory_count', 'preparation_time'],
      filterable: ['category_id', 'is_available', 'allergens'],
    },

    useSeeder: {
      count: 10,
    },

    useApi: {
      uri: 'products',
      routes: ['index', 'store', 'show'],
    },

    observe: true,
  },

  belongsTo: ['ProductCategory'],

  attributes: {
    name: {
      required: true,
      order: 1,
      fillable: true,
      validation: {
        rule: schema.string().maxLength(100),
        message: {
          maxLength: 'Name must have a maximum of 100 characters',
        },
      },
      factory: () => faker.commerce.productName(),
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

    price: {
      required: true,
      order: 3,
      fillable: true,
      validation: {
        rule: schema.number().min(0.01),
        message: {
          min: 'Price must be at least 0.01',
        },
      },
      factory: () => Number.parseFloat(faker.commerce.price({ min: 0.01, max: 1000, dec: 2 })),
    },

    image_url: {
      required: false,
      order: 4,
      fillable: true,
      validation: {
        rule: schema.string(),
        message: {
          string: 'Image URL must be a string',
        },
      },
      factory: () => faker.image.url(),
    },

    is_available: {
      required: false,
      order: 5,
      fillable: true,
      validation: {
        rule: schema.boolean(),
      },
      factory: () => true,
    },

    inventory_count: {
      required: false,
      order: 6,
      fillable: true,
      validation: {
        rule: schema.number().min(0),
        message: {
          min: 'Inventory count must be at least 0',
        },
      },
      factory: () => faker.number.int({ min: 0, max: 100 }),
    },

    category_id: {
      required: true,
      order: 7,
      fillable: true,
      validation: {
        rule: schema.string().uuid(),
        message: {
          uuid: 'Category ID must be a valid UUID',
        },
      },
      factory: () => faker.string.uuid(),
    },

    preparation_time: {
      required: true,
      order: 8,
      fillable: true,
      validation: {
        rule: schema.number().min(1),
        message: {
          min: 'Preparation time must be at least 1 minute',
        },
      },
      factory: () => faker.number.int({ min: 1, max: 60 }),
    },

    allergens: {
      required: false,
      order: 9,
      fillable: true,
      validation: {
        rule: schema.string(), // Store as JSON string
      },
      factory: () => {
        const possibleAllergens = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish']
        const count = faker.number.int({ min: 0, max: 3 })
        return JSON.stringify(faker.helpers.arrayElements(possibleAllergens, count))
      },
    },

    nutritional_info: {
      required: false,
      order: 10,
      fillable: true,
      validation: {
        rule: schema.string(), // Store as JSON string
      },
      factory: () => {
        return JSON.stringify({
          calories: faker.number.int({ min: 50, max: 800 }),
          fat: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
          protein: faker.number.float({ min: 0, max: 30, precision: 0.1 }),
          carbs: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
        })
      },
    },
  },

  dashboard: {
    highlight: true,
  },
} satisfies Model
