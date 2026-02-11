import type { HttpContext } from '@adonisjs/core/http'
import Compra from '#models/compra'
import Item from '#models/item'
import GithubService from '#services/github_service'
import { createCompraValidator } from '#validators/compra'
import db from '@adonisjs/lucid/services/db'

export default class ComprasController {
  /**
   * @index
   * @description Lista todas as compras realizadas, incluindo os detalhes do item comprado.
   * @responseBody 200 - [compra]
   */
  async index({ response }: HttpContext) {
    const compras = await Compra.query().preload('item')
    return response.ok(compras)
  }

  /**
   * @store
   * @description Realiza uma nova compra de um item. Atribui um comprador aleatório via API do GitHub e atualiza o estoque.
   * @requestBody <createCompraValidator>
   * @responseBody 201 - compra
   * @responseBody 404 - {"error": "Item não encontrado", "message": "string"}
   * @responseBody 400 - {"error": "Estoque insuficiente", "message": "string"}
   * @responseBody 503 - {"error": "Serviço indisponível", "message": "A API do GitHub está fora do ar."}
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCompraValidator)

    const item = await Item.find(payload.item_id)

    if (!item) {
      return response.notFound({
        error: 'Item não encontrado',
        message: `O item com ID ${payload.item_id} não existe no catálogo.`,
      })
    }

    if (item.qtdAtual <= 0) {
      return response.badRequest({
        error: 'Estoque insuficiente',
        message: `O item "${item.nome}" está fora de estoque.`,
      })
    }

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

    const compra = await db.transaction(async (trx) => {
      item.qtdAtual -= 1
      await item.useTransaction(trx).save()

      const newCompra = await Compra.create(
        {
          itemId: item.id,
          compradorGithubLogin: compradorLogin,
        },
        { client: trx }
      )

      await newCompra.load('item')

      return newCompra
    })

    return response.created(compra)
  }
}
