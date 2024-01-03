// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"

export default class HomologacoesController {

    public async createHomologacao({ request, response }) {
        const { unidade_id, servidor_id } = request.all()

        try {

            if(!unidade_id){
                throw response.status(400).send('O campo unidade é obrigatório!')
            }
            if(!servidor_id){
                throw response.status(400).send('O campo servidor é obrigatório!')
            }
            const unidade_superior_id = this.unidadeSuperior(unidade_id)
            await Database
                .connection('pg')
                .table('homologacao_plano_entrega')
                .insert({
                    unidade_superior_id: unidade_superior_id,
                    unidade_homologacao_id: unidade_id,
                    servidor_id: servidor_id,
                    situacao_id: 4,
                })

            return response.send('O plano foi enviado para homologação.')
        } catch (error) {
            return error
        }
    }


    public async homologarPlanoEntrega() {
        await Database
            .connection('pg')
            .table('homologacao_plano_entrega')
            .insert({

            })


    }

    public async isChefe(unidade_id) {
        try {

            const Chefe = await Database
                .query()
                .from('rh.servidor as s')
                .join('comum.responsavel_unidade as ru', 's.id_servidor', 'ru.id_servidor')
                .where('ru.id_unidade', unidade_id)
                .whereNull('s.data_desligamento')
                .whereNull('ru.data_fim')
                .whereIn('ru.nivel_responsabilidade', ['C', 'V'])

            return Chefe

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
