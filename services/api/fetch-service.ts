import BaseService from '../base-service'
import UsersService from '../users-service'

export default class FetchService extends BaseService {
  URL = 'https://api.interview.pavlo.ru/'

  async request (path: string, data: object | undefined = undefined, method = 'get'): Promise<any> {
    let result
    try {
      result = await useFetch(`${this.URL}${path}`, {
        method,
        body: JSON.stringify(data),
        initialCache: false,
        async onRequest ({ options }) {
          const token = await BaseService.storage.get(UsersService.AUTH_TOKEN_NAME)
          options.headers = {} as { [key: string]: string }
          if (token) {
            options.headers.authorization = `Bearer ${token}`
          }
        },
        onResponseError ({ request, response, options }) {
          return new Promise((resolve) => {
            if (response.status === 401) {
              BaseService.navigateTo('/login')
            }
            resolve()
          })
        },
      })
      if (!result.data.value) {
        throw createError({ message: 'Wrong api data', fatal: true })
      }
    } catch (error) {
      error.fatal = true
      throw createError(error)
    }

    return result.data.value
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
