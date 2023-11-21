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
}
