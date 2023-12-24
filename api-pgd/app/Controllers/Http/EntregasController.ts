// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Entrega from "App/Models/Entrega"

export default class EntregasController {
    public async createAtividade({ request }) {
        const { descricao
            , observacao
            , data_cadastro
            , horas
            , atividade_id } = request.all()
        try {
            const entrega = new Entrega()

            entrega.descricao = descricao
            entrega.observacao = observacao
            entrega.data_cadastro = data_cadastro
            entrega.horas = horas
            entrega.atividade_id = atividade_id
            await entrega.save()

        } catch (error) {
            console.log(error);

        }


    }
}
