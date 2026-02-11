import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Item from './item.js'

export default class Compra extends BaseModel {
  public static table = 'compras'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'item_id', serializeAs: 'item_id' })
  declare itemId: number

  @column({ columnName: 'comprador_github_login', serializeAs: 'comprador_github_login' })
  declare compradorGithubLogin: string

  @belongsTo(() => Item, {
    foreignKey: 'itemId',
  })
  declare item: BelongsTo<typeof Item>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}