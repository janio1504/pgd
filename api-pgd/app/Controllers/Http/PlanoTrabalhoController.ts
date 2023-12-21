// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Plano from "App/Models/PlanoTrabalho";

export default class PlanoTrabalhoController {

    public async getPlanosDeTrabalho({ params }){
        
        try {
            const planos = await Database
            .connection('pg')
            .query()
            .from('plano_trabalho as p')
            .where('p.servidor_id', params.id)
            .orderBy('p.plano_trabalho_id', "desc")

            return planos
        } catch (error) {
            console.log(error);
            
        }
    }

    public async getPlanoTrabalho({ params }){
        try {
            const plano = await Database
            .connection('pg')
            .query()
            .from('plano_trabalho as p')
            .where('p.plano_trabalho_id',params.id)

            return plano
        } catch (error) {
            console.log(error);
            
        }
    }
    
    public async updatePlanoTrabalho({ request }){

        const { plano_trabalho_id
            , nome_plano_trabalho
            , data_inicio
            , data_fim } = request.all()
        try {
            const plano = await Database
            .connection('pg')
            .from('plano_trabalho')
            .where('plano_trabalho_id', plano_trabalho_id)
            .update({
                nome_plano_entrega: nome_plano_trabalho,
                data_inicio: data_inicio,
                data_fim: data_fim
            })

            return plano
        } catch (error) {
            console.log(error);
            
        }
    }


    public async createPlanoTrabalho({ request }) {
        const { nome_plano_entrega
            , unidade_id
            , data_inicio
            , data_fim } = request.all()
        try {

            const plano = await Database
            .connection('pg')
            .insertQuery()
            .table('plano_trabalho')
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
            return "O Plano "+plano.nome_plano_trabalho+" foi remvido definitivamente"
        } catch (error) {
            console.log(error);
            
        }
    }
}
