// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";

export default class ServidoresController {
    public async getServidor({ auth }) {

        try {
            const servidor = await Database
                .query()
                .select('s.id_servidor', 'p.id_pessoa', 'p.nome as nome_pessoa', 's.siape', 'un.nome as lotacao')
                .from('rh.servidor as s')
                .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
                .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
                .join('comum.unidade as un', 's.id_unidade_lotacao', 'un.id_unidade')
                .where('u.id_usuario', auth.user.id)

            return servidor
        } catch (error) {
            console.log(error);

        }
    }

    public async isChefe({ request }) {
        try {
            const { unidade_id, servidor_id } = request.all()

            const isChefe = await Database
                .query()
                .from('rh.servidor as s')
                .join('comum.responsavel_unidade as ru', 's.id_servidor', 'ru.id_servidor')
                .where('s.id_servidor', servidor_id)
                .where('ru.id_unidade', unidade_id)
                .whereNull('s.data_desligamento')
                .whereNull('ru.data_fim')
                .whereIn('ru.nivel_responsabilidade', ['C','V'])            
            
            return isChefe.length > 0 ? true : false

        } catch (error) {
            console.log(error);
            
        }
    }
}
