// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Users from 'App/Models/Users'
import Md5 from 'md5'

export default class SessionsController {

  public async login({ auth, request, response }) {
    const usuario = request.input('login')
    const password = request.input('senha')

    try {

      const resUser = await Database.query()
        .from('comum.usuario as u')
        .innerJoin('rh.servidor as s', 'u.id_pessoa', 's.id_pessoa')
        .where('u.login', usuario)
        .where('u.senha', Md5(password))
        .where('u.inativo', false)
        .orderBy('u.id_usuario', 'desc')

      
      if(!resUser[0]){
        throw "Usuário ou senha invalidos!";        
      }

      const rsUsers = await Users.findBy('id', resUser[0].id_usuario)
      if (!rsUsers) {
        const users = new Users()

        users.id = resUser[0].id_usuario
        users.login = usuario
        users.password = password
        users.save()
      }

      const user = {
        id: resUser[0].id_usuario,
        ...resUser[0]
      }

      const token = await auth.use('api').generate(user, { expiresIn: '120 mins' })

      return token
    } catch (error) {
      console.log(error);

      return response.badRequest('Credenciais invalidas')
    }
  }

}
