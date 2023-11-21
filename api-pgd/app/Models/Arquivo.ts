import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Arquivo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public field_name: string

  @column()
  public client_name: string

  @column()
  public tipo_documento_id: number

  @column()
  public type: string

  @column()
  public subtype: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
