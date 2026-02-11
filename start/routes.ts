/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ItemsController = () => import('#controllers/items_controller')
const ComprasController = () => import('#controllers/compras_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.get('/itens', [ItemsController, 'index'])
  router.post('/itens', [ItemsController, 'store'])
  
  router.get('/compras', [ComprasController, 'index'])
  router.post('/compras', [ComprasController, 'store'])
})

// Swagger Documentation
router.get('/swagger.json', async () => {
  const { default: AutoSwagger } = await import('adonis-autoswagger')
  const { default: swaggerConfig } = await import('#config/swagger')
  return AutoSwagger.default.json(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  const { default: AutoSwagger } = await import('adonis-autoswagger')
  const { default: swaggerConfig } = await import('#config/swagger')
  return AutoSwagger.default.ui('/swagger.json', swaggerConfig)
})
