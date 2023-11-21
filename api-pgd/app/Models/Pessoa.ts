import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Pessoa extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public cpf: string

  @column()
  public rg: string

  @column()
  public telefone: string

  @column()
  public endereco: string

  @column()
  public bairro: string

  @column()
  public numero: string

  @column()
  public municipio: string

  @column()
  public uf: string

  @column()
  public email: string

  @column()
  public rg_frente_id: number

  @column()
  public rg_verso_id: number

  @column()
  public comprovante_endereco_id: number

  @column()
  public titulo_eleitor_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
