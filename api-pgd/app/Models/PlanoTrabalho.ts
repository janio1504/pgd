import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PlanoTrabalho extends BaseModel {

  public static connection = 'pg'
  public static table = 'plano_trabalho'

  @column({ isPrimary: true })
  public plano_trabalho_id: number

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


  public static async horasPeriodo(data_inicio?, data_fim?, carga_horaria?) {

    try {

      let dias = 0;

      data_inicio.setHours(0, 0, 0, 0);
      data_fim.setHours(0, 0, 0, 0);

      let current = new Date(data_inicio);
      current.setDate(current.getDate() + 1);
      let dia;

      while (current <= data_fim) {
        dia = current.getDay();

        if (dia >= 1 && dia <= 5) {
          ++dias;
        }
        current.setDate(current.getDate() + 1);
      }


      let horasDiarias = (carga_horaria / 5)

      const horasPorPeriodo = (dias * horasDiarias)

      const hfs = await Database.connection('pg').query().from('calendario_feriados').sum('horas as total').first()

      const ho = await Database.connection('pg').query().from('ocorrencias').sum('horas_ocorrencia as total').first()

      const horasFeriados = (hfs.total / 8) * horasDiarias

      const horasOcorrencias = (ho.total / 8) * horasDiarias

      return (horasPorPeriodo - horasFeriados) - horasOcorrencias


    } catch (error) {
      console.log(error);
      return error
    }

  }
}
