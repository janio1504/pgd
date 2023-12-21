import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PlanoEntrega extends BaseModel {

  public static connection = 'pg'
  
  @column({ isPrimary: true })
  public plano_entrega_id: number

  @column()
  public nome_plano_entrega: string

  @column()
  public unidade_id: number

  @column()
  public data_inicio: DateTime

  @column()
  public data_fim: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
