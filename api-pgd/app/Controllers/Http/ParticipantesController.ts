// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"

export default class ParticipantesController {
    public async createParticipante({ request, response }) {
        const { servidor_id, unidade_id, data_inicio_participacao, data_fim_participacao, modalidade_id } = request.all()
        try {
            await Database
                .connection('pg')
                .table('participante')
                .insert({
                    servidor_id: servidor_id,
                    unidade_id: unidade_id,
                    data_inicio_participacao: data_inicio_participacao,
                    data_fim_participacao: data_fim_participacao,
                    situacao: true,
                    modalidade_id: modalidade_id,
                })

            return response.send('Participante cadastrado com sucesso!')
        } catch (error) {
            console.log(error);
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
                    situacao: situacao ? situacao : rsParticipante[0].situacao,
                    modalidade_id: modalidade_id ? modalidade_id : rsParticipante[0].modalidade_id,
                    sistema_externo: sistema_externo ? sistema_externo : rsParticipante[0].sistema_externo
                })

            return response.status(200).send('Atualização realizada com sucesso!')
        } catch (error) {
            return error
        }
    }
}
