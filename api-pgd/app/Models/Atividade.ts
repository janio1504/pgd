import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Atividade extends BaseModel {
  @column({ isPrimary: true })
  public atividade_id: number

  @column()
  public descricao_atividade: string

  @column()
  public observacao_atividade: string

  @column()
  public data_cadastro_atividade: string

  @column()
  public complexidade_id: number

  @column()
  public plano_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
