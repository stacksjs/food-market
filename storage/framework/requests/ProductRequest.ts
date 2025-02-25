import { Request } from '@stacksjs/router'
import { validateField, customValidate, type schema } from '@stacksjs/validation'
import type { ProductRequestType } from '../types/requests'

interface ValidationField {
      rule: ReturnType<typeof schema.string>
      message: Record<string, string>
    }

interface CustomAttributes {
      [key: string]: ValidationField
    }
interface RequestDataProduct {
       id: number
 name: string
      description: number
      key: number
      unit_price: number
      status: string
      image: string
      provider_id: string
      product_category_id: number
     created_at?: Date
      updated_at?: Date
    }
export class ProductRequest extends Request<RequestDataProduct> implements ProductRequestType {
      public id = 1
public name = ''
public description = 0
public key = 0
public unit_price = 0
public status = ''
public image = ''
public provider_id = ''
public product_category_id = 0
public created_at = new Date
        public updated_at = new Date
      public uuid = ''
      public async validate(attributes?: CustomAttributes): Promise<void> {
        if (attributes === undefined || attributes === null) {
          await validateField('Product', this.all())
        } else {
          await customValidate(attributes, this.all())
        }

      }
    }

    export const productRequest = new ProductRequest()
    s === undefined || attributes === null) {
          await validateField('Product', this.all())
        } else {
          await customValidate(attributes, this.all())
        }

      }
    }

    export const productRequest = new ProductRequest()
    