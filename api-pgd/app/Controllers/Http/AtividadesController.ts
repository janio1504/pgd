// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Atividade from "App/Models/Atividade"
import Servidor from "App/Models/Servidor";

export default class AtividadesController {


    public async getAtividades({ params }){
        try {
            const resAtividades = await Database
            .connection('pg')
            .query()
            .select('a.*','mpe.titulo as titulo_meta', 'pt.servidor_id')
            .from('atividades as a')
            .innerJoin('plano_trabalho as pt', 'a.plano_trabalho_id', 'pt.plano_trabalho_id')
            .leftJoin('meta_plano_entrega as mpe', 'a.meta_plano_entrega_id', 'mpe.meta_plano_entrega_id')
            .where('a.plano_trabalho_id',params.id)
            
            const atividades = resAtividades.map(async atividade=>{
                const servidor = await Servidor.servidor(atividade.servidor_id)
                const rs = {
                    ...atividade,
                    servidor: servidor[0]
                }
                return rs
            })

            

            return Promise.all(atividades)
        } catch (error) {
            console.log(error);
            
        }
    }

    public async getAtividade({ params }){
        try {
            const atividade = await Atividade
            .query()
            .where('atividade_id',params.id)

            return atividade
        } catch (error) {
            console.log(error);
            
        }
    }

    public async createAtividade({ request }) {
        const { 
              titulo_atividade
            , descricao_atividade
            , data_inicio
            , data_fim
            , horas_atividade
            , plano_trabalho_id
            , meta_plano_entrega_id
            , percentual_meta
            , obs_atividade } = request.all()
        try {
            
            const atividade = new Atividade()
            atividade.titulo_atividade = titulo_atividade
            atividade.descricao_atividade = descricao_atividade
            atividade.data_inicio = data_inicio
            atividade.data_fim = data_fim
            atividade.horas_atividade = horas_atividade
            atividade.plano_trabalho_id = plano_trabalho_id
            atividade.meta_plano_entrega_id = meta_plano_entrega_id
            atividade.percentual_meta = percentual_meta
            atividade.obs_atividade = obs_atividade
            await atividade.save()

            return "Tarefa criada com sucesso!"
        } catch (error) {
            console.log(error);

        }


    }

    public async updateAtividade({ request, response }) {
        const { atividade_id
            , titulo_atividade
            , descricao_atividade
            , data_inicio
            , data_fim
            , percentual_meta
            , horas_atividade
            , plano_trabalho_id
            , meta_plano_entrega_id
            , obs_atividade } = request.all()
        try {
            
            const atividade = await Atividade.findByOrFail('atividade_id', atividade_id)
            atividade.titulo_atividade = titulo_atividade ? titulo_atividade : atividade.titulo_atividade
            atividade.descricao_atividade = descricao_atividade ? descricao_atividade : atividade.descricao_atividade
            atividade.data_inicio = data_inicio ? data_inicio : atividade.data_inicio
            atividade.data_fim = data_fim ? data_fim : atividade.data_fim
            atividade.percentual_meta = percentual_meta ? percentual_meta : atividade.percentual_meta
            atividade.horas_atividade = horas_atividade ? horas_atividade : atividade.horas_atividade
            atividade.plano_trabalho_id = plano_trabalho_id ? plano_trabalho_id : atividade.plano_trabalho_id
            atividade.meta_plano_entrega_id = meta_plano_entrega_id ? meta_plano_entrega_id : atividade.meta_plano_entrega_id
            atividade.obs_atividade = obs_atividade

            await atividade.save()

            return response.send("Tarefa atualizada com sucesso!")
        } catch (error) {
            console.log(error);

        }


    }

    public async destroy({ params }) {
        try {
            await Database
                .connection('pg')
                .from('atividades')
                .where('atividade_id', params.id)
                .delete()
            return "tarefa removida com sucesso!"
        } catch (error) {
            console.log(error);

        }
    }
}
