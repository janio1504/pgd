import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Inscricoes extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public numero_inscricao: string

  @column()
  public justificativa: string

  @column()
  public pessoa_id: number

  @column()
  public turma_id: number

  @column()
  public status_id: number

  @column()
  public data_inscricao: string

  @column()
  public pre_requisito: string

  @column()
  public certificado: boolean

  @column()
  public pr_certificado_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
