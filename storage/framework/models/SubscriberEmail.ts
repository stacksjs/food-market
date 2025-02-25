import type { Model } from '@stacksjs/types'
// soon, these will be auto-imported
import { faker } from '@stacksjs/faker'
import { schema } from '@stacksjs/validation'

export default {
  name: 'SubscriberEmail', // defaults to the sanitized file name
  table: 'subscriber_emails', // defaults to the lowercase, plural name of the model name (or the name of the model file)
  primaryKey: 'id', // defaults to `id`
  autoIncrement: true, // defaults to true

  traits: {
    useAuth: true, // defaults to false, `authenticatable` used as an alias
    useTimestamps: true, // defaults to true, `timestampable` used as an alias
    useSoftDeletes: true, // defaults to false, `softDeletable` used as an alias

    useSeeder: {
      // defaults to a count of 10, `seedable` used as an alias
      count: 100,
    },
    // useUuid: true, // defaults to false
  },

  attributes: {
    email: {
      unique: true,
      fillable: true,
      validation: {
        rule: schema.string().email(),
        message: {
          email: 'Email address must be of valid format',
          required: 'Email is required',
        },
      },

      factory: () => faker.internet.email(),
    },
  },
} satisfies Model
