/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'



Route.post('/login', 'SessionsController.login')

Route.group(() => {

    Route.get('/get-servidor', 'ServidoresController.getServidor')

    Route.post('/create-plano-entrega', 'PlanoEntregaController.createPlanoEntrega')
    Route.post('/update-plano-entrega', 'PlanoEntregaController.updatePlanoEntrega')
    Route.get('/get-planos-entrega/:id', 'PlanoEntregaController.getPlanosDeEntrega')
    Route.delete('/delete-plano-entrega/:id', 'PlanoEntregaController.destroy')

    Route.post('/create-plano-trabalho', 'PlanoTrabalhoController.createPlanoTrabalho')
    Route.post('/update-plano-trabalho', 'PlanoTrabalhoController.updatePlanoTrabalho')
    Route.get('/get-planos-trabalho/:id', 'PlanoTrabalhoController.getPlanosDeTrabalho')
    Route.delete('/delete-plano-trabalho/:id', 'PlanoEntregaController.destroy')

}).middleware('auth:api')



