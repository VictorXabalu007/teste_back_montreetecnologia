import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Compra from './compra.js'

export default class Item extends BaseModel {
  public static table = 'itens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare preco: number

  @column({ columnName: 'qtd_atual', serializeAs: 'qtd_atual' })
  declare qtdAtual: number

  @hasMany(() => Compra, {
    foreignKey: 'itemId',
  })
  declare compras: HasMany<typeof Compra>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}