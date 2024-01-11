// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Plano from "App/Models/PlanoTrabalho";
import Servidor from "App/Models/Servidor";
import Situacao from "App/Models/Situacao";

export default class PlanoTrabalhoController {

    public async getPlanosTrabalho({ auth }) {

        try {

            const rsServidor = await Servidor.servidorAuth(auth.user.id)

            const planos = await Database
                .connection('pg')
                .query()
                .select('p.*')
                .from('plano_trabalho as p')
                .where('p.servidor_id', rsServidor.id_servidor)
                .orderBy('p.plano_trabalho_id', "desc")





            return planos
        } catch (error) {
            console.log(error);

        }
    }

    public async getPlanoTrabalho({ params }) {
        try {
            const plano = await Database
                .connection('pg')
                .query()
                .select('p.*', 'pe.servidor_id')
                .from('plano_trabalho as p')
                .innerJoin('plano_entregas as pe', 'p.plano_entrega_id', 'pe.plano_entrega_id')
                .where('p.plano_trabalho_id', params.id)

            const servidor = await Servidor.servidor(plano[0].servidor_id)

            const rs = {
                servidor: servidor.nome_pessoa,
                ...plano[0],
                situacao: Situacao.situacao(plano[0].situacao_id)
            }

            return rs
        } catch (error) {
            console.log(error);

        }
    }

    public async updatePlanoTrabalho({ request, response }) {

        const { plano_trabalho_id
            , nome_plano_trabalho
            , plano_entrega_id
            , data_inicio
            , data_fim
            , percentual_atividade_nao_vinculadas
            , situacao_id } = request.all()
        try {

            const rsPlano = await Database
                .connection('pg')
                .query()
                .from('plano_trabalho as p')
                .where('p.plano_trabalho_id', plano_trabalho_id)


            await Database
                .connection('pg')
                .from('plano_trabalho')
                .where('plano_trabalho_id', plano_trabalho_id)
                .update({
                    nome_plano_trabalho: nome_plano_trabalho ? nome_plano_trabalho : rsPlano[0].nome_plano_trabalho,
                    plano_entrega_id: plano_entrega_id ? plano_entrega_id : rsPlano[0].plano_entrega_id,
                    data_inicio: data_inicio ? data_inicio : rsPlano[0].data_inicio,
                    data_fim: data_fim ? data_fim : rsPlano[0].data_fim,
                    percentual_atividade_nao_vinculadas: percentual_atividade_nao_vinculadas ? percentual_atividade_nao_vinculadas : rsPlano[0].percentual_atividade_nao_vinculadas,
                    situacao_id: situacao_id ? situacao_id : rsPlano[0].situacao_id
                })

            return response.status(200).send('Atualização realizada com sucesso!')
        } catch (error) {
            console.log(error);

        }
    }


    public async createPlanoTrabalho({ request, response }) {
        const { nome_plano_trabalho
            , plano_entrega_id
            , data_inicio
            , data_fim
            , servidor_id
            , percentual_atividade_nao_vinculadas } = request.all()
        try {

            if (!nome_plano_trabalho) {
                throw response.status(400).send("O campo nome plano de trabalho é obrigatório!")
            }

            if (!plano_entrega_id) {
                throw response.status(400).send("O campo plano entrega é obrigatório!")
            }

            if (!data_inicio) {
                throw response.status(400).send("O campo data de inicio é obrigatório!")
            }

            if (!servidor_id) {
                throw response.status(400).send("O campo servidor é obrigatório!")
            }

            const pt = await Database
                .connection('pg')
                .query()
                .from('plano_trabalho as p')
                .where('p.plano_entrega_id', plano_entrega_id)
                .where('p.servidor_id', servidor_id)
                .whereIn('p.situacao_id', [1, 2, 4])
                .orderBy('p.plano_trabalho_id', 'desc')

            if (pt.length > 0) {
                throw response.status(400).send('Já existe um plano de trabalho cadastrado ativo ou em analise para o servidor!')
            }


            // const participante = await Database
            //     .connection('pg')
            //     .query()
            //     .from('participante as p')
            //     .where('p.plano_entrega_id', plano_entrega_id)           


            // if (participante.length < 0) {
            //     throw response.status(400).send('O servidor não esta indicado para o plano de entrega!')
            // }

            await Database
                .connection('pg')
                .insertQuery()
                .table('plano_trabalho')
                .insert({
                    nome_plano_trabalho: nome_plano_trabalho,
                    plano_entrega_id: plano_entrega_id,
                    data_inicio: data_inicio,
                    data_fim: data_fim,
                    servidor_id: servidor_id,
                    percentual_atividade_nao_vinculadas: percentual_atividade_nao_vinculadas,
                    situacao_id: 4
                })

            return response.send('Plano de trabalho criado com sucesso!')
        } catch (error) {

            console.log(error);
            return error

        }


    }

    public async destroy({ params }) {
        try {
            const plano = await Plano.findByOrFail('plano_trabalho_id', params.id)
            await plano.delete()
            return "O Plano " + plano.nome_plano_trabalho + " foi remvido definitivamente"
        } catch (error) {
            console.log(error);

        }
    }
}
