import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PlanoTrabalho extends BaseModel {

  public static connection = 'pg'
  
  @column({ isPrimary: true })
  public plano_id: number

  @column()
  public nome_plano_trabalho: string

  @column()
  public servidor_id: number

  @column()
  public plano_entrega_id: number

  @column()
  public percentual_atividade_nao_vinculadas: string

  @column()
  public situacao_id: number

  @column.dateTime()
  public data_inicio: DateTime

  @column.dateTime()
  public data_fim: DateTime
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
