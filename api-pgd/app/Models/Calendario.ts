import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Calendario extends BaseModel {


  public static connection = 'pg'

  public static table = 'feriados'

  @column({ isPrimary: true })
  public feriado_id: number

  @column()
  public descricao: string

  @column()
  public tipo_feriado_id: number

  @column()
  public data: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  public static tipoFeriado(id) {
    let tipo = ''
    switch (id) {
      case 1:
        tipo = "Nacional"
        break;
      case 2:
        tipo = "Estadual"
        break;
      case 2:
        tipo = "Municipal"
        break;

      default:
        break;
    }
    return tipo
  }
}
