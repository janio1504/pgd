import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Certificado extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pessoa_id: number

  @column()
  public turma_id: number

  @column()
  public ativo: boolean

  @column()
  public token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
