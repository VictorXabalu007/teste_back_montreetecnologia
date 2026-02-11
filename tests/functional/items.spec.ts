import { test } from '@japa/runner'
import Item from '#models/item'
import Compra from '#models/compra'

test.group('Items API', (group) => {
  group.each.setup(async () => {
    // Clean database before each test
    await Compra.query().delete()
    await Item.query().delete()
  })

  test('should create a new item', async ({ client }) => {
    const response = await client.post('/itens').json({
      nome: 'Notebook Dell',
      preco: 3500.0,
      qtd_atual: 10,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      nome: 'Notebook Dell',
      preco: 3500.0,
      qtd_atual: 10,
    })
  })

  test('should fail to create item with invalid data', async ({ client }) => {
    const response = await client.post('/itens').json({
      nome: 'AB', // Too short
      preco: -100, // Negative price
      qtd_atual: 5.5, // Decimal quantity
    })

    response.assertStatus(422)
  })

  test('should list all items', async ({ client }) => {
    // Create test items
    await Item.createMany([
      { nome: 'Mouse', preco: 50.0, qtdAtual: 20 },
      { nome: 'Teclado', preco: 150.0, qtdAtual: 15 },
    ])

    const response = await client.get('/itens')

    response.assertStatus(200)
    response.assertBodyContains([
      { nome: 'Mouse', preco: 50.0, qtd_atual: 20 },
      { nome: 'Teclado', preco: 150.0, qtd_atual: 15 },
    ])
  })
})
