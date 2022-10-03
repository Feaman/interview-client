import BaseService from '../base-service'
import UsersService from '../users-service'

export default class FetchService extends BaseService {
  URL = 'https://api.interview.pavlo.ru/'

  async request (path: string, incomingData: object | undefined = undefined, method = 'get'): Promise<any> {
    const { data, error } = await useFetch(`${this.URL}${path}`, {
      method,
      body: JSON.stringify(incomingData),
      initialCache: false,
      async onRequest ({ options }) {
        const token = await BaseService.storage.get(UsersService.AUTH_TOKEN_NAME)
        options.headers = {} as { [key: string]: string }
        if (token) {
          options.headers.authorization = `Bearer ${token}`
        }
      },
    })
    if (error.value) {
      throw error.value
    }

    return data.value
  }

  get (path: string): Promise<any> {
    return this.request(path)
  }

  post (path: string, data: object | undefined = undefined): Promise<any> {
    return this.request(path, data, 'post')
  }

  put (path: string, data: object | undefined = undefined): Promise<any> {
    return this.request(path, data, 'put')
  }

  delete (path: string): Promise<any> {
    return this.request(path, {}, 'delete')
  }
}
