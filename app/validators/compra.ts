import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating a new purchase
 */
export const createCompraValidator = vine.compile(
  vine.object({
    item_id: vine.number().positive().withoutDecimals(),
  })
)
