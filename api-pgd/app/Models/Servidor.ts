
import Database from '@ioc:Adonis/Lucid/Database'
import UnidadeChefia from 'App/Models/UnidadeChefia'

export default class Servidor {
  public static async servidorAuth(id_usuario) {
    try {
      const rsServidor = await Database
        .query()
        .select('p.nome as nome_pessoa', 's.siape', 'un.nome as lotacao', 'un.id_unidade as id_exercicio', 's.id_servidor', 's.id_servidor as servidor_id', 'regime_trabalho as carga_horaria')
        .from('rh.servidor as s')
        .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
        .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
        .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
        .where('u.id_usuario', id_usuario)
        .whereNull('s.data_desligamento')

        const uc = await UnidadeChefia.findBy('servidor_id', rsServidor[0].servidor_id)
        const chefias = await Servidor.chefias(rsServidor[0].servidor_id)
        const servidor = {
          ...rsServidor[0],
          id_unidade: uc?.unidade_id ? uc.unidade_id : rsServidor[0].unidade_id,
          chefias: chefias
        }

      return servidor
    } catch (error) {
      console.log(error);
      return error
    }
  }

  public static async servidor(id_servidor) {
    try {
      const rsServidor = await Database
        .query()
        .select('p.nome as nome_pessoa', 's.siape', 'un.nome as lotacao', 'un.id_unidade as id_exercicio', 's.id_servidor', 's.id_servidor as servidor_id', 'regime_trabalho as carga_horaria')
        .from('rh.servidor as s')
        .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
        .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
        .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
        .where('s.id_servidor', id_servidor)
        .whereNull('s.data_desligamento')
        const uc = await UnidadeChefia.findBy('servidor_id', id_servidor)
        const chefias = await Servidor.chefias(id_servidor)
        const servidor = {
          ...rsServidor[0],          
          id_unidade: uc?.unidade_id ? uc.unidade_id : rsServidor[0].unidade_id,
          chefias: chefias
        }

      return servidor
    } catch (error) {
      console.log(error);
      return error
    }
  }

  public static async chefias(servidor_id: number) {
    try {

      const chefias = await Database
        .query()
        .select('d.id_servidor as servidor_id', 'u.nome as unidade', 'ru.nivel_responsabilidade as chefia')
        .distinct('d.id_unidade as unidade_id')
        .from('rh.designacao as d')
        .join('comum.responsavel_unidade as ru', 'd.id_servidor', 'ru.id_servidor')
        .join('comum.unidade as u', 'd.id_unidade', 'u.id_unidade')
        .where('d.id_servidor', servidor_id)
        .whereNull('d.fim')
        .whereNull('ru.data_fim')
        .whereIn('ru.nivel_responsabilidade', ['C', 'V'])

      return chefias


    } catch (error) {
      console.log(error);

    }
  }



  public static async setUnidadeChefia(servidor_id: any, unidade_id: any) {

    const uc = await UnidadeChefia.findBy('servidor_id', servidor_id)
    
    if(!uc){
      const unidadeChefia = new UnidadeChefia()
      unidadeChefia.servidor_id = servidor_id
      unidadeChefia.unidade_id = unidade_id
      await unidadeChefia.save()
    }

    if(uc){           
      uc.servidor_id = servidor_id
      uc.unidade_id = unidade_id
      await uc.save()
    }

    return uc
  }

  public static async getUnidadeChefia(servidor_id: any){
    const uc = await UnidadeChefia.findBy('servidor_id', servidor_id)
    return uc?.toJSON()
  }


  }
