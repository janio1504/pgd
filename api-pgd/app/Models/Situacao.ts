

export default class Situacao {
  public static situacao(id) {
    let situacao = ''
    switch (id) {
      case 1:
        situacao ="Homologado"
        break;
      case 2:
        situacao ="Indeferido"
        break;
      case 3:
        situacao ="Em analise"
        break;
      default:
        break;
    }
  
    return situacao
  }
}
