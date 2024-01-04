// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import Situacao from "App/Models/Situacao"

export default class HomologacoesController {

    public async createHomologacao({ request, response }) {
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


    public async homologarPlanoEntrega({ request, response }) {
        const { plano_entrega_id, servidor_id } = request.all()
        try {
            if (!plano_entrega_id) {
                throw response.status(400).send('O campo homologacao_plano_entrega_id é obrigatório.')
            }

            if (!servidor_id) {
                throw response.status(400).send('Nenhum servidor relacionado para a homologação.')
            }

            await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.plano_entrega_id', plano_entrega_id)
                .update({
                    situacao_id: 1,
                    data_homologacao: new Date().toLocaleDateString('pt-br', { timeZone: 'America/Belem' }),
                    servidor_id: servidor_id
                })
            return response.send('Homologação realizada com sucesso!')
        } catch (error) {
            console.log(error);

            return error
        }

    }

    public async getPlanosParaHomologar({ auth }) {
        try {


            const servidor = await Database
                .query()
                .select('s.id_servidor', 'p.id_pessoa', 'p.nome as nome_pessoa', 's.id_unidade_lotacao', 's.siape', 'un.nome as lotacao')
                .from('rh.servidor as s')
                .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
                .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
                .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
                .where('u.id_usuario', auth.user.id)

            const isChefe = await this.isChefe(servidor[0].id_servidor, servidor[0].id_unidade_lotacao)
          
            if (!isChefe) {
                return
            }

            const psh = await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.unidade_superior_id', servidor[0].id_unidade)
                .whereIn('p.situacao_id', [1, 2, 4])
            

            const planos = psh.map(async plano => {

                const unidade = await Database
                    .from('comum.unidade as u')
                    .where('u.id_unidade', plano.unidade_id)

                const situacao = Situacao.situacao(plano.situacao_id)

                const rs = {
                    homologacao_plano_entrega_id: plano.homologacao_plano_entrega_id,
                    nome_unidade: unidade[0].nome,
                    situacao: situacao,
                    observacao: plano.observacao
                }

                return rs
            })

            return Promise.all(planos)
        } catch (error) {
            return error
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
