import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CalendarioFeriados extends BaseModel {


  public static connection = 'pg'

  public static table = 'calendario_feriados'

  @column({ isPrimary: true })
  public calendario_feriado_id: number

  @column()
  public data_feriado: string

  @column()
  public horas: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
