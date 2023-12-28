// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";

export default class ServidoresController {
    public async getServidor({ auth }) {

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
            const rsServidor = {
                ...servidor[0],
                isChefe: isChefe
            }

            return rsServidor
        } catch (error) {
            console.log(error);

        }
    }

    public async isChefe(id_servidor, id_unidade_lotacao) {
        try {

            const isChefe = await Database
                .query()
                .from('rh.servidor as s')
                .join('comum.responsavel_unidade as ru', 's.id_servidor', 'ru.id_servidor')
                .where('s.id_servidor', id_servidor)
                .where('ru.id_unidade', id_unidade_lotacao)
                .whereNull('s.data_desligamento')
                .whereNull('ru.data_fim')
                .whereIn('ru.nivel_responsabilidade', ['C', 'V'])

            return isChefe.length > 0 ? true : false

        } catch (error) {
            console.log(error);

        }
    }

    public async hierarquiaUnidade() {
        try {
            const hierarquia = await Database
                .from('comum.unidade as u')
                .select('u.hierarquia')
                .where('u.id_unidade', 3004)

                let hu = ''

                hierarquia.map(hierarquia=>{
                    hu = hierarquia.hierarquia
                    
                    
                })
                const us = hu.split('.')
                console.log(us.length -1);
                const n = us.length -3
            return us[n]
        } catch (error) {
            console.log(error);            
        }
    }
}
