import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class api_tokens extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user: string

  @column({ serializeAs: null })
  public senha: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public expiresAt: DateTime

  @beforeSave()
  public static async hashPassword (apiTokens: api_tokens) {
    if (apiTokens.$dirty.password) {
      apiTokens.senha = await Hash.make(apiTokens.senha)
    }
  }
}
