// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Plano from "App/Models/Plano";
import TipoPlano from "App/Models/TipoPlano";

export default class PlanosController {

    public async getPlanosIndividuais({ params }){
        
        try {
            const planos = await Database
            .connection('pg')
            .query()
            .from('planos as p')
            .innerJoin('tipo_planos as tp', 'p.tipo_plano_id', 'tp.id')
            .where('p.servidor_id', params.id)
            .orderBy('p.plano_id', "desc")

            return planos
        } catch (error) {
            console.log(error);
            
        }
    }

    public async getPlanosGerenciais({ params }){
        try {
            const planos = await Database
            .connection('pg')
            .query()
            .from('planos as p')
            .innerJoin('tipo_planos as tp', 'p.tipo_plano_id', 'tp.id')
            .where('p.unidade_id',params.id)
            .orderBy('p.id', "desc")

            return planos
        } catch (error) {
            console.log(error);
            
        }
    }
    
    public async getTiposPlanos(){
        try {
            const tipos = await TipoPlano.all()
            return tipos
        } catch (error) {
            console.log(error);
            
        }
    }


    public async createPlano({ request }) {
        const { descricao
            , nome_plano
            , unidade_id
            , servidor_id
            , tipo_plano_id
            , plano_superior_id } = request.all()
        try {

            const data = new Date()
            
            const plano = new Plano()

            plano.nome_plano = nome_plano
            plano.descricao_plano = descricao
            plano.data_cadastro_plano = data.getDay()+"/"+data.getMonth()+"/"+data.getFullYear()
            plano.unidade_id = unidade_id
            plano.servidor_id = servidor_id
            plano.tipo_plano_id = tipo_plano_id
            plano.plano_superior_id = plano_superior_id ? plano_superior_id : null
            await plano.save()

        } catch (error) {
            console.log(error);

        }


    }

    public async destroy({ params }){
        try {
            const plano = await Plano.findByOrFail('plano_id',params.id)
            await plano.delete()
            return "O Plano "+plano.descricao_plano
        } catch (error) {
            console.log(error);
            
        }
    }
}
