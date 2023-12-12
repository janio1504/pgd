import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Plano extends BaseModel {

  public static connection = 'pg'
  
  @column({ isPrimary: true })
  public plano_id: number

  @column()
  public nome_plano: string

  @column()
  public descricao_plano: string

  @column()
  public data_cadastro_plano: string

  @column()
  public plano_superior_id: number

  @column()
  public unidade_id: number

  @column()
  public servidor_id: number

  @column()
  public tipo_plano_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
