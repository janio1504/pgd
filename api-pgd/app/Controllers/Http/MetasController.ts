// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Servidor from "App/Models/Servidor";

export default class MetasController {
    public async createMeta({ request }) {
        const { titulo, indicador, meta, prazo, demandante, destinatario, alinhamento_estrategico, plano_entrega_id } = request.all()
        try {

            const plano = await Database
                .connection('pg')
                .insertQuery()
                .table('meta_plano_entrega')
                .insert({
                    titulo: titulo,
                    indicador: indicador,
                    meta: meta,
                    prazo: prazo,
                    demandante: demandante,
                    destinatario: destinatario,
                    alinhamento_estrategico: alinhamento_estrategico,
                    plano_entrega_id: plano_entrega_id
                })

            return plano
        } catch (error) {

            console.log(error);
            return error

        }
    }

    public async getMetas({ params }) {

        try {
            const entregas = await Database
                .connection('pg')
                .query()
                .from('meta_plano_entrega as m')
                .where('m.plano_entrega_id', params.id)
                .orderBy('m.meta_plano_entrega_id', "desc")

            const entregasAtividades = entregas.map(async entrega => {

                const atividades = await Database
                    .connection('pg')
                    .query()
                    .select('a.*', 'p.servidor_id')
                    .from('atividades as a')
                    .innerJoin('plano_trabalho as p', 'a.plano_trabalho_id', 'p.plano_trabalho_id')
                    .where('a.meta_plano_entrega_id', entrega.meta_plano_entrega_id)
                    .orderBy('a.atividade_id', "desc") 
                    
                const servidor = await Servidor.servidor(atividades[0].servidor_id)

                const rs = {
                   servidor: servidor,
                    ...entrega,
                    atividades: atividades
                }
                return rs

            })

            return Promise.all(entregasAtividades)
        } catch (error) {
            console.log(error);

        }
    }

    public async getMeta({ params }) {

        try {
            const entrega = await Database
                .connection('pg')
                .query()
                .from('meta_plano_entrega as m')
                .where('m.meta_plano_entrega_id', params.id)


                const entregaAtividades = entrega.map(async entrega => {

                    const atividades = await Database
                        .connection('pg')
                        .query()
                        .from('atividades as a')
                        .where('a.meta_plano_entrega_id', entrega.meta_plano_entrega_id)
                        .orderBy('a.atividade_id', "desc")
    
                    const rs = {
                        ...entrega,
                        atividades: atividades
                    }
                    return rs
    
                })

            return Promise.all(entregaAtividades)
        } catch (error) {
            console.log(error);

        }
    }

    public async updateMeta({ request }) {

        const { meta_plano_entrega_id, titulo, indicador, meta, prazo, demandante, destinatario, alinhamento_estrategico } = request.all()
        try {
            const plano = await Database
                .connection('pg')
                .from('meta_plano_entrega')
                .where('meta_plano_entrega_id', meta_plano_entrega_id)
                .update({
                    titulo: titulo,
                    indicador: indicador,
                    meta: meta,
                    prazo: prazo,
                    demandante: demandante,
                    destinatario: destinatario,
                    alinhamento_estrategico: alinhamento_estrategico
                })

            return plano
        } catch (error) {
            console.log(error);

        }
    }

    public async destroy({ params }) {
        try {
            await Database
                .connection('pg')
                .from('meta_plano_entrega')
                .where('meta_plano_entrega_id', params.id)
                .delete()
            return "Meta removida com sucesso!"
        } catch (error) {
            console.log(error);

        }
    }
}
