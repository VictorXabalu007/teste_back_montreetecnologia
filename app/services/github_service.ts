export default class GithubService {
  private readonly baseUrl = 'https://api.github.com/users'

  public async getRandomUser(): Promise<string> {
    try {
      const response = await fetch(this.baseUrl)
      
      if (!response.ok) {
        throw new Error('Falha ao conectar com a API do GitHub')
      }

      const users = await response.json() as any[]
      
      if (!users || users.length === 0) {
        throw new Error('Nenhum usuário retornado pela API do GitHub')
      }
      
      const randomIndex = Math.floor(Math.random() * users.length)
      const randomUser = users[randomIndex]

      return randomUser.login
    } catch (error) {
      console.error('GitHub API Error:', error)
      throw new Error('A API do GitHub está fora do ar ou retornou um erro.')
    }
  }
}
