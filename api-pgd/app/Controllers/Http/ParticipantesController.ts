// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"

export default class ParticipantesController {
    public async createParticipante({ request, response }) {
        const { servidor_id, unidade_id, data_inicio_participacao, modalidade_id, plano_entrega_id } = request.all()


        try {

            const rsParticipante = await Database
                .connection('pg')
                .query()
                .from('participante as p')
                .where('p.servidor_id', servidor_id)
                .where('p.situacao', true)

            if (rsParticipante[0]) {
                throw response.status(400).send("Já existe cadastrado de participante ativo para o servidor!")
            }

            await Database
                .connection('pg')
                .table('participante')
                .insert({
                    servidor_id: servidor_id,
                    unidade_id: unidade_id,
                    data_inicio_participacao: data_inicio_participacao,
                    situacao: true,
                    modalidade_id: modalidade_id,
                    plano_entrega_id: plano_entrega_id
                })

            return response.send('Participante cadastrado com sucesso!')
        } catch (error) {
            console.log(error);
            return error
        }
    }

    public async getParticipantesUnidade({ params, response }) {
        try {
            if (!params.id) {
                throw response.status(400).send("O campo unidade é obrigatório!")
            }
            const rsParticipantes = await Database
                .connection('pg')
                .query()
                .from('participante as p')
                .where('p.unidade_id', params.id)

            const participantes = rsParticipantes.map(async participante => {


                const rsServidor = await Database
                    .query()
                    .select('p.nome as nome_pessoa', 's.siape', 'un.nome as lotacao')
                    .from('rh.servidor as s')
                    .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
                    .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
                    .where('s.id_servidor', participante.servidor_id)

                const rs = {
                    ...participante,
                    ...rsServidor[0]
                }

                return rs
            })
            return await Promise.all(participantes)

        } catch (error) {
            return error
        }
    }


    public async updateParticipante({ request, response }) {

        const { data_inicio_participacao, data_fim_participacao, modalidade_id, participante_id, sistema_externo, situacao } = request.all()
        try {

            const rsParticipante = await Database
                .connection('pg')
                .query()
                .from('participante as p')
                .where('p.participante_id', participante_id)


            if (!rsParticipante[0]) {
                throw response.status(400).send("Participante não encontrado ou não cadastrado")
            }

            await Database
                .connection('pg')
                .from('participante as p')
                .where('p.participante_id', participante_id)
                .update({
                    data_inicio_participacao: data_inicio_participacao ? data_inicio_participacao : rsParticipante[0].data_inicio_participacao,
                    data_fim_participacao: data_fim_participacao ? data_fim_participacao : rsParticipante[0].data_fim_participacao,
                    situacao: situacao == true ? situacao : false,
                    modalidade_id: modalidade_id ? modalidade_id : rsParticipante[0].modalidade_id,
                    sistema_externo: sistema_externo == true ? sistema_externo : false
                })

            return response.status(200).send('Atualização realizada com sucesso!')
        } catch (error) {
            return error
        }
    }

    public async removerParticipante({ request, response }) {

        const { participante_id } = request.all()
        try {

            const rsParticipante = await Database
                .connection('pg')
                .query()
                .from('participante as p')
                .where('p.participante_id', participante_id)
                .where('p.situacao', true)

            if (!rsParticipante[0]) {
                throw response.status(400).send("Participante não encontrado ou não cadastrado.")
            }

            await Database
                .connection('pg')
                .from('participante as p')
                .where('p.participante_id', participante_id)
                .update({
                    data_fim_participacao: new Date().toLocaleDateString('en-us'),
                    situacao: false,

                })

            return response.status(200).send('Atualização realizada com sucesso!')
        } catch (error) {
            return error
        }
    }

    public async destroy({ params }) {
        try {
            await Database
                .connection('pg')
                .from('participante')
                .where('participante_id', params.id)
                .delete()
            return "Partcipante removido com sucesso!"
        } catch (error) {
            console.log(error);

        }
    }
}
