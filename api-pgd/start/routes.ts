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

Route.get('/hu', 'ServidoresController.hierarquiaUnidade')

Route.group(() => {

    Route.get('/get-servidor', 'ServidoresController.getServidor')
    

    Route.post('/create-plano-entrega', 'PlanoEntregaController.createPlanoEntrega')
    Route.post('/update-plano-entrega', 'PlanoEntregaController.updatePlanoEntrega')
    Route.get('/get-planos-entrega/:id', 'PlanoEntregaController.getPlanosDeEntrega')
    Route.get('/get-plano-entrega/:id', 'PlanoEntregaController.getPlanoDeEntrega')
    Route.delete('/delete-plano-entrega/:id', 'PlanoEntregaController.destroy')

    Route.post('/create-meta-plano-entrega', 'MetasController.createMeta')
    Route.post('/update-meta-plano-entrega', 'MetasController.updateMeta')
    Route.get('/get-metas-plano-entrega/:id', 'MetasController.getMetas')
    Route.get('/get-meta-plano-entrega/:id', 'MetasController.getMeta')
    Route.delete('/delete-meta-plano-entrega/:id', 'MetasController.destroy')

    Route.post('/create-plano-trabalho', 'PlanoTrabalhoController.createPlanoTrabalho')
    Route.post('/update-plano-trabalho', 'PlanoTrabalhoController.updatePlanoTrabalho')
    Route.get('/get-planos-trabalho/:id', 'PlanoTrabalhoController.getPlanosDeTrabalho')
    Route.get('/get-plano-trabalho/:id', 'PlanoTrabalhoController.getPlanoDeTrabalho')
    Route.delete('/delete-plano-trabalho/:id', 'PlanoTrabalhoController.destroy')

    Route.post('/create-tarefa', 'AtividadesController.createAtividade')
    Route.post('/update-tarefa', 'AtividadesController.updateAtividade')
    Route.get('/get-tarefas/:id', 'AtividadesController.getAtividades')
    Route.get('/get-tarefa/:id', 'AtividadesController.getAtividade')
    Route.delete('/delete-tarefa/:id', 'AtividadesController.destroy')

   
    

}).middleware('auth:api')



