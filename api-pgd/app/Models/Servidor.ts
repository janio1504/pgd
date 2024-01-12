
import Database from '@ioc:Adonis/Lucid/Database'

export default class Servidor {
  public static async servidorAuth(id_usuario) {
    try {
      const rsServidor = await Database
        .query()
        .select('p.nome as nome_pessoa', 's.siape', 'un.nome as lotacao', 'un.id_unidade', 's.id_servidor', 's.id_servidor as servidor_id', 'regime_trabalho')
        .from('rh.servidor as s')
        .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
        .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
        .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
        .where('u.id_usuario', id_usuario)
        .whereNull('s.data_desligamento')

      return rsServidor[0]
    } catch (error) {
      console.log(error);
      return error
    }
  }

  public static async servidor(id_servidor) {
    try {
      const rsServidor = await Database
        .query()
        .select('p.nome as nome_pessoa', 's.siape', 'un.nome as lotacao', 'un.id_unidade', 's.id_servidor')
        .from('rh.servidor as s')
        .join('comum.pessoa as p', 's.id_pessoa', 'p.id_pessoa')
        .join('comum.usuario as u', 'p.id_pessoa', 'u.id_pessoa')
        .join('comum.unidade as un', 's.id_unidade', 'un.id_unidade')
        .where('s.id_servidor', id_servidor)
        .whereNull('s.data_desligamento')

      return rsServidor[0]
    } catch (error) {
      console.log(error);
      return error
    }
  }
}
