import type { CustomerRequestType } from '@stacksjs/orm'
import type {
  CustomerType,
  CustomerUpdate,
} from '../../types'
import { db } from '@stacksjs/database'

/**
 * Update a customer by ID
 *
 * @param id The ID of the customer to update
 * @param request The updated customer data
 * @returns The updated customer record
 */
export async function update(id: number, request: CustomerRequestType): Promise<CustomerType | undefined> {
  try {
    // Create the update data object by picking only defined properties from the request
    const updateData: CustomerUpdate = Object.entries(request)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value
        return obj
      }, {} as CustomerUpdate)

    // Skip update if no fields are provided
    if (Object.keys(updateData).length === 0) {
      // Just return the current customer
      return await db
        .selectFrom('customers')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst()
    }

    // Include updated_at timestamp
    updateData.updated_at = new Date()

    // Update the customer record
    await db
      .updateTable('customers')
      .set(updateData)
      .where('id', '=', id)
      .execute()

    // Retrieve the updated customer
    const updatedCustomer = await db
      .selectFrom('customers')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()

    return updatedCustomer
  }
  catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      // Check for unique constraint violation on email
      if (error.message.includes('Duplicate entry') && error.message.includes('email')) {
        throw new Error('A customer with this email already exists')
      }

      // Re-throw the error with a more user-friendly message
      throw new Error(`Failed to update customer: ${error.message}`)
    }

    throw error
  }
}
