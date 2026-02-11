import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating a new item
 */
export const createItemValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3),
    preco: vine.number().positive(),
    qtd_atual: vine.number().min(0).withoutDecimals(),
  })
)

