import Database from "@ioc:Adonis/Lucid/Database";



export default class Participante {
  public static async participante(plano_entrega_id) {
    try {
      const rsParticipantes = await Database
        .connection('pg')
        .query()
        .from('participante as p')
        .where('p.plano_entrega_id', plano_entrega_id)

      return rsParticipantes
    } catch (error) {
      console.log(error);

    }
  }

}


