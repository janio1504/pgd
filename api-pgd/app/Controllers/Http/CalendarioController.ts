// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Calendario from "App/Models/Calendario";

export default class CalendarioController {
    public async createFeriado({ request, response }) {
        const { descricao, tipo_feriado_id, data } = request.all()
        try {
            const feriado = new Calendario()
            feriado.descricao = descricao
            feriado.tipo_feriado_id = tipo_feriado_id
            feriado.data = data
            await feriado.save()

            return response.send('Feriado criado com sucesso!')
        } catch (error) {
            console.log(error);

        }
    }

    public async updateFeriado({ request, response }) {
        const { feriado_id, descricao, tipo_feriado_id, data } = request.all()
        try {
            const feriado = await Calendario.findBy('feriado_id', feriado_id)
            if (feriado) {
                feriado.descricao = descricao ? descricao : feriado.descricao
                feriado.tipo_feriado_id = tipo_feriado_id ? tipo_feriado_id : feriado.tipo_feriado_id
                feriado.data = data ? data : feriado.data
                await feriado.save()
                return response.send("Alteração realizada com sucesso!")
            }
            return response.status(400).send("Não foi possivel realizar a alteração!")

        } catch (error) {

        }
    }



    public async getFeriados() {
        try {
            const rs = await Calendario.all()
            const feriados = rs.map(feriado => {
                const tipo = Calendario.tipoFeriado(feriado.tipo_feriado_id)
                const f = {
                    feriado_id: feriado.feriado_id,
                    descricao: feriado.descricao,
                    data: feriado.data,
                    tipo_feriado: tipo,
                    tipo_feriado_id: feriado.tipo_feriado_id
                }
                return f
            })
            return feriados
        } catch (error) {

        }
    }

    public async getFeriado({ params, response }) {
        try {
            const feriado = await Calendario.findBy('feriado_id', params.id)
            if (feriado) {
                const tipo = Calendario.tipoFeriado(feriado.tipo_feriado_id)
                const f = {
                    feriado_id: feriado.feriado_id,
                    descricao: feriado.descricao,
                    data: feriado.data,
                    tipo_feriado: tipo,
                    tipo_feriado_id: feriado.tipo_feriado_id
                }
                return f
            }
            return response.status(400).send("Não foi encotrado resultado para a busca!")
        } catch (error) {
            console.log(error);
            
        }
    }

    public async destroy({ params, response }) {

        try {
            const feriado = await Calendario.findBy('feriado_id', params.id)
            await feriado?.delete()

            return response.send("O feriado foi removido com sucesso!")
        } catch (error) {

        }

    }
}
