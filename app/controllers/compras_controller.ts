import type { HttpContext } from '@adonisjs/core/http'
import Compra from '#models/compra'
import Item from '#models/item'
import GithubService from '#services/github_service'
import { createCompraValidator } from '#validators/compra'
import db from '@adonisjs/lucid/services/db'

export default class ComprasController {
  /**
   * List all purchases with item details
   */
  async index({ response }: HttpContext) {
    const compras = await Compra.query().preload('item')
    return response.ok(compras)
  }

  /**
   * Create a new purchase
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCompraValidator)

    // Find the item first
    const item = await Item.find(payload.item_id)

    if (!item) {
      return response.notFound({
        error: 'Item não encontrado',
        message: `O item com ID ${payload.item_id} não existe no catálogo.`,
      })
    }

    // Check stock availability
    if (item.qtdAtual <= 0) {
      return response.badRequest({
        error: 'Estoque insuficiente',
        message: `O item "${item.nome}" está fora de estoque.`,
      })
    }

    // Get random GitHub user
    const githubService = new GithubService()
    let compradorLogin: string

    try {
      compradorLogin = await githubService.getRandomUser()
    } catch (error) {
      return response.serviceUnavailable({
        error: 'Serviço indisponível',
        message: 'A API do GitHub está fora do ar. Tente novamente mais tarde.',
      })
    }

    // Use transaction to ensure data consistency
    const compra = await db.transaction(async (trx) => {
      // Decrease item quantity
      item.qtdAtual -= 1
      await item.useTransaction(trx).save()

      // Create purchase
      const newCompra = await Compra.create(
        {
          itemId: item.id,
          compradorGithubLogin: compradorLogin,
        },
        { client: trx }
      )

      // Load item relationship
      await newCompra.load('item')

      return newCompra
    })

    return response.created(compra)
  }

}
