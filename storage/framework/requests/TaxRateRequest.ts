import type { schema } from '@stacksjs/validation'
import type { TaxRateRequestType } from '../types/requests'
import { Request } from '@stacksjs/router'
import { customValidate, validateField } from '@stacksjs/validation'

interface ValidationField {
  rule: ReturnType<typeof schema.string>
  message: Record<string, string>
}

interface CustomAttributes {
  [key: string]: ValidationField
}
interface RequestDataTaxRate {
  id: number
  name: string
  rate: number
  type: string
  country: string
  region: string[]
  status: string[]
  is_default: boolean
  created_at?: Date
  updated_at?: Date
}
export class TaxRateRequest extends Request<RequestDataTaxRate> implements TaxRateRequestType {
  public id = 1
  public name = ''
  public rate = 0
  public type = ''
  public country = ''
  public region = []
  public status = []
  public is_default = false
  public created_at = new Date()
  public updated_at = new Date()
  public uuid = ''
  public async validate(attributes?: CustomAttributes): Promise<void> {
    if (attributes === undefined || attributes === null) {
      await validateField('TaxRate', this.all())
    }
    else {
      await customValidate(attributes, this.all())
    }
  }
}

export const taxRateRequest = new TaxRateRequest()
