import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class users extends BaseModel {

  public static connection = 'pg'

  @column({ isPrimary: true })
  public id: number

  @column()
  public login: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public is_admin: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (users: users) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
  }

  public static async isAdmin(user_id){
    try {
      const user = await users.findBy('id', user_id)
                  
      return user?.is_admin
    } catch (error) {
      console.log(error);      
    }
  }
}
