// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";

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
            const metas = await Database
                .connection('pg')
                .query()
                .from('meta_plano_entrega as m')
                .where('m.plano_entrega_id', params.id)
                .orderBy('m.meta_plano_entrega_id', "desc")

            return metas
        } catch (error) {
            console.log(error);

        }
    }

    public async getMeta({ params }) {

        try {
            const metas = await Database
                .connection('pg')
                .query()
                .from('meta_plano_entrega as m')
                .where('m.meta_plano_entrega_id', params.id)

            return metas
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
