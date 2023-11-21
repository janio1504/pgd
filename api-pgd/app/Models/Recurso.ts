import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Recurso extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public recurso: string

  @column()
  public resposta: string

  @column()
  public arquivo_id: number

  @column()
  public status_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
