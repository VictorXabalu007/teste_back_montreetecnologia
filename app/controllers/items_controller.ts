import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import { createItemValidator } from '#validators/item'

export default class ItemsController {
  /**
   * @index
   * @description Lista todos os itens disponíveis no catálogo.
   * @responseBody 200 - [item]
   */
  async index({ response }: HttpContext) {
    const items = await Item.all()
    return response.ok(items)
  }

  /**
   * @store
   * @description Cria um novo item no catálogo.
   * @requestBody <createItemValidator>
   * @responseBody 201 - item
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createItemValidator)
    const item = await Item.create({
      nome: payload.nome,
      preco: payload.preco,
      qtdAtual: payload.qtd_atual,
    })
    return response.created(item)
  }
}