import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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


  public static horasPeriodo() {

    try {
      const data_inicio = new Date('2024-01-01')
      const data_fim = new Date('2024-12-01')

      let n = 0
      let meses = 0

      if (data_fim.getFullYear() > data_inicio.getFullYear()) {
        const m2 = data_fim.getMonth() + 1
        const m1 = 12 - (data_inicio.getMonth() + 1)
        meses = m1 + m2
      }

      if (data_fim.getFullYear() == data_inicio.getFullYear()) {
        const m2 = (data_fim.getMonth() + 1)
        const m1 = (data_inicio.getMonth() + 1)
        if ((data_inicio.getMonth() + 1) == 1 && (data_fim.getMonth() + 1) == 12) {
          meses = 12
        } else {
          meses = m2 - m1
        }
        if ((data_inicio.getMonth() + 1) == (data_fim.getMonth() + 1)) {
          meses = 1
        }
      }
      const anoAtual = new Date().getFullYear()
      let mesAnoInicio = (data_inicio.getMonth() + 1)
      let mesAnoFim = (data_fim.getMonth() + 1) / (data_fim.getMonth() + 1)
      let dias = 0
      for (let index = 1; index <= meses; index++) {

        if ((data_inicio.getMonth() + 1) <= 12 && data_inicio.getFullYear() == anoAtual) {
          dias = dias + new Date(anoAtual, mesAnoInicio, 0).getDate()
          // for (let i = 0; i < meses; i++) {         

          // }
          mesAnoInicio++
        }

        

        if (mesAnoFim <= (data_fim.getMonth() + 1) && data_inicio.getFullYear() < anoAtual && data_fim.getFullYear() == anoAtual) {
          dias = dias + new Date(anoAtual, mesAnoFim, 0).getDate()
          // for (let i = 0; i < meses; i++) {         

          // }
          mesAnoFim++
        }



        n++

      }
      return dias


    } catch (error) {
      console.log(error);
      return error
    }

  }
}
