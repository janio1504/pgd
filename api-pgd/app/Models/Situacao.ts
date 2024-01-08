

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
      case 5:
        situacao = "Encerrado"
        break;
      default:
        break;
    }

    return situacao
  }

  public static modalidade(id) {
    let modalidade = ''
    switch (id) {
      case 1:
        modalidade = "Integral"
        break;
      case 2:
        modalidade = "Parcial"
        break;
      case 3:
        modalidade = "Presencial"
        break;
      default:
        break;
    }

    return modalidade
  }
}
