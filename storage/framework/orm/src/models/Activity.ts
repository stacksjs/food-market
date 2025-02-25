import type { Insertable, RawBuilder, Selectable, Updateable } from '@stacksjs/database'
import type { Operator } from '@stacksjs/orm'
import { cache } from '@stacksjs/cache'
import { sql } from '@stacksjs/database'
import { HttpError, ModelNotFoundException } from '@stacksjs/error-handling'
import { DB, SubqueryBuilder } from '@stacksjs/orm'

export interface ActivitiesTable {
  id?: number
  title?: string
  description?: string
  address?: string
  latlng?: string
  info_source?: string[]
  were_detained?: boolean

  created_at?: Date

  updated_at?: Date

  deleted_at?: Date

}

interface ActivityResponse {
  data: ActivityJsonResponse[]
  paging: {
    total_records: number
    page: number
    total_pages: number
  }
  next_cursor: number | null
}

export interface ActivityJsonResponse extends Omit<ActivitiesTable, 'password'> {
  [key: string]: any
}

export type ActivityType = Selectable<ActivitiesTable>
export type NewActivity = Partial<Insertable<ActivitiesTable>>
export type ActivityUpdate = Updateable<ActivitiesTable>

      type SortDirection = 'asc' | 'desc'
interface SortOptions { column: ActivityType, order: SortDirection }
// Define a type for the options parameter
interface QueryOptions {
  sort?: SortOptions
  limit?: number
  offset?: number
  page?: number
}

export class ActivityModel {
  private readonly hidden: Array<keyof ActivityJsonResponse> = []
  private readonly fillable: Array<keyof ActivityJsonResponse> = ['title', 'description', 'address', 'latlng', 'info_source', 'were_detained', 'uuid']
  private readonly guarded: Array<keyof ActivityJsonResponse> = []
  protected attributes: Partial<ActivityJsonResponse> = {}
  protected originalAttributes: Partial<ActivityJsonResponse> = {}
  private softDeletes = false
  protected selectFromQuery: any
  protected withRelations: string[]
  protected updateFromQuery: any
  protected deleteFromQuery: any
  protected hasSelect: boolean
  private hasSaved: boolean
  private customColumns: Record<string, unknown> = {}

  constructor(activity: Partial<ActivityType> | null) {
    if (activity) {
      this.attributes = { ...activity }
      this.originalAttributes = { ...activity }

      Object.keys(activity).forEach((key) => {
        if (!(key in this)) {
          this.customColumns[key] = (activity as ActivityJsonResponse)[key]
        }
      })
    }

    this.withRelations = []
    this.selectFromQuery = DB.instance.selectFrom('activities')
    this.updateFromQuery = DB.instance.updateTable('activities')
    this.deleteFromQuery = DB.instance.deleteFrom('activities')
    this.hasSelect = false
    this.hasSaved = false
  }

  mapCustomGetters(models: ActivityJsonResponse | ActivityJsonResponse[]): void {
    const data = models

    if (Array.isArray(data)) {
      data.map((model: ActivityJsonResponse) => {
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

  async mapCustomSetters(model: ActivityJsonResponse): Promise<void> {
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

  get title(): string | undefined {
    return this.attributes.title
  }

  get description(): string | undefined {
    return this.attributes.description
  }

  get address(): string | undefined {
    return this.attributes.address
  }

  get latlng(): string | undefined {
    return this.attributes.latlng
  }

  get info_source(): string[] | undefined {
    return this.attributes.info_source
  }

  get were_detained(): boolean | undefined {
    return this.attributes.were_detained
  }

  get created_at(): Date | undefined {
    return this.attributes.created_at
  }

  get updated_at(): Date | undefined {
    return this.attributes.updated_at
  }

  get deleted_at(): Date | undefined {
    return this.attributes.deleted_at
  }

  set title(value: string) {
    this.attributes.title = value
  }

  set description(value: string) {
    this.attributes.description = value
  }

  set address(value: string) {
    this.attributes.address = value
  }

  set latlng(value: string) {
    this.attributes.latlng = value
  }

  set info_source(value: string[]) {
    this.attributes.info_source = value
  }

  set were_detained(value: boolean) {
    this.attributes.were_detained = value
  }

  set updated_at(value: Date) {
    this.attributes.updated_at = value
  }

  set deleted_at(value: Date) {
    this.attributes.deleted_at = value
  }

  getOriginal(column?: keyof ActivityJsonResponse): Partial<ActivityJsonResponse> {
    if (column) {
      return this.originalAttributes[column]
    }

    return this.originalAttributes
  }

  getChanges(): Partial<ActivityJsonResponse> {
    return this.fillable.reduce<Partial<ActivityJsonResponse>>((changes, key) => {
      const currentValue = this.attributes[key as keyof ActivitiesTable]
      const originalValue = this.originalAttributes[key as keyof ActivitiesTable]

      if (currentValue !== originalValue) {
        changes[key] = currentValue
      }

      return changes
    }, {})
  }

  isDirty(column?: keyof ActivityType): boolean {
    if (column) {
      return this.attributes[column] !== this.originalAttributes[column]
    }

    return Object.entries(this.originalAttributes).some(([key, originalValue]) => {
      const currentValue = (this.attributes as any)[key]

      return currentValue !== originalValue
    })
  }

  isClean(column?: keyof ActivityType): boolean {
    return !this.isDirty(column)
  }

  wasChanged(column?: keyof ActivityType): boolean {
    return this.hasSaved && this.isDirty(column)
  }

  select(params: (keyof ActivityType)[] | RawBuilder<string> | string): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.select(params)

    this.hasSelect = true

    return this
  }

  static select(params: (keyof ActivityType)[] | RawBuilder<string> | string): ActivityModel {
    const instance = new ActivityModel(null)

    // Initialize a query with the table name and selected fields
    instance.selectFromQuery = instance.selectFromQuery.select(params)

    instance.hasSelect = true

    return instance
  }

  async applyFind(id: number): Promise<ActivityModel | undefined> {
    const model = await DB.instance.selectFrom('activities').where('id', '=', id).selectAll().executeTakeFirst()

    if (!model)
      return undefined

    this.mapCustomGetters(model)
    await this.loadRelations(model)

    const data = new ActivityModel(model as ActivityType)

    cache.getOrSet(`activity:${id}`, JSON.stringify(model))

    return data
  }

  async find(id: number): Promise<ActivityModel | undefined> {
    return await this.applyFind(id)
  }

  // Method to find a Activity by ID
  static async find(id: number): Promise<ActivityModel | undefined> {
    const instance = new ActivityModel(null)

    return await instance.applyFind(id)
  }

  async first(): Promise<ActivityModel | undefined> {
    let model: ActivityModel | undefined

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

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  static async first(): Promise<ActivityModel | undefined> {
    const instance = new ActivityModel(null)

    const model = await DB.instance.selectFrom('activities')
      .selectAll()
      .executeTakeFirst()

    instance.mapCustomGetters(model)

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  async applyFirstOrFail(): Promise<ActivityModel | undefined> {
    const model = await this.selectFromQuery.executeTakeFirst()

    if (model === undefined)
      throw new ModelNotFoundException(404, 'No ActivityModel results found for query')

    if (model) {
      this.mapCustomGetters(model)
      await this.loadRelations(model)
    }

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  async firstOrFail(): Promise<ActivityModel | undefined> {
    return await this.applyFirstOrFail()
  }

  static async firstOrFail(): Promise<ActivityModel | undefined> {
    const instance = new ActivityModel(null)

    return await instance.applyFirstOrFail()
  }

  static async all(): Promise<ActivityModel[]> {
    const instance = new ActivityModel(null)

    const models = await DB.instance.selectFrom('activities').selectAll().execute()

    instance.mapCustomGetters(models)

    const data = await Promise.all(models.map(async (model: ActivityType) => {
      return new ActivityModel(model)
    }))

    return data
  }

  async applyFindOrFail(id: number): Promise<ActivityModel> {
    const model = await DB.instance.selectFrom('activities').where('id', '=', id).selectAll().executeTakeFirst()

    if (instance.softDeletes) {
      instance.selectFromQuery = instance.selectFromQuery.where('deleted_at', 'is', null)
    }

    if (model === undefined)
      throw new ModelNotFoundException(404, `No ActivityModel results for ${id}`)

    cache.getOrSet(`activity:${id}`, JSON.stringify(model))

    this.mapCustomGetters(model)
    await this.loadRelations(model)

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  async findOrFail(id: number): Promise<ActivityModel> {
    return await this.applyFindOrFail(id)
  }

  static async findOrFail(id: number): Promise<ActivityModel> {
    const instance = new ActivityModel(null)

    return await instance.applyFindOrFail(id)
  }

  async applyFindMany(ids: number[]): Promise<ActivityModel[]> {
    let query = DB.instance.selectFrom('activities').where('id', 'in', ids)

    const instance = new ActivityModel(null)

    if (instance.softDeletes) {
      query = query.where('deleted_at', 'is', null)
    }

    query = query.selectAll()

    const models = await query.execute()

    instance.mapCustomGetters(models)
    await instance.loadRelations(models)

    return models.map((modelItem: ActivityModel) => instance.parseResult(new ActivityModel(modelItem)))
  }

  static async findMany(ids: number[]): Promise<ActivityModel[]> {
    const instance = new ActivityModel(null)

    return await instance.applyFindMany(ids)
  }

  async findMany(ids: number[]): Promise<ActivityModel[]> {
    return await this.applyFindMany(ids)
  }

  skip(count: number): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.offset(count)

    return this
  }

  static skip(count: number): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.offset(count)

    return instance
  }

  async applyChunk(size: number, callback: (models: ActivityModel[]) => Promise<void>): Promise<void> {
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

  async chunk(size: number, callback: (models: ActivityModel[]) => Promise<void>): Promise<void> {
    await this.applyChunk(size, callback)
  }

  static async chunk(size: number, callback: (models: ActivityModel[]) => Promise<void>): Promise<void> {
    const instance = new ActivityModel(null)

    await instance.applyChunk(size, callback)
  }

  take(count: number): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.limit(count)

    return this
  }

  static take(count: number): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.limit(count)

    return instance
  }

  static async pluck<K extends keyof ActivityModel>(field: K): Promise<ActivityModel[K][]> {
    const instance = new ActivityModel(null)

    if (instance.hasSelect) {
      const model = await instance.selectFromQuery.execute()
      return model.map((modelItem: ActivityModel) => modelItem[field])
    }

    const model = await instance.selectFromQuery.selectAll().execute()

    return model.map((modelItem: ActivityModel) => modelItem[field])
  }

  async pluck<K extends keyof ActivityModel>(field: K): Promise<ActivityModel[K][]> {
    return ActivityModel.pluck(field)
  }

  static async count(): Promise<number> {
    const instance = new ActivityModel(null)

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

  static async max(field: keyof ActivityModel): Promise<number> {
    const instance = new ActivityModel(null)

    const result = await instance.selectFromQuery
      .select(sql`MAX(${sql.raw(field as string)}) as max `)
      .executeTakeFirst()

    return result.max
  }

  async max(field: keyof ActivityModel): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`MAX(${sql.raw(field as string)}) as max`)
      .executeTakeFirst()

    return result.max
  }

  static async min(field: keyof ActivityModel): Promise<number> {
    const instance = new ActivityModel(null)

    const result = await instance.selectFromQuery
      .select(sql`MIN(${sql.raw(field as string)}) as min `)
      .executeTakeFirst()

    return result.min
  }

  async min(field: keyof ActivityModel): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`MIN(${sql.raw(field as string)}) as min `)
      .executeTakeFirst()

    return result.min
  }

  static async avg(field: keyof ActivityModel): Promise<number> {
    const instance = new ActivityModel(null)

    const result = await instance.selectFromQuery
      .select(sql`AVG(${sql.raw(field as string)}) as avg `)
      .executeTakeFirst()

    return result.avg
  }

  async avg(field: keyof ActivityModel): Promise<number> {
    const result = await this.selectFromQuery
      .select(sql`AVG(${sql.raw(field as string)}) as avg `)
      .executeTakeFirst()

    return result.avg
  }

  static async sum(field: keyof ActivityModel): Promise<number> {
    const instance = new ActivityModel(null)

    const result = await instance.selectFromQuery
      .select(sql`SUM(${sql.raw(field as string)}) as sum `)
      .executeTakeFirst()

    return result.sum
  }

  async sum(field: keyof ActivityModel): Promise<number> {
    const result = this.selectFromQuery
      .select(sql`SUM(${sql.raw(field as string)}) as sum `)
      .executeTakeFirst()

    return result.sum
  }

  async applyGet(): Promise<ActivityModel[]> {
    let models

    if (this.hasSelect) {
      models = await this.selectFromQuery.execute()
    }
    else {
      models = await this.selectFromQuery.selectAll().execute()
    }

    this.mapCustomGetters(models)
    await this.loadRelations(models)

    const data = await Promise.all(models.map(async (model: ActivityModel) => {
      return new ActivityModel(model)
    }))

    return data
  }

  async get(): Promise<ActivityModel[]> {
    return await this.applyGet()
  }

  static async get(): Promise<ActivityModel[]> {
    const instance = new ActivityModel(null)

    return await instance.applyGet()
  }

  has(relation: string): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.where(({ exists, selectFrom }: any) =>
      exists(
        selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.activity_id`, '=', 'activities.id'),
      ),
    )

    return this
  }

  static has(relation: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where(({ exists, selectFrom }: any) =>
      exists(
        selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.activity_id`, '=', 'activities.id'),
      ),
    )

    return instance
  }

  static whereExists(callback: (qb: any) => any): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where(({ exists, selectFrom }: any) =>
      exists(callback({ exists, selectFrom })),
    )

    return instance
  }

  applyWhereHas(
    relation: string,
    callback: (query: SubqueryBuilder<keyof ActivityModel>) => void,
  ): ActivityModel {
    const subqueryBuilder = new SubqueryBuilder()

    callback(subqueryBuilder)
    const conditions = subqueryBuilder.getConditions()

    this.selectFromQuery = this.selectFromQuery
      .where(({ exists, selectFrom }: any) => {
        let subquery = selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.activity_id`, '=', 'activities.id')

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
    callback: (query: SubqueryBuilder<keyof ActivityModel>) => void,
  ): ActivityModel {
    return this.applyWhereHas(relation, callback)
  }

  static whereHas(
    relation: string,
    callback: (query: SubqueryBuilder<keyof ActivityModel>) => void,
  ): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhereHas(relation, callback)
  }

  applyDoesntHave(relation: string): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.where(({ not, exists, selectFrom }: any) =>
      not(
        exists(
          selectFrom(relation)
            .select('1')
            .whereRef(`${relation}.activity_id`, '=', 'activities.id'),
        ),
      ),
    )

    return this
  }

  doesntHave(relation: string): ActivityModel {
    return this.applyDoesntHave(relation)
  }

  static doesntHave(relation: string): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyDoesntHave(relation)
  }

  applyWhereDoesntHave(relation: string, callback: (query: SubqueryBuilder<ActivitiesTable>) => void): ActivityModel {
    const subqueryBuilder = new SubqueryBuilder()

    callback(subqueryBuilder)
    const conditions = subqueryBuilder.getConditions()

    this.selectFromQuery = this.selectFromQuery
      .where(({ exists, selectFrom, not }: any) => {
        const subquery = selectFrom(relation)
          .select('1')
          .whereRef(`${relation}.activity_id`, '=', 'activities.id')

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

  whereDoesntHave(relation: string, callback: (query: SubqueryBuilder<ActivitiesTable>) => void): ActivityModel {
    return this.applyWhereDoesntHave(relation, callback)
  }

  static whereDoesntHave(
    relation: string,
    callback: (query: SubqueryBuilder<ActivitiesTable>) => void,
  ): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhereDoesntHave(relation, callback)
  }

  async applyPaginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ActivityResponse> {
    const totalRecordsResult = await DB.instance.selectFrom('activities')
      .select(DB.instance.fn.count('id').as('total')) // Use 'id' or another actual column name
      .executeTakeFirst()

    const totalRecords = Number(totalRecordsResult?.total) || 0
    const totalPages = Math.ceil(totalRecords / (options.limit ?? 10))

    const activitiesWithExtra = await DB.instance.selectFrom('activities')
      .selectAll()
      .orderBy('id', 'asc') // Assuming 'id' is used for cursor-based pagination
      .limit((options.limit ?? 10) + 1) // Fetch one extra record
      .offset(((options.page ?? 1) - 1) * (options.limit ?? 10)) // Ensure options.page is not undefined
      .execute()

    let nextCursor = null
    if (activitiesWithExtra.length > (options.limit ?? 10))
      nextCursor = activitiesWithExtra.pop()?.id ?? null

    return {
      data: activitiesWithExtra,
      paging: {
        total_records: totalRecords,
        page: options.page || 1,
        total_pages: totalPages,
      },
      next_cursor: nextCursor,
    }
  }

  async paginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ActivityResponse> {
    return await this.applyPaginate(options)
  }

  // Method to get all activities
  static async paginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ActivityResponse> {
    const instance = new ActivityModel(null)

    return await instance.applyPaginate(options)
  }

  async applyCreate(newActivity: NewActivity): Promise<ActivityModel> {
    const filteredValues = Object.fromEntries(
      Object.entries(newActivity).filter(([key]) =>
        !this.guarded.includes(key) && this.fillable.includes(key),
      ),
    ) as NewActivity

    await this.mapCustomSetters(filteredValues)

    const result = await DB.instance.insertInto('activities')
      .values(filteredValues)
      .executeTakeFirst()

    const model = await this.find(Number(result.numInsertedOrUpdatedRows)) as ActivityModel

    return model
  }

  async create(newActivity: NewActivity): Promise<ActivityModel> {
    return await this.applyCreate(newActivity)
  }

  static async create(newActivity: NewActivity): Promise<ActivityModel> {
    const instance = new ActivityModel(null)

    return await instance.applyCreate(newActivity)
  }

  static async createMany(newActivity: NewActivity[]): Promise<void> {
    const instance = new ActivityModel(null)

    const valuesFiltered = newActivity.map((newActivity: NewActivity) => {
      const filteredValues = Object.fromEntries(
        Object.entries(newActivity).filter(([key]) =>
          !instance.guarded.includes(key) && instance.fillable.includes(key),
        ),
      ) as NewActivity

      return filteredValues
    })

    await DB.instance.insertInto('activities')
      .values(valuesFiltered)
      .executeTakeFirst()
  }

  static async forceCreate(newActivity: NewActivity): Promise<ActivityModel> {
    const result = await DB.instance.insertInto('activities')
      .values(newActivity)
      .executeTakeFirst()

    const model = await find(Number(result.numInsertedOrUpdatedRows)) as ActivityModel

    return model
  }

  // Method to remove a Activity
  static async remove(id: number): Promise<any> {
    const instance = new ActivityModel(null)

    if (instance.softDeletes) {
      return await DB.instance.updateTable('activities')
        .set({
          deleted_at: sql.raw('CURRENT_TIMESTAMP'),
        })
        .where('id', '=', id)
        .execute()
    }

    return await DB.instance.deleteFrom('activities')
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

  where<V = string>(column: keyof ActivitiesTable, ...args: [V] | [Operator, V]): ActivityModel {
    return this.applyWhere<V>(column, ...args)
  }

  static where<V = string>(column: keyof ActivitiesTable, ...args: [V] | [Operator, V]): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhere<V>(column, ...args)
  }

  whereColumn(first: keyof ActivitiesTable, operator: Operator, second: keyof ActivitiesTable): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.whereRef(first, operator, second)

    return this
  }

  static whereColumn(first: keyof ActivitiesTable, operator: Operator, second: keyof ActivitiesTable): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.whereRef(first, operator, second)

    return instance
  }

  applyWhereRef(column: keyof ActivitiesTable, ...args: string[]): ActivityModel {
    const [operatorOrValue, value] = args
    const operator = value === undefined ? '=' : operatorOrValue
    const actualValue = value === undefined ? operatorOrValue : value

    const instance = new ActivityModel(null)
    instance.selectFromQuery = instance.selectFromQuery.whereRef(column, operator, actualValue)

    return instance
  }

  whereRef(column: keyof ActivitiesTable, ...args: string[]): ActivityModel {
    return this.applyWhereRef(column, ...args)
  }

  static whereRef(column: keyof ActivitiesTable, ...args: string[]): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhereRef(column, ...args)
  }

  whereRaw(sqlStatement: string): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.where(sql`${sqlStatement}`)

    return this
  }

  static whereRaw(sqlStatement: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where(sql`${sqlStatement}`)

    return instance
  }

  applyOrWhere(...conditions: [string, any][]): ActivityModel {
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

  orWhere(...conditions: [string, any][]): ActivityModel {
    return this.applyOrWhere(...conditions)
  }

  static orWhere(...conditions: [string, any][]): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyOrWhere(...conditions)
  }

  when(
    condition: boolean,
    callback: (query: ActivityModel) => ActivityModel,
  ): ActivityModel {
    return ActivityModel.when(condition, callback)
  }

  static when(
    condition: boolean,
    callback: (query: ActivityModel) => ActivityModel,
  ): ActivityModel {
    let instance = new ActivityModel(null)

    if (condition)
      instance = callback(instance)

    return instance
  }

  whereNotNull(column: keyof ActivitiesTable): ActivityModel {
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

  static whereNotNull(column: keyof ActivitiesTable): ActivityModel {
    const instance = new ActivityModel(null)

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

  whereNull(column: keyof ActivitiesTable): ActivityModel {
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

  static whereNull(column: keyof ActivitiesTable): ActivityModel {
    const instance = new ActivityModel(null)

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

  static whereTitle(value: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('title', '=', value)

    return instance
  }

  static whereDescription(value: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('description', '=', value)

    return instance
  }

  static whereAddress(value: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('address', '=', value)

    return instance
  }

  static whereLatlng(value: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('latlng', '=', value)

    return instance
  }

  static whereInfoSource(value: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('infoSource', '=', value)

    return instance
  }

  static whereWereDetained(value: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.where('wereDetained', '=', value)

    return instance
  }

  applyWhereIn<V>(column: keyof ActivitiesTable, values: V[]) {
    this.selectFromQuery = this.selectFromQuery.where(column, 'in', values)

    this.updateFromQuery = this.updateFromQuery.where(column, 'in', values)

    this.deleteFromQuery = this.deleteFromQuery.where(column, 'in', values)

    return this
  }

  whereIn<V = number>(column: keyof ActivitiesTable, values: V[]): ActivityModel {
    return this.applyWhereIn<V>(column, values)
  }

  static whereIn<V = number>(column: keyof ActivitiesTable, values: V[]): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhereIn<V>(column, values)
  }

  applyWhereBetween<V>(column: keyof ActivitiesTable, range: [V, V]): ActivityModel {
    if (range.length !== 2) {
      throw new HttpError(500, 'Range must have exactly two values: [min, max]')
    }

    const query = sql` ${sql.raw(column as string)} between ${range[0]} and ${range[1]} `

    this.selectFromQuery = this.selectFromQuery.where(query)
    this.updateFromQuery = this.updateFromQuery.where(query)
    this.deleteFromQuery = this.deleteFromQuery.where(query)

    return this
  }

  whereBetween<V = number>(column: keyof ActivitiesTable, range: [V, V]): ActivityModel {
    return this.applyWhereBetween<V>(column, range)
  }

  static whereBetween<V = number>(column: keyof ActivitiesTable, range: [V, V]): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhereBetween<V>(column, range)
  }

  applyWhereLike(column: keyof ActivitiesTable, value: string): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.where(sql` ${sql.raw(column as string)} LIKE ${value}`)

    this.updateFromQuery = this.updateFromQuery.where(sql` ${sql.raw(column as string)} LIKE ${value}`)

    this.deleteFromQuery = this.deleteFromQuery.where(sql` ${sql.raw(column as string)} LIKE ${value}`)

    return this
  }

  whereLike(column: keyof ActivitiesTable, value: string): ActivityModel {
    return this.applyWhereLike(column, value)
  }

  static whereLike(column: keyof ActivitiesTable, value: string): ActivityModel {
    const instance = new ActivityModel(null)

    return instance.applyWhereLike(column, value)
  }

  applyWhereNotIn<V>(column: keyof ActivitiesTable, values: V[]): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.where(column, 'not in', values)

    this.updateFromQuery = this.updateFromQuery.where(column, 'not in', values)

    this.deleteFromQuery = this.deleteFromQuery.where(column, 'not in', values)

    return this
  }

  whereNotIn<V>(column: keyof ActivitiesTable, values: V[]): ActivityModel {
    return this.applyWhereNotIn<V>(column, values)
  }

  static whereNotIn<V = number>(column: keyof ActivitiesTable, values: V[]): ActivityModel {
    const instance = new ActivityModel(null)

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

  static async latest(): Promise<ActivityType | undefined> {
    const instance = new ActivityModel(null)

    const model = await DB.instance.selectFrom('activities')
      .selectAll()
      .orderBy('id', 'desc')
      .executeTakeFirst()

    if (!model)
      return undefined

    instance.mapCustomGetters(model)

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  static async oldest(): Promise<ActivityType | undefined> {
    const instance = new ActivityModel(null)

    const model = await DB.instance.selectFrom('activities')
      .selectAll()
      .orderBy('id', 'asc')
      .executeTakeFirst()

    if (!model)
      return undefined

    instance.mapCustomGetters(model)

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  static async firstOrCreate(
    condition: Partial<ActivityType>,
    newActivity: NewActivity,
  ): Promise<ActivityModel> {
    const instance = new ActivityModel(null)

    const key = Object.keys(condition)[0] as keyof ActivityType

    if (!key) {
      throw new HttpError(500, 'Condition must contain at least one key-value pair')
    }

    const value = condition[key]

    // Attempt to find the first record matching the condition
    const existingActivity = await DB.instance.selectFrom('activities')
      .selectAll()
      .where(key, '=', value)
      .executeTakeFirst()

    if (existingActivity) {
      instance.mapCustomGetters(existingActivity)
      await instance.loadRelations(existingActivity)

      return new ActivityModel(existingActivity as ActivityType)
    }
    else {
      return await instance.create(newActivity)
    }
  }

  static async updateOrCreate(
    condition: Partial<ActivityType>,
    newActivity: NewActivity,
  ): Promise<ActivityModel> {
    const instance = new ActivityModel(null)

    const key = Object.keys(condition)[0] as keyof ActivityType

    if (!key) {
      throw new HttpError(500, 'Condition must contain at least one key-value pair')
    }

    const value = condition[key]

    // Attempt to find the first record matching the condition
    const existingActivity = await DB.instance.selectFrom('activities')
      .selectAll()
      .where(key, '=', value)
      .executeTakeFirst()

    if (existingActivity) {
      // If found, update the existing record
      await DB.instance.updateTable('activities')
        .set(newActivity)
        .where(key, '=', value)
        .executeTakeFirstOrThrow()

      // Fetch and return the updated record
      const updatedActivity = await DB.instance.selectFrom('activities')
        .selectAll()
        .where(key, '=', value)
        .executeTakeFirst()

      if (!updatedActivity) {
        throw new HttpError(500, 'Failed to fetch updated record')
      }

      instance.hasSaved = true

      return new ActivityModel(updatedActivity as ActivityType)
    }
    else {
      // If not found, create a new record
      return await instance.create(newActivity)
    }
  }

  async loadRelations(models: ActivityJsonResponse | ActivityJsonResponse[]): Promise<void> {
    // Handle both single model and array of models
    const modelArray = Array.isArray(models) ? models : [models]
    if (!modelArray.length)
      return

    const modelIds = modelArray.map(model => model.id)

    for (const relation of this.withRelations) {
      const relatedRecords = await DB.instance
        .selectFrom(relation)
        .where('activity_id', 'in', modelIds)
        .selectAll()
        .execute()

      if (Array.isArray(models)) {
        models.map((model: ActivityJsonResponse) => {
          const records = relatedRecords.filter((record: { activity_id: number }) => {
            return record.activity_id === model.id
          })

          model[relation] = records.length === 1 ? records[0] : records
          return model
        })
      }
      else {
        const records = relatedRecords.filter((record: { activity_id: number }) => {
          return record.activity_id === models.id
        })

        models[relation] = records.length === 1 ? records[0] : records
      }
    }
  }

  with(relations: string[]): ActivityModel {
    this.withRelations = relations

    return this
  }

  static with(relations: string[]): ActivityModel {
    const instance = new ActivityModel(null)

    instance.withRelations = relations

    return instance
  }

  async last(): Promise<ActivityType | undefined> {
    let model: ActivityModel | undefined

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

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  static async last(): Promise<ActivityType | undefined> {
    const model = await DB.instance.selectFrom('activities').selectAll().orderBy('id', 'desc').executeTakeFirst()

    if (!model)
      return undefined

    const data = new ActivityModel(model as ActivityType)

    return data
  }

  orderBy(column: keyof ActivitiesTable, order: 'asc' | 'desc'): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(column, order)

    return this
  }

  static orderBy(column: keyof ActivitiesTable, order: 'asc' | 'desc'): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(column, order)

    return instance
  }

  groupBy(column: keyof ActivitiesTable): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.groupBy(column)

    return this
  }

  static groupBy(column: keyof ActivitiesTable): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.groupBy(column)

    return instance
  }

  having<V = string>(column: keyof ActivitiesTable, operator: Operator, value: V): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.having(column, operator, value)

    return this
  }

  static having<V = string>(column: keyof ActivitiesTable, operator: Operator, value: V): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.having(column, operator, value)

    return instance
  }

  inRandomOrder(): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(sql` ${sql.raw('RANDOM()')} `)

    return this
  }

  static inRandomOrder(): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(sql` ${sql.raw('RANDOM()')} `)

    return instance
  }

  orderByDesc(column: keyof ActivitiesTable): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(column, 'desc')

    return this
  }

  static orderByDesc(column: keyof ActivitiesTable): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(column, 'desc')

    return instance
  }

  orderByAsc(column: keyof ActivitiesTable): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.orderBy(column, 'asc')

    return this
  }

  static orderByAsc(column: keyof ActivitiesTable): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.orderBy(column, 'asc')

    return instance
  }

  async update(newActivity: ActivityUpdate): Promise<ActivityModel | undefined> {
    const filteredValues = Object.fromEntries(
      Object.entries(newActivity).filter(([key]) =>
        !this.guarded.includes(key) && this.fillable.includes(key),
      ),
    ) as NewActivity

    await this.mapCustomSetters(filteredValues)

    await DB.instance.updateTable('activities')
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

  async forceUpdate(activity: ActivityUpdate): Promise<ActivityModel | undefined> {
    if (this.id === undefined) {
      this.updateFromQuery.set(activity).execute()
    }

    await this.mapCustomSetters(activity)

    await DB.instance.updateTable('activities')
      .set(activity)
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
      throw new HttpError(500, 'Activity data is undefined')

    await this.mapCustomSetters(this.attributes)

    if (this.id === undefined) {
      await this.create(this.attributes)
    }
    else {
      await this.update(this.attributes)
    }

    this.hasSaved = true
  }

  fill(data: Partial<ActivityType>): ActivityModel {
    const filteredValues = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        !this.guarded.includes(key) && this.fillable.includes(key),
      ),
    ) as NewActivity

    this.attributes = {
      ...this.attributes,
      ...filteredValues,
    }

    return this
  }

  forceFill(data: Partial<ActivityType>): ActivityModel {
    this.attributes = {
      ...this.attributes,
      ...data,
    }

    return this
  }

  // Method to delete (soft delete) the activity instance
  async delete(): Promise<ActivitiesTable> {
    if (this.id === undefined)
      this.deleteFromQuery.execute()

    if (this.softDeletes) {
      return await DB.instance.updateTable('activities')
        .set({
          deleted_at: sql.raw('CURRENT_TIMESTAMP'),
        })
        .where('id', '=', this.id)
        .execute()
    }

    return await DB.instance.deleteFrom('activities')
      .where('id', '=', this.id)
      .execute()
  }

  async getLikeCount(): Promise<number> {
    const result = await DB.instance
      .selectFrom('likes')
      .select('count(*) as count')
      .where('activity_id', '=', this.id)
      .executeTakeFirst()

    return Number(result?.count) || 0
  }

  async likes(): Promise<number> {
    return this.getLikeCount()
  }

  async like(userId: number): Promise<void> {
    const authUserId = userId || 1

    await DB.instance
      .insertInto('likes')
      .values({
        activity_id: this.id,
        user_id: authUserId,
      })
      .execute()
  }

  async unlike(userId: number): Promise<void> {
    const authUserId = userId || 1
    await DB.instance
      .deleteFrom('likes')
      .where('activity_id', '=', this.id)
      .where('user_id', '=', authUserId)
      .execute()
  }

  async isLiked(userId: number): Promise<boolean> {
    const authUserId = userId || 1

    const like = await DB.instance
      .selectFrom('likes')
      .select('id')
      .where('activity_id', '=', this.id)
      .where('user_id', '=', authUserId)
      .executeTakeFirst()

    return !!like
  }

  distinct(column: keyof ActivityType): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.select(column).distinct()

    this.hasSelect = true

    return this
  }

  static distinct(column: keyof ActivityType): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.select(column).distinct()

    instance.hasSelect = true

    return instance
  }

  join(table: string, firstCol: string, secondCol: string): ActivityModel {
    this.selectFromQuery = this.selectFromQuery.innerJoin(table, firstCol, secondCol)

    return this
  }

  static join(table: string, firstCol: string, secondCol: string): ActivityModel {
    const instance = new ActivityModel(null)

    instance.selectFromQuery = instance.selectFromQuery.innerJoin(table, firstCol, secondCol)

    return instance
  }

  toJSON(): Partial<ActivityJsonResponse> {
    const output: Partial<ActivityJsonResponse> = {

      id: this.id,
      title: this.title,
      description: this.description,
      address: this.address,
      latlng: this.latlng,
      info_source: this.info_source,
      were_detained: this.were_detained,

      created_at: this.created_at,

      updated_at: this.updated_at,

      deleted_at: this.deleted_at,

      ...this.customColumns,
    }

    return output
  }

  parseResult(model: ActivityModel): ActivityModel {
    for (const hiddenAttribute of this.hidden) {
      delete model[hiddenAttribute as keyof ActivityModel]
    }

    return model
  }
}

async function find(id: number): Promise<ActivityModel | undefined> {
  const query = DB.instance.selectFrom('activities').where('id', '=', id).selectAll()

  const model = await query.executeTakeFirst()

  if (!model)
    return undefined

  return new ActivityModel(model)
}

export async function count(): Promise<number> {
  const results = await ActivityModel.count()

  return results
}

export async function create(newActivity: NewActivity): Promise<ActivityModel> {
  const result = await DB.instance.insertInto('activities')
    .values(newActivity)
    .executeTakeFirstOrThrow()

  return await find(Number(result.numInsertedOrUpdatedRows)) as ActivityModel
}

export async function rawQuery(rawQuery: string): Promise<any> {
  return await sql`${rawQuery}`.execute(DB.instance)
}

export async function remove(id: number): Promise<void> {
  await DB.instance.deleteFrom('activities')
    .where('id', '=', id)
    .execute()
}

export async function whereTitle(value: string): Promise<ActivityModel[]> {
  const query = DB.instance.selectFrom('activities').where('title', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ActivityModel) => new ActivityModel(modelItem))
}

export async function whereDescription(value: string): Promise<ActivityModel[]> {
  const query = DB.instance.selectFrom('activities').where('description', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ActivityModel) => new ActivityModel(modelItem))
}

export async function whereAddress(value: string): Promise<ActivityModel[]> {
  const query = DB.instance.selectFrom('activities').where('address', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ActivityModel) => new ActivityModel(modelItem))
}

export async function whereLatlng(value: string): Promise<ActivityModel[]> {
  const query = DB.instance.selectFrom('activities').where('latlng', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ActivityModel) => new ActivityModel(modelItem))
}

export async function whereInfoSource(value: string[]): Promise<ActivityModel[]> {
  const query = DB.instance.selectFrom('activities').where('info_source', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ActivityModel) => new ActivityModel(modelItem))
}

export async function whereWereDetained(value: boolean): Promise<ActivityModel[]> {
  const query = DB.instance.selectFrom('activities').where('were_detained', '=', value)
  const results = await query.execute()

  return results.map((modelItem: ActivityModel) => new ActivityModel(modelItem))
}

export const Activity = ActivityModel

export default Activity
