import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public user: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public ativo: boolean

  @column()
  public pessoa_id: number

  @column()
  public tipo_user_id: string

  @column()
  public rememberMeToken?: string

  @column()
  public token: null | string

  @column()
  public tokenCreatedAt: null | Date 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
    

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
