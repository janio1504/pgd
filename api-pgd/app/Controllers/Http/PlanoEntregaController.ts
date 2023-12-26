// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Plano from "App/Models/PlanoEntrega";

export default class PlanoEntregaController {

    public async getPlanosDeEntrega({ params }){
        
        try {
            const planos = await Database
            .connection('pg')
            .query()
            .from('plano_entregas as p')
            .where('p.unidade_id', params.id)
            .orderBy('p.plano_entrega_id', "desc")

            return planos
        } catch (error) {
            console.log(error);
            
        }
    }

    public async getPlanoDeEntrega({ params }){
        
        try {
            const plano = await Database
            .connection('pg')
            .query()
            .from('plano_entregas as p')
            .where('p.plano_entrega_id',params.id)

            return plano[0]
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


    public async createPlanoEntrega({ request }) {
        const { nome_plano_entrega
            , unidade_id
            , data_inicio
            , data_fim } = request.all()
        try {

            const plano = await Database
            .connection('pg')
            .insertQuery()
            .table('plano_entregas')
            .insert({
                nome_plano_entrega: nome_plano_entrega,
                unidade_id: unidade_id,
                data_inicio: data_inicio,
                data_fim: data_fim
            })
           
            return plano
        } catch (error) {
            
            console.log(error);
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
