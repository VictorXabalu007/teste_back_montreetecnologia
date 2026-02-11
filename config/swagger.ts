import { getDirname } from '@adonisjs/core/helpers'

export default {
  path: getDirname(import.meta.url) + '/../',
  title: 'API de Lista de Compras',
  version: '1.0.0',
  description: 'Documentação da API para o desafio de Lista de Compras Aleatória com Catálogo.',
  tagIndex: 1,
  info: {
    title: 'API de Lista de Compras',
    version: '1.0.0',
    description: 'API estruturada para gerenciar itens e realizar compras aleatórias usando a API do GitHub.',
  },
  snakeCase: true,
  ignore: ['/docs', '/swagger.json', '/'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {},
  authMiddlewares: [],
  defaultSecurityScheme: '',
  persistAuthorization: true,
  showSummary: true,
}
