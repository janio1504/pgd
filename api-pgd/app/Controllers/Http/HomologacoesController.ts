// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import Servidor from "App/Models/Servidor"
import Situacao from "App/Models/Situacao"

export default class HomologacoesController {

    public async createHomologacaoPlanoEntrega({ request, response }) {
        const { plano_entrega_id } = request.all()

        try {

            if (!plano_entrega_id) {
                throw response.status(400).send('O campo unidade é obrigatório!')
            }

            const pe = await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.plano_entrega_id', plano_entrega_id)


            const unidade_superior_id = await this.unidadeSuperior(pe[0].unidade_id)


            await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.plano_entrega_id', plano_entrega_id)
                .update({
                    unidade_superior_id: unidade_superior_id,
                    situacao_id: 2
                })

            return response.send('O plano foi enviado para homologação.')
        } catch (error) {
            console.log(error);

            return error
        }
    }

    public async homologarPlanoEntrega({ request, response, auth }) {
        const { plano_entrega_id } = request.all()
        try {
            if (!plano_entrega_id) {
                throw response.status(400).send('O campo homologacao_plano_entrega_id é obrigatório.')
            }

            const servidor = await Servidor.servidorAuth(auth.user.id)

            const isChefe = await this.isChefe(servidor.id_servidor, servidor.id_unidade)

            if (!isChefe) {
                return
            }

            await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.plano_entrega_id', plano_entrega_id)
                .update({
                    situacao_id: 1,
                    data_homologacao: new Date().toLocaleDateString('pt-br', { timeZone: 'America/Belem' }),
                    servidor_id: servidor.servidor_id
                })
            return response.send('Homologação realizada com sucesso!')
        } catch (error) {
            console.log(error);

            return error
        }

    }


    public async createHomologacaoPlanoTrabalho({ request, response }) {
        const { plano_trabalho_id, criterio_avaliacao } = request.all()

        try {

            if (!plano_trabalho_id) {
                throw response.status(400).send('O plano de trabalho é obrigatório!')
            }

            await Database
                .connection('pg')
                .from('plano_trabalho as p')
                .where('p.plano_trabalho_id', plano_trabalho_id)
                .update({
                    situacao_id: 2,
                    criterio_avaliacao: criterio_avaliacao
                })

            return response.send('O plano foi enviado para homologação.')
        } catch (error) {
            console.log(error);
            return error
        }
    }




    public async homologarPlanoTrabalho({ request, response, auth }) {
        const { plano_trabalho_id } = request.all()
        try {
            if (!plano_trabalho_id) {
                throw response.status(400).send('O plano trabalho é obrigatório.')
            }

            const servidor = await Servidor.servidorAuth(auth.user.id)

            const isChefe = await this.isChefe(servidor.id_servidor, servidor.id_unidade)

            if (!isChefe) {
                return
            }

            await Database
                .connection('pg')
                .from('plano_trabalho as p')
                .where('p.plano_trabalho_id', plano_trabalho_id)
                .update({
                    situacao_id: 1,
                    data_homologacao: new Date().toLocaleDateString('pt-br', { timeZone: 'America/Belem' }),
                    homologador_id: servidor.servidor_id
                })
            return response.send('Homologação realizada com sucesso!')
        } catch (error) {
            console.log(error);

            return error
        }

    }

    public async getPlanosDeEntregaParaHomologar({ auth }) {
        try {


            const servidor = await Servidor.servidorAuth(auth.user.id)

            const isChefe = await this.isChefe(servidor.id_servidor, servidor.id_unidade)

            if (!isChefe) {
                return
            }


            const psh = await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.unidade_superior_id', servidor.id_unidade)
                .whereIn('p.situacao_id', [2, 3, 4])


            const planos = psh.map(async plano => {

                const unidade = await Database
                    .from('comum.unidade as u')
                    .where('u.id_unidade', plano.unidade_id)

                const situacao = Situacao.situacao(plano.situacao_id)

          
                const rs = {
                    plano_entrega_id: plano.plano_entrega_id,
                    unidade_id: plano.unidade_id,
                    nome_plano_entrega: plano.nome_plano_entrega,
                    nome_unidade: unidade[0].nome,
                    situacao: situacao,
                    observacao: plano.observacao,
                }

                return rs
            })

            return Promise.all(planos)
        } catch (error) {
            return error
        }
    }


    public async getPlanosTrabalhoParaHomologar({ auth }) {

        try {

            const servidor = await Servidor.servidorAuth(auth.user.id)

            const isChefe = await this.isChefe(servidor.id_servidor, servidor.id_unidade)

            if (!isChefe) {
                return
            }

            const planos = await Database
                .connection('pg')
                .query()
                .select('p.*', 's.descricao as situacao', 'pe.nome_plano_entrega', 'pe.data_inicio as data_inicio_plano_entrega',
                'pe.data_fim as data_fim_plano_entrega')
                .from('plano_trabalho as p')
                .innerJoin('plano_entrega as pe','p.plano_entrega_id', 'pe.plano_entrega_id')
                .innerJoin('situacao as s ', 'p.situacao_id', 's.id')
                .where('pe.unidade_id', servidor.id_unidade)
                .where('p.situacao_id', 2)
                .orderBy('p.plano_trabalho_id', "desc")

                const rsPlanos = await planos.map(plano=>{
                    const rs = {
                        ...plano,
                        situacao: Situacao.situacao(plano.situacao_id)
                    }
                    return rs
                })
            return rsPlanos
        } catch (error) {
            console.log(error);

        }
    }

    public async isChefe(servidor_id, unidade_id) {
        try {

            const isChefe = await Database
                .query()
                .from('rh.servidor as s')
                .join('comum.responsavel_unidade as ru', 's.id_servidor', 'ru.id_servidor')
                .where('s.id_servidor', servidor_id)
                .where('ru.id_unidade', unidade_id)
                .whereNull('s.data_desligamento')
                .whereNull('ru.data_fim')
                .whereIn('ru.nivel_responsabilidade', ['C', 'V'])

            return isChefe.length > 0 ? true : false

        } catch (error) {
            console.log(error);

        }
    }




    public async unidadeSuperior(id) {
        try {
            const hierarquia = await Database
                .from('comum.unidade as u')
                .select('u.hierarquia')
                .where('u.id_unidade', id)

            let hu = ''

            hierarquia.map(hierarquia => {
                hu = hierarquia.hierarquia
            })
            const us = hu.split('.')
            const n = us.length - 3
            return us[n]
        } catch (error) {
            console.log(error);
        }
    }
}
