// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from "App/Models/Atividade"

export default class AtividadesController {


    public async getAtividades({ params }){
        try {
            const atividades = await Atividade
            .query()
            .where('plano_trabalho_id',params.id)

            return atividades
        } catch (error) {
            console.log(error);
            
        }
    }

    public async createAtividade({ request }) {
        const { descricao_atividade
            , data_inicio
            , data_fim
            , horas_atividade
            , plano_trabalho_id
            , meta_plano_entrega_id
            , obs_atividade } = request.all()
        try {
            
            const atividade = new Atividade()

            atividade.descricao_atividade = descricao_atividade
            atividade.data_inicio = data_inicio
            atividade.data_fim = data_fim
            atividade.horas_atividade = horas_atividade
            atividade.plano_trabalho_id = plano_trabalho_id
            atividade.meta_plano_entrega_id = meta_plano_entrega_id
            atividade.obs_atividade = obs_atividade
            await atividade.save()

        } catch (error) {
            console.log(error);

        }


    }

    public async updateAtividade({ request }) {
        const { atividade_id
            , descricao_atividade
            , data_inicio
            , data_fim
            , horas_atividade
            , plano_trabalho_id
            , meta_plano_entrega_id
            , obs_atividade } = request.all()
        try {
            
            const atividade = await Atividade.findByOrFail('atividade_id', atividade_id)

            atividade.descricao_atividade = descricao_atividade ? descricao_atividade : atividade.descricao_atividade
            atividade.data_inicio = data_inicio ? data_inicio : atividade.data_inicio
            atividade.data_fim = data_fim ? data_fim : atividade.data_fim
            atividade.horas_atividade = horas_atividade ? horas_atividade : atividade.horas_atividade
            atividade.plano_trabalho_id = plano_trabalho_id ? plano_trabalho_id : atividade.plano_trabalho_id
            atividade.meta_plano_entrega_id = meta_plano_entrega_id ? meta_plano_entrega_id : atividade.meta_plano_entrega_id
            atividade.obs_atividade = obs_atividade
            await atividade.save()

        } catch (error) {
            console.log(error);

        }


    }
}
