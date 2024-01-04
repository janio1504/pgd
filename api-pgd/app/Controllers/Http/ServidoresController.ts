// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";

export default class ServidoresController {
    public async getServidor({ auth }) {

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
            const rsServidor = {
                ...servidor[0],
                isChefe: isChefe
            }

            return rsServidor
        } catch (error) {
            console.log(error);

        }
    }

    public async getServidoresUnidade({ params }) {


        try {
            const rsServidores = await Database
                .query()
                .select('s.id_servidor', 'p.nome as nome_pessoa', 's.id_unidade', 's.siape', 'un.nome as lotacao')
                .from('rh.servidor as s')
                .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
                .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
                .whereNull('s.data_desligamento')
                .where('s.id_unidade', params.id)

                
                
            const servidores = rsServidores.map(async servidor=>{
                const rs = await Database
                .connection('pg')
                .query()
                .from('participante as p')
                .where('p.servidor_id', servidor.id_servidor)
                .where('p.unidade_id', servidor.id_unidade)
                .where('p.situacao', true)
                .orderBy('p.participante_id', 'desc')

               
                const rsServidor = {
                    ...servidor,
                    situacao: rs[0]?.situacao == true ? true : false,
                    data_inicio_participacao: rs[0]?.data_inicio_participacao ? rs[0]?.data_inicio_participacao : null,
                    data_fim_participacao: rs[0]?.data_fim_participacao ? rs[0]?.data_fim_participacao : null,
                    participante_id: rs[0]?.participante_id ? rs[0]?.participante_id : null

                }

                
                return rsServidor
            })

            

            return await Promise.all(servidores)
        } catch (error) {
            console.log(error);

        }
    }

    public async isChefe(id_servidor, id_unidade) {
        try {

            const isChefe = await Database
                .query()
                .from('rh.servidor as s')
                .join('comum.responsavel_unidade as ru', 's.id_servidor', 'ru.id_servidor')
                .where('s.id_servidor', id_servidor)
                .where('ru.id_unidade', id_unidade)
                .whereNull('s.data_desligamento')
                .whereNull('ru.data_fim')
                .whereIn('ru.nivel_responsabilidade', ['C', 'V'])

            return isChefe.length > 0 ? true : false

        } catch (error) {
            console.log(error);

        }
    }

   
}
