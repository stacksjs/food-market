import type { DigitalDeliveryRequestType } from '@stacksjs/orm'
import { Action } from '@stacksjs/actions'

import { response } from '@stacksjs/router'

export default new Action({
  name: 'DigitalDelivery Update',
  description: 'DigitalDelivery Update ORM Action',
  method: 'PATCH',
  async handle(request: DigitalDeliveryRequestType) {
    await request.validate()

    const id = request.getParam('id')
    const model = await DigitalDelivery.findOrFail(Number(id))

    const result = model.update(request.all())

    return response.json(result)
  },
})
