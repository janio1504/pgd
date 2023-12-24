import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Atividade extends BaseModel {

  public static connection = 'pg'

  @column({ isPrimary: true })
  public atividade_id: number

  @column()
  public descricao_atividade: string

  @column()
  public data_inicio: DateTime

  @column()
  public data_fim: DateTime

  @column()
  public horas_atividade: string

  @column()
  public plano_trabalho_id: number

  @column()
  public meta_plano_entrega_id: number

  @column()
  public obs_atividade: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
