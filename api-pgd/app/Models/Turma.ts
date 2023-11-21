import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Turma extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public descricao: string

  @column()
  public inicio_inscricao: string

  @column()
  public termino_inscricao: string

  @column()
  public status: number

  @column()
  public projeto_id: number

  @column()
  public dias_horarios: string

  @column()
  public edital_id: number

  @column()
  public conteudo_programatico: string

  @column()
  public carga_horaria: string

  @column()
  public certificados_liberados: boolean

  @column()
  public inicio_periodo: string

  @column()
  public termino_periodo: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
