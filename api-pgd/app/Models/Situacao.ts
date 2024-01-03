

export default class Situacao {
  public static situacao(id) {
    let situacao = ''
    switch (id) {
      case 1:
        situacao = "Homologado"
        break;
      case 2:
        situacao = "Em analise"
        break;
      case 3:
        situacao = "Indeferido"
        break;
      case 4:
        situacao = "Cadastrado"
        break;
      default:
        break;
    }

    return situacao
  }
}
