import { test } from '@japa/runner'
import Item from '#models/item'
import Compra from '#models/compra'
import nock from 'nock'

test.group('Compras API', (group) => {
  group.each.setup(async () => {
    // Clean database before each test
    await Compra.query().delete()
    await Item.query().delete()
  })

  test('should create a purchase successfully', async ({ client }) => {
    // Create test item
    const item = await Item.create({
      nome: 'Headset Gamer',
      preco: 250.0,
      qtdAtual: 5,
    })

    // Mock GitHub API
    nock('https://api.github.com')
      .get('/users')
      .reply(200, [
        { login: 'octocat', id: 1 },
        { login: 'torvalds', id: 2 },
      ])

    const response = await client.post('/compras').json({
      item_id: item.id,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      item_id: item.id,
    })

    // Verify stock was decreased
    await item.refresh()
    response.assert?.equal(item.qtdAtual, 4)
  })

  test('should fail when item does not exist', async ({ client }) => {
    const response = await client.post('/compras').json({
      item_id: 9999,
    })

    response.assertStatus(404)
    response.assertBodyContains({
      error: 'Item não encontrado',
    })
  })

  test('should fail when item is out of stock', async ({ client }) => {
    // Create item with no stock
    const item = await Item.create({
      nome: 'Mouse Sem Estoque',
      preco: 50.0,
      qtdAtual: 0,
    })

    const response = await client.post('/compras').json({
      item_id: item.id,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      error: 'Estoque insuficiente',
    })
  })

  test('should fail when GitHub API is unavailable', async ({ client }) => {
    // Create test item
    const item = await Item.create({
      nome: 'Teclado',
      preco: 150.0,
      qtdAtual: 10,
    })

    // Mock GitHub API failure
    nock('https://api.github.com').get('/users').reply(500)

    const response = await client.post('/compras').json({
      item_id: item.id,
    })

    response.assertStatus(503)
    response.assertBodyContains({
      error: 'Serviço indisponível',
    })
  })

  test('should list all purchases with item details', async ({ client }) => {
    // Create test item
    const item = await Item.create({
      nome: 'Monitor',
      preco: 800.0,
      qtdAtual: 3,
    })

    // Create test purchase
    await Compra.create({
      itemId: item.id,
      compradorGithubLogin: 'testuser',
    })

    const response = await client.get('/compras')

    response.assertStatus(200)
    response.assertBodyContains([
      {
        comprador_github_login: 'testuser',
        item: {
          nome: 'Monitor',
          preco: 800.0,
        },
      },
    ])
  })
})
