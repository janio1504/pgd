// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import Situacao from "App/Models/Situacao"

export default class HomologacoesController {

    public async createHomologacaoPlanoTrabalho({ request, response }) {
        const { plano_trabalho_id } = request.all()

        try {

            if (!plano_trabalho_id) {
                throw response.status(400).send('O plano de trabalho é obrigatório!')
            }            

            await Database
                .connection('pg')
                .from('plano_entregas as p')
                .where('p.plano_trabalho_id', plano_trabalho_id)
                .update({
                    situacao_id: 2
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
                throw response.status(400).send('O campo homologacao_plano_trabalho_id é obrigatório.')
            }

            const servidor = await Database
                .query()
                .select('s.id_servidor', 'p.id_pessoa', 'p.nome as nome_pessoa', 's.id_unidade', 's.siape', 'un.nome as lotacao')
                .from('rh.servidor as s')
                .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
                .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
                .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
                .where('u.id_usuario', auth.user.id)

            const isChefe = await this.isChefe(servidor[0].id_servidor, servidor[0].id_unidade)

            if (!isChefe) {
                return
            }

            const pT = await Database
                .connection('pg')
                .from('plano_trabalho as p')
                .where('p.plano_trabalho_id', plano_trabalho_id)
                .whereIn('p.situacao_id', [1])

            if(pT.length > 0){
                throw response.status(400).send('O plano de trabalho já esta homologado.') 
            }

            await Database
                .connection('pg')
                .from('plano_trabalho as p')
                .where('p.plano_trabalho_id', plano_trabalho_id)
                .update({
                    situacao_id: 1,
                    data_homologacao: new Date().toLocaleDateString('pt-br', { timeZone: 'America/Belem' }),
                    homologador_id: servidor[0].id_servidor
                })
            return response.send('Homologação realizada com sucesso!')
        } catch (error) {
            console.log(error);

            return error
        }

    }

    public async getPlanosDeTrabalhoParaHomologar({ auth }) {
        try {


            const servidor = await Database
                .query()
                .select('s.id_servidor', 'p.id_pessoa', 'p.nome as nome_pessoa', 's.id_unidade', 's.siape', 'un.nome as lotacao')
                .from('rh.servidor as s')
                .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
                .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
                .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
                .where('u.id_usuario', auth.user.id)

            const isChefe = await this.isChefe(servidor[0].id_servidor, servidor[0].id_unidade)

            if (!isChefe) {
                return
            }


            const ph = await Database
                .connection('pg')
                .from('plano_trabalho as p')
                .where('p.unidade_id', servidor[0].id_unidade)
                .whereIn('p.situacao_id', [2, 3, 4])


            const planos = ph.map(async plano => {

                const unidade = await Database
                    .from('comum.unidade as u')
                    .where('u.id_unidade', plano.unidade_id)

                const situacao = Situacao.situacao(plano.situacao_id)

          
                const rs = {
                    plano_trabalho_id: plano.plano_trabalho_id,
                    nome_plano_trabalho: plano.nome_plano_trabalho,
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

}
