// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from "App/Models/Atividade"

export default class AtividadesController {

    public async createAtividade({ request }) {
        const { descricao_atividade
            , data_cadastro_atividade
            , observacao_atividade
            , complexidade_id
            , plano_id } = request.all()
        try {
            const atividade = new Atividade()

            atividade.descricao_atividade = descricao_atividade
            atividade.data_cadastro_atividade = data_cadastro_atividade
            atividade.observacao_atividade = observacao_atividade
            atividade.complexidade_id = complexidade_id
            atividade.plano_id = plano_id
            await atividade.save()

        } catch (error) {
            console.log(error);

        }


    }
}
