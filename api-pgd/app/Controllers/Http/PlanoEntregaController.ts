// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Plano from "App/Models/PlanoEntrega";
import Situacao from  "App/Models/Situacao"

export default class PlanoEntregaController {

    public async getPlanosDeEntrega({ params, response }){
        
        try {
            const planos = await Database
            .connection('pg')
            .query()
            .from('plano_entregas as p')
            .innerJoin('homologacao_plano_entrega as h', 'p.plano_entrega_id', 'h.plano_entrega_id')
            .where('p.unidade_id', params.id)
            .where('h.situacao_id', 1)
            .orderBy('p.plano_entrega_id', "desc")

            if(planos.length == 0){
                throw response.status(400).send("Não foi encontrado plano de entrega homologado para a unidade!")
            }

            const planosEntrega = planos.map(plano=>{
                const planoEntrega = {
                    ...plano,
                    situacao: Situacao.situacao(plano.situacao_id)
                }

                return planoEntrega
            })


            return planosEntrega
        } catch (error) {
            return error
        }
    }

    public async getPlanoDeEntrega({ params }){
        
        try {
            const plano = await Database
            .connection('pg')
            .query()
            .from('plano_entregas as p')
            .where('p.plano_entrega_id',params.id)
            .innerJoin('homologacao_plano_entrega as h', 'p.plano_entrega_id', 'h.plano_entrega_id')

            const planoEntrega = plano.map(plano=>{
                const pe = {
                    ...plano,
                    situacao: Situacao.situacao(plano.situacao_id)
                }

                return pe
            })

            return planoEntrega[0]
        } catch (error) {
            console.log(error);
            
        }
    }
    
    public async updatePlanoEntrega({ request }){

        const { plano_entrega_id
            , nome_plano_entrega
            , unidade_id
            , data_inicio
            , data_fim } = request.all()
        try {
            
            const plano = await Database
            .connection('pg')
            .from('plano_entregas')
            .where('plano_entrega_id', plano_entrega_id)
            .update({
                nome_plano_entrega: nome_plano_entrega,
                unidade_id: unidade_id,
                data_inicio: data_inicio,
                data_fim: data_fim
            })

            return plano
        } catch (error) {
            console.log(error);
            
        }
    }


    public async createPlanoEntrega({ request, response }) {
        const { nome_plano_entrega
            , unidade_id
            , data_inicio
            , data_fim } = request.all()
        try {   
            
            if (!nome_plano_entrega) {
                throw response.status(400).send("O campo nome plano de entrega é obrigatório!")
            }

            if (!unidade_id) {
                throw response.status(400).send("O campo unidade é obrigatório!")
            }

            if (!data_inicio) {
                throw response.status(400).send("O campo data de inicio é obrigatório!")
            }

            if (!data_fim) {
                throw response.status(400).send("O campo data de fim é obrigatório!")
            }
            
            const rsPe = await Database
            .connection('pg')
            .query()
            .from('plano_entregas as p')
            .where('p.unidade_id', unidade_id)
            .innerJoin('homologacao_plano_entrega as h', 'p.plano_entrega_id', 'h.plano_entrega_id')
            .whereIn('p.situacao_id', [1,2,4])
            .orderBy('p.plano_entrega_id', 'desc')

            if(rsPe[0]){
                throw response.status(400).send("Já existe um plano de entrega cadastrado, ativo ou em analise para a unidade!");                
            }

            const plano = await Database
            .connection('pg')
            .insertQuery()
            .table('plano_entregas')
            .insert({
                nome_plano_entrega: nome_plano_entrega,
                unidade_id: unidade_id,
                data_inicio: data_inicio,
                data_fim: data_fim,
            })
           
            return plano
        } catch (error) {
            
            return error 

        }


    }

    public async destroy({ params }){
        try {
            const plano = await Plano.findByOrFail('plano_entrega_id',params.id)
            await plano.delete()
            return "O Plano "+plano.nome_plano_entrega+" foi removido"
        } catch (error) {
            console.log(error);
            
        }
    }
}
