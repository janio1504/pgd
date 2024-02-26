import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Calendario extends BaseModel {


  public static connection = 'pg'

  public static table = 'unidade_chefia'

  @column({ isPrimary: true })
  public id: number

  @column()
  public servidor_id: number

  @column()
  public unidade_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


}
