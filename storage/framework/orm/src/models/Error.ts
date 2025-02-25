import type { Insertable, RawBuilder, Selectable, Updateable } from '@stacksjs/database'
import type { Operator } from '@stacksjs/orm'
import { cache } from '@stacksjs/cache'
import { sql } from '@stacksjs/database'
import { HttpError, ModelNotFoundException } from '@stacksjs/error-handling'
import { DB, SubqueryBuilder } from '@stacksjs/orm'

export interface ErrorsTable {
  id?: number
  type?: string
  message?: string
  stack?: string
  status?: number
  additional_info?: string

  created_at?: Date

  updated_at?: Date

}

interface ErrorResponse {
  data: ErrorJsonResponse[]
  paging: {
    total_records: number
    page: number
    total_pages: number
  }
  next_cursor: number | null
}

export interface ErrorJsonResponse extends Omit<ErrorsTable, 'password'> {
  [key: string]: any
}

export type ErrorType = Selectable<ErrorsTable>
export type NewError = Partial<Insertable<ErrorsTable>>
export type ErrorUpdate = Updateable<ErrorsTable>

      type SortDirection = 'asc' | 'desc'
interface SortOptions { column: ErrorType, order: SortDirection }
// Define a type for the options parameter
interface QueryOptions {
  sort?: SortOptions
  limit?: number
  offset?: number
  page?: number
}

export class ErrorModel {
  private readonly hidden: Array<keyof ErrorJsonResponse> = []
  private readonly fillable: Array<keyof ErrorJsonResponse> = ['type', 'message', 'stack', 'status', 'additional_info', 'uuid']
  private readonly guarded: Array<keyof ErrorJsonResponse> = []
  protected attributes: Partial<ErrorJsonResponse> = {}
  protected originalAttributes: Partial<ErrorJsonResponse> = {}

  protected selectFromQuery: any
  protected withRelations: string[]
  protected updateFromQuery: any
  protected deleteFromQuery: any
  protected hasSelect: boolean
  private hasSaved: boolean
  private customColumns: Record<string, unknown> = {}

  constructor(error: Partial<ErrorType> | null) {
    if (error) {
      this.attributes = { ...error }
      this.originalAttributes = { ...error }

      Object.keys(error).forEach((key) => {
        if (!(key in this)) {
          this.customColumns[key] = (error as ErrorJsonResponse)[key]
        }
      })
    }

    this.withRelations = []
    this.selectFromQuery = DB.instance.selectFrom('errors')
    this.updateFromQuery = DB.instance.updateTable('errors')
    this.deleteFromQuery = DB.instance.deleteFrom('errors')
    this.hasSelect = false
    this.hasSaved = false
  }

  mapCustomGetters(models: ErrorJsonResponse | ErrorJsonResponse[]): void {
    const data = models

    if (Array.isArray(data)) {
      data.map((model: ErrorJsonResponse) => {
        const customGetter = {
          default: () => {
          },

        }

        for (const [key, fn] of Object.entries(customGetter)) {
          model[key] = fn()
        }

        return model
      })
    }
    else {
      const model = data

      const customGetter = {
        default: () => {
        },

      }

      for (const [key, fn] of Object.entries(customGetter)) {
        model[key] = fn()
      }
    }
  }

  async mapCustomSetters(model: ErrorJsonResponse): Promise<void> {
    const customSetter = {
      default: () => {
      },

    }

    for (const [key, fn] of Object.entries(customSetter)) {
      model[key] = await fn()
    }
  }

  get id(): number | undefined {
    return this.attributes.id
  }

  get type(): string | undefined {
    return this.attributes.type
  }

  get message(): string | undefined {
    return this.attributes.message
  }

  get stack(): string | undefined {
    return this.attributes.stack
  }

  get status(): number | undefined {
    return this.attributes.status
  }

  get additional_info(): string | undefined {
    return this.attributes.additional_info
  }

  get created_at(): Date | undefined {
    return this.attributes.created_at
  }

  get updated_at(): Date | undefined {
    return this.attributes.updated_at
  }

  set type(value: string) {
    this.attributes.type = value
  }

  set message(value: string) {
    this.attributes.message = value
  }

  set stack(value: string) {
    this.attributes.stack = value
  }

  set status(value: number) {
    this.attributes.status = value
  }

  set additional_info(value: string) {
    this.attributes.additional_info = value
  }

  set updated_at(value: Date) {
    this.attributes.updated_at = value
  }

  getOriginal(column?: keyof ErrorJsonResponse): Partial<ErrorJsonResponse> {
    if (column) {
      return this.originalAttributes[column]
    }

    return this.originalAttributes
  }

  getChanges(): Partial<ErrorJsonResponse> {
    return this.fillable.reduce<Partial<ErrorJsonResponse>>((changes, key) => {
      const currentValue = this.attributes[key as keyof ErrorsTable]
      const originalValue = this.originalAttributes[key as keyof ErrorsTable]

      if (currentValue !== originalValue) {
        changes[key] = currentValue
      }

      return changes
    }, {})
  }

  isDirty(column?: keyof ErrorType): boolean {
    if (column) {
      return this.attributes[column] !== this.originalAttributes[column]
    }

    return Object.entries(this.originalAttributes).some(([key, originalValue]) => {
      const currentValue = (this.attributes as any)[key]

      return currentValue !== originalValue
    })
  }

  isClean(column?: keyof ErrorType): boolean {
    return !this.isDirty(column)
  }

  wasChanged(column?: keyof ErrorType): boolean {
    return this.hasSaved && this.isDirty(column)
  }

  select(params: (keyof ErrorType)[] | RawBuilder<string> | string): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.select(params)

    this.hasSelect = true

    return this
  }

  static select(params: (keyof ErrorType)[] | RawBuilder<string> | string): ErrorModel {
    const instance = new ErrorModel(null)

    // Initialize a query with the table name and selected fields
    instance.selectFromQuery = instance.selectFromQuery.select(params)

    instance.hasSelect = true

    return instance
  }

  async applyFind(id: number): Promise<ErrorModel | undefined> {
    const model = await DB.instance.selectFrom('errors').where('id', '=', id).selectAll().executeTakeFirst()

    if (!model)
      return undefined

    this.mapCustomGetters(model)
    await this.loadRelations(model)

    const data = new ErrorModel(model as ErrorType)

    cache.getOrSet(`error:${id}`, JSON.stringify(model))

    return data
  }

  async find(id: number): Promise<ErrorModel | undefined> {
    return await this.applyFind(id)
  }

  // Method to find a Error by ID
  static async find(id: number): Promise<ErrorModel | undefined> {
    const instance = new ErrorModel(null)

    return await instance.applyFind(id)
  }

  async first(): Promise<ErrorModel | undefined> {
    let model: ErrorModel | undefined

    if (this.hasSelect) {
      model = await this.selectFromQuery.executeTakeFirst()
    }
    else {
      model = await this.selectFromQuery.selectAll().executeTakeFirst()
    }

    if (model) {
      this.mapCustomGetters(model)
      await this.loadRelations(model)
    }

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  static async first(): Promise<ErrorModel | undefined> {
    const instance = new ErrorModel(null)

    const model = await DB.instance.selectFrom('errors')
      .selectAll()
      .executeTakeFirst()

    instance.mapCustomGetters(model)

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  async applyFirstOrFail(): Promise<ErrorModel | undefined> {
    const model = await this.selectFromQuery.executeTakeFirst()

    if (model === undefined)
      throw new ModelNotFoundException(404, 'No ErrorModel results found for query')

    if (model) {
      this.mapCustomGetters(model)
      await this.loadRelations(model)
    }

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  async firstOrFail(): Promise<ErrorModel | undefined> {
    return await this.applyFirstOrFail()
  }

  static async firstOrFail(): Promise<ErrorModel | undefined> {
    const instance = new ErrorModel(null)

    return await instance.applyFirstOrFail()
  }

  static async all(): Promise<ErrorModel[]> {
    const instance = new ErrorModel(null)

    const models = await DB.instance.selectFrom('errors').selectAll().execute()

    instance.mapCustomGetters(models)

    const data = await Promise.all(models.map(async (model: ErrorType) => {
      return new ErrorModel(model)
    }))

    return data
  }

  async applyFindOrFail(id: number): Promise<ErrorModel> {
    const model = await DB.instance.selectFrom('errors').where('id', '=', id).selectAll().executeTakeFirst()

    if (model === undefined)
      throw new ModelNotFoundException(404, `No ErrorModel results for ${id}`)

    cache.getOrSet(`error:${id}`, JSON.stringify(model))

    this.mapCustomGetters(model)
    await this.loadRelations(model)

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  async findOrFail(id: number): Promise<ErrorModel> {
    return await this.applyFindOrFail(id)
  }

  static async findOrFail(id: number): Promise<ErrorModel> {
    const instance = new ErrorModel(null)

    return await instance.applyFindOrFail(id)
  }

  async applyFindMany(ids: number[]): Promise<ErrorModel[]> {
    let query = DB.instance.selectFrom('errors').where('id', 'in', ids)

    const instance = new ErrorModel(null)

    query = query.selectAll()

    const models = await query.execute()

    instance.mapCustomGetters(models)
    await instance.loadRelations(models)

    return models.map((modelItem: ErrorModel) => instance.parseResult(new ErrorModel(modelItem)))
  }

  static async findMany(ids: number[]): Promise<ErrorModel[]> {
    const instance = new ErrorModel(null)

    return await instance.applyFindMany(ids)
  }

  async findMany(ids: number[]): Promise<ErrorModel[]> {
    return await this.applyFindMany(ids)
  }

  skip(count: number): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.offset(count)

    return this
  }

  static skip(count: number): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.offset(count)

    return instance
  }

  async applyChunk(size: number, callback: (models: ErrorModel[]) => Promise<void>): Promise<void> {
    let page = 1
    let hasMore = true

    while (hasMore) {
      // Get one batch
      const models = await this.selectFromQuery
        .selectAll()
        .limit(size)
        .offset((page - 1) * size)
        .execute()

      // If we got fewer results than chunk size, this is the last batch
      if (models.length < size) {
        hasMore = false
      }

      // Process this batch
      if (models.length > 0) {
        await callback(models)
      }

      page++
    }
  }

  async chunk(size: number, callback: (models: ErrorModel[]) => Promise<void>): Promise<void> {
    await this.applyChunk(size, callback)
  }

  static async chunk(size: number, callback: (models: ErrorModel[]) => Promise<void>): Promise<void> {
    const instance = new ErrorModel(null)

    await instance.applyChunk(size, callback)
  }

  take(count: number): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.limit(count)

    return this
  }

  static take(count: number): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.limit(count)

    return instance
  }

  static async pluck<K extends keyof ErrorModel>(field: K): Promise<ErrorModel[K][]> {
    const instance = new ErrorModel(null)

    if (instance.hasSelect) {
      const model = await instance.selectFromQuery.execute()
      return model.map((modelItem: ErrorModel) => modelItem[field])
    }

    const model = await instance.selectFromQuery.selectAll().execute()

    return model.map((modelItem: ErrorModel) => modelItem[field])
  }

  async pluck<K extends keyof ErrorModel>(field: K): Promise<ErrorModel[K][]> {
    return ErrorModel.pluck(field)
  }

  static async count(): Promise<number> {
    const instance = new ErrorModel(null)

    const result = await instance.selectFromQuery
      .select(sql`COUNT(*) as count`)
      .executeTakeFirst()

    return result.count || 0
  }

  async count(): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`COUNT(*) as count`)
      .executeTakeFirst()

    return result.count || 0
  }

  static async max(field: keyof ErrorModel): Promise<number> {
    const instance = new ErrorModel(null)

    const result = await instance.selectFromQuery
      .select(sql`MAX(${sql.raw(field as string)}) as max `)
      .executeTakeFirst()

    return result.max
  }

  async max(field: keyof ErrorModel): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`MAX(${sql.raw(field as string)}) as max`)
      .executeTakeFirst()

    return result.max
  }

  static async min(field: keyof ErrorModel): Promise<number> {
    const instance = new ErrorModel(null)

    const result = await instance.selectFromQuery
      .select(sql`MIN(${sql.raw(field as string)}) as min `)
      .executeTakeFirst()

    return result.min
  }

  async min(field: keyof ErrorModel): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`MIN(${sql.raw(field as string)}) as min `)
      .executeTakeFirst()

    return result.min
  }

  static async avg(field: keyof ErrorModel): Promise<number> {
    const instance = new ErrorModel(null)

    const result = await instance.selectFromQuery
      .select(sql`AVG(${sql.raw(field as string)}) as avg `)
      .executeTakeFirst()

    return result.avg
  }

  async avg(field: keyof ErrorModel): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`AVG(${sql.raw(field as string)}) as avg `)
      .executeTakeFirst()

    return result.avg
  }

  static async sum(field: keyof ErrorModel): Promise<number> {
    const instance = new ErrorModel(null)

    const result = await instance.selectFromQuery
      .select(sql`SUM(${sql.raw(field as string)}) as sum `)
      .executeTakeFirst()

    return result.sum
  }

  async sum(field: keyof ErrorModel): Promise<number> {
    const result = this.selectFromQuery
      .select(sql`SUM(${sql.raw(field as string)}) as sum `)
      .executeTakeFirst()

    return result.sum
  }

  async applyGet(): Promise<ErrorModel[]> {
    let models

    if (this.hasSelect) {
      models = await this.selectFromQuery.execute()
    }
    else {
      models = await this.selectFromQuery.selectAll().execute()
    }

    this.mapCustomGetters(models)
    await this.loadRelations(models)

    const data = await Promise.all(models.map(async (model: ErrorModel) => {
      return new ErrorModel(model)
    }))

    return data
  }

  async get(): Promise<ErrorModel[]> {
    return await this.applyGet()
  }

  static async get(): Promise<ErrorModel[]> {
    const instance = new ErrorModel(null)

    return await instance.applyGet()
  }

  has(relation: string): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where(({ exists, selectFrom }: any) =>
      exists(
        selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.error_id`, '=', 'errors.id'),
      ),
    )

    return this
  }

  static has(relation: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where(({ exists, selectFrom }: any) =>
      exists(
        selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.error_id`, '=', 'errors.id'),
      ),
    )

    return instance
  }

  static whereExists(callback: (qb: any) => any): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where(({ exists, selectFrom }: any) =>
      exists(callback({ exists, selectFrom })),
    )

    return instance
  }

  applyWhereHas(
    relation: string,
    callback: (query: SubqueryBuilder<keyof ErrorModel>) => void,
  ): ErrorModel {
    const subqueryBuilder = new SubqueryBuilder()

    callback(subqueryBuilder)
    const conditions = subqueryBuilder.getConditions()

    this.selectFromQuery = this.selectFromQuery
      .where(({ exists, selectFrom }: any) => {
        let subquery = selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.error_id`, '=', 'errors.id')

        conditions.forEach((condition) => {
          switch (condition.method) {
            case 'where':
              if (condition.type === 'and') {
                subquery = subquery.where(condition.column, condition.operator!, condition.value)
              }
              else {
                subquery = subquery.orWhere(condition.column, condition.operator!, condition.value)
              }
              break

            case 'whereIn':
              if (condition.operator === 'is not') {
                subquery = subquery.whereNotIn(condition.column, condition.values)
              }
              else {
                subquery = subquery.whereIn(condition.column, condition.values)
              }

              break

            case 'whereNull':
              subquery = subquery.whereNull(condition.column)
              break

            case 'whereNotNull':
              subquery = subquery.whereNotNull(condition.column)
              break

            case 'whereBetween':
              subquery = subquery.whereBetween(condition.column, condition.values)
              break

            case 'whereExists': {
              const nestedBuilder = new SubqueryBuilder()
              condition.callback!(nestedBuilder)
              break
            }
          }
        })

        return exists(subquery)
      })

    return this
  }

  whereHas(
    relation: string,
    callback: (query: SubqueryBuilder<keyof ErrorModel>) => void,
  ): ErrorModel {
    return this.applyWhereHas(relation, callback)
  }

  static whereHas(
    relation: string,
    callback: (query: SubqueryBuilder<keyof ErrorModel>) => void,
  ): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereHas(relation, callback)
  }

  applyDoesntHave(relation: string): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where(({ not, exists, selectFrom }: any) =>
      not(
        exists(
          selectFrom(relation)
            .select('1')
            .whereRef(`${relation}.error_id`, '=', 'errors.id'),
        ),
      ),
    )

    return this
  }

  doesntHave(relation: string): ErrorModel {
    return this.applyDoesntHave(relation)
  }

  static doesntHave(relation: string): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyDoesntHave(relation)
  }

  applyWhereDoesntHave(relation: string, callback: (query: SubqueryBuilder<ErrorsTable>) => void): ErrorModel {
    const subqueryBuilder = new SubqueryBuilder()

    callback(subqueryBuilder)
    const conditions = subqueryBuilder.getConditions()

    this.selectFromQuery = this.selectFromQuery
      .where(({ exists, selectFrom, not }: any) => {
        const subquery = selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.error_id`, '=', 'errors.id')

        return not(exists(subquery))
      })

    conditions.forEach((condition) => {
      switch (condition.method) {
        case 'where':
          if (condition.type === 'and') {
            this.where(condition.column, condition.operator!, condition.value)
          }
          break

        case 'whereIn':
          if (condition.operator === 'is not') {
            this.whereNotIn(condition.column, condition.values)
          }
          else {
            this.whereIn(condition.column, condition.values)
          }

          break

        case 'whereNull':
          this.whereNull(condition.column)
          break

        case 'whereNotNull':
          this.whereNotNull(condition.column)
          break

        case 'whereBetween':
          this.whereBetween(condition.column, condition.values)
          break

        case 'whereExists': {
          const nestedBuilder = new SubqueryBuilder()
          condition.callback!(nestedBuilder)
          break
        }
      }
    })

    return this
  }

  whereDoesntHave(relation: string, callback: (query: SubqueryBuilder<ErrorsTable>) => void): ErrorModel {
    return this.applyWhereDoesntHave(relation, callback)
  }

  static whereDoesntHave(
    relation: string,
    callback: (query: SubqueryBuilder<ErrorsTable>) => void,
  ): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereDoesntHave(relation, callback)
  }

  async applyPaginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ErrorResponse> {
    const totalRecordsResult = await DB.instance.selectFrom('errors')
      .select(DB.instance.fn.count('id').as('total')) // Use 'id' or another actual column name
      .executeTakeFirst()

    const totalRecords = Number(totalRecordsResult?.total) || 0
    const totalPages = Math.ceil(totalRecords / (options.limit ?? 10))

    const errorsWithExtra = await DB.instance.selectFrom('errors')
      .selectAll()
      .orderBy('id', 'asc') // Assuming 'id' is used for cursor-based pagination
      .limit((options.limit ?? 10) + 1) // Fetch one extra record
      .offset(((options.page ?? 1) - 1) * (options.limit ?? 10)) // Ensure options.page is not undefined
      .execute()

    let nextCursor = null
    if (errorsWithExtra.length > (options.limit ?? 10))
      nextCursor = errorsWithExtra.pop()?.id ?? null

    return {
      data: errorsWithExtra,
      paging: {
        total_records: totalRecords,
        page: options.page || 1,
        total_pages: totalPages,
      },
      next_cursor: nextCursor,
    }
  }

  async paginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ErrorResponse> {
    return await this.applyPaginate(options)
  }

  // Method to get all errors
  static async paginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ErrorResponse> {
    const instance = new ErrorModel(null)

    return await instance.applyPaginate(options)
  }

  async applyCreate(newError: NewError): Promise<ErrorModel> {
    const filteredValues = Object.fromEntries(
      Object.entries(newError).filter(([key]) =>
        !this.guarded.includes(key) && this.fillable.includes(key),
      ),
    ) as NewError

    await this.mapCustomSetters(filteredValues)

    const result = await DB.instance.insertInto('errors')
      .values(filteredValues)
      .executeTakeFirst()

    const model = await this.find(Number(result.numInsertedOrUpdatedRows)) as ErrorModel

    return model
  }

  async create(newError: NewError): Promise<ErrorModel> {
    return await this.applyCreate(newError)
  }

  static async create(newError: NewError): Promise<ErrorModel> {
    const instance = new ErrorModel(null)

    return await instance.applyCreate(newError)
  }

  static async createMany(newError: NewError[]): Promise<void> {
    const instance = new ErrorModel(null)

    const valuesFiltered = newError.map((newError: NewError) => {
      const filteredValues = Object.fromEntries(
        Object.entries(newError).filter(([key]) =>
          !instance.guarded.includes(key) && instance.fillable.includes(key),
        ),
      ) as NewError

      return filteredValues
    })

    await DB.instance.insertInto('errors')
      .values(valuesFiltered)
      .executeTakeFirst()
  }

  static async forceCreate(newError: NewError): Promise<ErrorModel> {
    const result = await DB.instance.insertInto('errors')
      .values(newError)
      .executeTakeFirst()

    const model = await find(Number(result.numInsertedOrUpdatedRows)) as ErrorModel

    return model
  }

  // Method to remove a Error
  static async remove(id: number): Promise<any> {
    return await DB.instance.deleteFrom('errors')
      .where('id', '=', id)
      .execute()
  }

  applyWhere<V>(column: keyof UsersTable, ...args: [V] | [Operator, V]): UserModel {
    if (args.length === 1) {
      const [value] = args
      this.selectFromQuery = this.selectFromQuery.where(column, '=', value)
      this.updateFromQuery = this.updateFromQuery.where(column, '=', value)
      this.deleteFromQuery = this.deleteFromQuery.where(column, '=', value)
    }
    else {
      const [operator, value] = args as [Operator, V]
      this.selectFromQuery = this.selectFromQuery.where(column, operator, value)
      this.updateFromQuery = this.updateFromQuery.where(column, operator, value)
      this.deleteFromQuery = this.deleteFromQuery.where(column, operator, value)
    }

    return this
  }

  where<V = string>(column: keyof ErrorsTable, ...args: [V] | [Operator, V]): ErrorModel {
    return this.applyWhere<V>(column, ...args)
  }

  static where<V = string>(column: keyof ErrorsTable, ...args: [V] | [Operator, V]): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhere<V>(column, ...args)
  }

  whereColumn(first: keyof ErrorsTable, operator: Operator, second: keyof ErrorsTable): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.whereRef(first, operator, second)

    return this
  }

  static whereColumn(first: keyof ErrorsTable, operator: Operator, second: keyof ErrorsTable): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.whereRef(first, operator, second)

    return instance
  }

  applyWhereRef(column: keyof ErrorsTable, ...args: string[]): ErrorModel {
    const [operatorOrValue, value] = args
    const operator = value === undefined ? '=' : operatorOrValue
    const actualValue = value === undefined ? operatorOrValue : value

    const instance = new ErrorModel(null)
    instance.selectFromQuery = instance.selectFromQuery.whereRef(column, operator, actualValue)

    return instance
  }

  whereRef(column: keyof ErrorsTable, ...args: string[]): ErrorModel {
    return this.applyWhereRef(column, ...args)
  }

  static whereRef(column: keyof ErrorsTable, ...args: string[]): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereRef(column, ...args)
  }

  whereRaw(sqlStatement: string): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where(sql`${sqlStatement}`)

    return this
  }

  static whereRaw(sqlStatement: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where(sql`${sqlStatement}`)

    return instance
  }

  applyOrWhere(...conditions: [string, any][]): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where((eb: any) => {
      return eb.or(
        conditions.map(([column, value]) => eb(column, '=', value)),
      )
    })

    this.updateFromQuery = this.updateFromQuery.where((eb: any) => {
      return eb.or(
        conditions.map(([column, value]) => eb(column, '=', value)),
      )
    })

    this.deleteFromQuery = this.deleteFromQuery.where((eb: any) => {
      return eb.or(
        conditions.map(([column, value]) => eb(column, '=', value)),
      )
    })

    return this
  }

  orWhere(...conditions: [string, any][]): ErrorModel {
    return this.applyOrWhere(...conditions)
  }

  static orWhere(...conditions: [string, any][]): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyOrWhere(...conditions)
  }

  when(
    condition: boolean,
    callback: (query: ErrorModel) => ErrorModel,
  ): ErrorModel {
    return ErrorModel.when(condition, callback)
  }

  static when(
    condition: boolean,
    callback: (query: ErrorModel) => ErrorModel,
  ): ErrorModel {
    let instance = new ErrorModel(null)

    if (condition)
      instance = callback(instance)

    return instance
  }

  whereNotNull(column: keyof ErrorsTable): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is not', null),
    )

    this.updateFromQuery = this.updateFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is not', null),
    )

    this.deleteFromQuery = this.deleteFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is not', null),
    )

    return this
  }

  static whereNotNull(column: keyof ErrorsTable): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is not', null),
    )

    instance.updateFromQuery = instance.updateFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is not', null),
    )

    instance.deleteFromQuery = instance.deleteFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is not', null),
    )

    return instance
  }

  whereNull(column: keyof ErrorsTable): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is', null),
    )

    this.updateFromQuery = this.updateFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is', null),
    )

    this.deleteFromQuery = this.deleteFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is', null),
    )

    return this
  }

  static whereNull(column: keyof ErrorsTable): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is', null),
    )

    instance.updateFromQuery = instance.updateFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is', null),
    )

    instance.deleteFromQuery = instance.deleteFromQuery.where((eb: any) =>
      eb(column, '=', '').or(column, 'is', null),
    )

    return instance
  }

  static whereType(value: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('type', '=', value)

    return instance
  }

  static whereMessage(value: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('message', '=', value)

    return instance
  }

  static whereStack(value: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('stack', '=', value)

    return instance
  }

  static whereStatus(value: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('status', '=', value)

    return instance
  }

  static whereAdditionalInfo(value: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('additional_info', '=', value)

    return instance
  }

  applyWhereIn<V>(column: keyof ErrorsTable, values: V[]) {
    this.selectFromQuery = this.selectFromQuery.where(column, 'in', values)

    this.updateFromQuery = this.updateFromQuery.where(column, 'in', values)

    this.deleteFromQuery = this.deleteFromQuery.where(column, 'in', values)

    return this
  }

  whereIn<V = number>(column: keyof ErrorsTable, values: V[]): ErrorModel {
    return this.applyWhereIn<V>(column, values)
  }

  static whereIn<V = number>(column: keyof ErrorsTable, values: V[]): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereIn<V>(column, values)
  }

  applyWhereBetween<V>(column: keyof ErrorsTable, range: [V, V]): ErrorModel {
    if (range.length !== 2) {
      throw new HttpError(500, 'Range must have exactly two values: [min, max]')
    }

    const query = sql` ${sql.raw(column as string)} between ${range[0]} and ${range[1]} `

    this.selectFromQuery = this.selectFromQuery.where(query)
    this.updateFromQuery = this.updateFromQuery.where(query)
    this.deleteFromQuery = this.deleteFromQuery.where(query)

    return this
  }

  whereBetween<V = number>(column: keyof ErrorsTable, range: [V, V]): ErrorModel {
    return this.applyWhereBetween<V>(column, range)
  }

  static whereBetween<V = number>(column: keyof ErrorsTable, range: [V, V]): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereBetween<V>(column, range)
  }

  applyWhereLike(column: keyof ErrorsTable, value: string): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where(sql` ${sql.raw(column as string)} LIKE ${value}`)

    this.updateFromQuery = this.updateFromQuery.where(sql` ${sql.raw(column as string)} LIKE ${value}`)

    this.deleteFromQuery = this.deleteFromQuery.where(sql` ${sql.raw(column as string)} LIKE ${value}`)

    return this
  }

  whereLike(column: keyof ErrorsTable, value: string): ErrorModel {
    return this.applyWhereLike(column, value)
  }

  static whereLike(column: keyof ErrorsTable, value: string): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereLike(column, value)
  }

  applyWhereNotIn<V>(column: keyof ErrorsTable, values: V[]): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.where(column, 'not in', values)

    this.updateFromQuery = this.updateFromQuery.where(column, 'not in', values)

    this.deleteFromQuery = this.deleteFromQuery.where(column, 'not in', values)

    return this
  }

  whereNotIn<V>(column: keyof ErrorsTable, values: V[]): ErrorModel {
    return this.applyWhereNotIn<V>(column, values)
  }

  static whereNotIn<V = number>(column: keyof ErrorsTable, values: V[]): ErrorModel {
    const instance = new ErrorModel(null)

    return instance.applyWhereNotIn<V>(column, values)
  }

  async exists(): Promise<boolean> {
    let model

    if (this.hasSelect) {
      model = await this.selectFromQuery.executeTakeFirst()
    }
    else {
      model = await this.selectFromQuery.selectAll().executeTakeFirst()
    }

    return model !== null && model !== undefined
  }

  static async latest(): Promise<ErrorType | undefined> {
    const instance = new ErrorModel(null)

    const model = await DB.instance.selectFrom('errors')
      .selectAll()
      .orderBy('id', 'desc')
      .executeTakeFirst()

    if (!model)
      return undefined

    instance.mapCustomGetters(model)

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  static async oldest(): Promise<ErrorType | undefined> {
    const instance = new ErrorModel(null)

    const model = await DB.instance.selectFrom('errors')
      .selectAll()
      .orderBy('id', 'asc')
      .executeTakeFirst()

    if (!model)
      return undefined

    instance.mapCustomGetters(model)

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  static async firstOrCreate(
    condition: Partial<ErrorType>,
    newError: NewError,
  ): Promise<ErrorModel> {
    const instance = new ErrorModel(null)

    const key = Object.keys(condition)[0] as keyof ErrorType

    if (!key) {
      throw new HttpError(500, 'Condition must contain at least one key-value pair')
    }

    const value = condition[key]

    // Attempt to find the first record matching the condition
    const existingError = await DB.instance.selectFrom('errors')
      .selectAll()
      .where(key, '=', value)
      .executeTakeFirst()

    if (existingError) {
      instance.mapCustomGetters(existingError)
      await instance.loadRelations(existingError)

      return new ErrorModel(existingError as ErrorType)
    }
    else {
      return await instance.create(newError)
    }
  }

  static async updateOrCreate(
    condition: Partial<ErrorType>,
    newError: NewError,
  ): Promise<ErrorModel> {
    const instance = new ErrorModel(null)

    const key = Object.keys(condition)[0] as keyof ErrorType

    if (!key) {
      throw new HttpError(500, 'Condition must contain at least one key-value pair')
    }

    const value = condition[key]

    // Attempt to find the first record matching the condition
    const existingError = await DB.instance.selectFrom('errors')
      .selectAll()
      .where(key, '=', value)
      .executeTakeFirst()

    if (existingError) {
      // If found, update the existing record
      await DB.instance.updateTable('errors')
        .set(newError)
        .where(key, '=', value)
        .executeTakeFirstOrThrow()

      // Fetch and return the updated record
      const updatedError = await DB.instance.selectFrom('errors')
        .selectAll()
        .where(key, '=', value)
        .executeTakeFirst()

      if (!updatedError) {
        throw new HttpError(500, 'Failed to fetch updated record')
      }

      instance.hasSaved = true

      return new ErrorModel(updatedError as ErrorType)
    }
    else {
      // If not found, create a new record
      return await instance.create(newError)
    }
  }

  async loadRelations(models: ErrorJsonResponse | ErrorJsonResponse[]): Promise<void> {
    // Handle both single model and array of models
    const modelArray = Array.isArray(models) ? models : [models]
    if (!modelArray.length)
      return

    const modelIds = modelArray.map(model => model.id)

    for (const relation of this.withRelations) {
      const relatedRecords = await DB.instance
        .selectFrom(relation)
        .where('error_id', 'in', modelIds)
        .selectAll()
        .execute()

      if (Array.isArray(models)) {
        models.map((model: ErrorJsonResponse) => {
          const records = relatedRecords.filter((record: { error_id: number }) => {
            return record.error_id === model.id
          })

          model[relation] = records.length === 1 ? records[0] : records
          return model
        })
      }
      else {
        const records = relatedRecords.filter((record: { error_id: number }) => {
          return record.error_id === models.id
        })

        models[relation] = records.length === 1 ? records[0] : records
      }
    }
  }

  with(relations: string[]): ErrorModel {
    this.withRelations = relations

    return this
  }

  static with(relations: string[]): ErrorModel {
    const instance = new ErrorModel(null)

    instance.withRelations = relations

    return instance
  }

  async last(): Promise<ErrorType | undefined> {
    let model: ErrorModel | undefined

    if (this.hasSelect) {
      model = await this.selectFromQuery.executeTakeFirst()
    }
    else {
      model = await this.selectFromQuery.selectAll().orderBy('id', 'desc').executeTakeFirst()
    }

    if (model) {
      this.mapCustomGetters(model)
      await this.loadRelations(model)
    }

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  static async last(): Promise<ErrorType | undefined> {
    const model = await DB.instance.selectFrom('errors').selectAll().orderBy('id', 'desc').executeTakeFirst()

    if (!model)
      return undefined

    const data = new ErrorModel(model as ErrorType)

    return data
  }

  orderBy(column: keyof ErrorsTable, order: 'asc' | 'desc'): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(column, order)

    return this
  }

  static orderBy(column: keyof ErrorsTable, order: 'asc' | 'desc'): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(column, order)

    return instance
  }

  groupBy(column: keyof ErrorsTable): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.groupBy(column)

    return this
  }

  static groupBy(column: keyof ErrorsTable): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.groupBy(column)

    return instance
  }

  having<V = string>(column: keyof ErrorsTable, operator: Operator, value: V): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.having(column, operator, value)

    return this
  }

  static having<V = string>(column: keyof ErrorsTable, operator: Operator, value: V): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.having(column, operator, value)

    return instance
  }

  inRandomOrder(): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(sql` ${sql.raw('RANDOM()')} `)

    return this
  }

  static inRandomOrder(): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(sql` ${sql.raw('RANDOM()')} `)

    return instance
  }

  orderByDesc(column: keyof ErrorsTable): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(column, 'desc')

    return this
  }

  static orderByDesc(column: keyof ErrorsTable): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(column, 'desc')

    return instance
  }

  orderByAsc(column: keyof ErrorsTable): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(column, 'asc')

    return this
  }

  static orderByAsc(column: keyof ErrorsTable): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(column, 'asc')

    return instance
  }

  async update(newError: ErrorUpdate): Promise<ErrorModel | undefined> {
    const filteredValues = Object.fromEntries(
      Object.entries(newError).filter(([key]) =>
        !this.guarded.includes(key) && this.fillable.includes(key),
      ),
    ) as NewError

    await this.mapCustomSetters(filteredValues)

    await DB.instance.updateTable('errors')
      .set(filteredValues)
      .where('id', '=', this.id)
      .executeTakeFirst()

    if (this.id) {
      const model = await this.find(this.id)

      return model
    }

    this.hasSaved = true

    return undefined
  }

  async forceUpdate(error: ErrorUpdate): Promise<ErrorModel | undefined> {
    if (this.id === undefined) {
      this.updateFromQuery.set(error).execute()
    }

    await this.mapCustomSetters(error)

    await DB.instance.updateTable('errors')
      .set(error)
      .where('id', '=', this.id)
      .executeTakeFirst()

    if (this.id) {
      const model = await this.find(this.id)

      this.hasSaved = true

      return model
    }

    return undefined
  }

  async save(): Promise<void> {
    if (!this)
      throw new HttpError(500, 'Error data is undefined')

    await this.mapCustomSetters(this.attributes)

    if (this.id === undefined) {
      await this.create(this.attributes)
    }
    else {
      await this.update(this.attributes)
    }

    this.hasSaved = true
  }

  fill(data: Partial<ErrorType>): ErrorModel {
    const filteredValues = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        !this.guarded.includes(key) && this.fillable.includes(key),
      ),
    ) as NewError

    this.attributes = {
      ...this.attributes,
      ...filteredValues,
    }

    return this
  }

  forceFill(data: Partial<ErrorType>): ErrorModel {
    this.attributes = {
      ...this.attributes,
      ...data,
    }

    return this
  }

  // Method to delete (soft delete) the error instance
  async delete(): Promise<ErrorsTable> {
    if (this.id === undefined)
      this.deleteFromQuery.execute()

    return await DB.instance.deleteFrom('errors')
      .where('id', '=', this.id)
      .execute()
  }

  distinct(column: keyof ErrorType): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.select(column).distinct()

    this.hasSelect = true

    return this
  }

  static distinct(column: keyof ErrorType): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.select(column).distinct()

    instance.hasSelect = true

    return instance
  }

  join(table: string, firstCol: string, secondCol: string): ErrorModel {
    this.selectFromQuery = this.selectFromQuery.innerJoin(table, firstCol, secondCol)

    return this
  }

  static join(table: string, firstCol: string, secondCol: string): ErrorModel {
    const instance = new ErrorModel(null)

    instance.selectFromQuery = instance.selectFromQuery.innerJoin(table, firstCol, secondCol)

    return instance
  }

  toJSON(): Partial<ErrorJsonResponse> {
    const output: Partial<ErrorJsonResponse> = {

      id: this.id,
      type: this.type,
      message: this.message,
      stack: this.stack,
      status: this.status,
      additional_info: this.additional_info,

      created_at: this.created_at,

      updated_at: this.updated_at,

      ...this.customColumns,
    }

    return output
  }

  parseResult(model: ErrorModel): ErrorModel {
    for (const hiddenAttribute of this.hidden) {
      delete model[hiddenAttribute as keyof ErrorModel]
    }

    return model
  }
}

async function find(id: number): Promise<ErrorModel | undefined> {
  const query = DB.instance.selectFrom('errors').where('id', '=', id).selectAll()

  const model = await query.executeTakeFirst()

  if (!model)
    return undefined

  return new ErrorModel(model)
}

export async function count(): Promise<number> {
  const results = await ErrorModel.count()

  return results
}

export async function create(newError: NewError): Promise<ErrorModel> {
  const result = await DB.instance.insertInto('errors')
    .values(newError)
    .executeTakeFirstOrThrow()

  return await find(Number(result.numInsertedOrUpdatedRows)) as ErrorModel
}

export async function rawQuery(rawQuery: string): Promise<any> {
  return await sql`${rawQuery}`.execute(DB.instance)
}

export async function remove(id: number): Promise<void> {
  await DB.instance.deleteFrom('errors')
    .where('id', '=', id)
    .execute()
}

export async function whereType(value: string): Promise<ErrorModel[]> {
  const query = DB.instance.selectFrom('errors').where('type', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ErrorModel) => new ErrorModel(modelItem))
}

export async function whereMessage(value: string): Promise<ErrorModel[]> {
  const query = DB.instance.selectFrom('errors').where('message', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ErrorModel) => new ErrorModel(modelItem))
}

export async function whereStack(value: string): Promise<ErrorModel[]> {
  const query = DB.instance.selectFrom('errors').where('stack', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ErrorModel) => new ErrorModel(modelItem))
}

export async function whereStatus(value: number): Promise<ErrorModel[]> {
  const query = DB.instance.selectFrom('errors').where('status', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ErrorModel) => new ErrorModel(modelItem))
}

export async function whereAdditionalInfo(value: string): Promise<ErrorModel[]> {
  const query = DB.instance.selectFrom('errors').where('additional_info', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ErrorModel) => new ErrorModel(modelItem))
}

export const Error = ErrorModel

export default Error
