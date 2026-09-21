import axios from 'axios'
import { handleLogin } from '@store/authentication'

// ** Auth Endpoints
export const AuthConfig = {
  loginEndpoint: '/admin/auth/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  tokenType: 'Bearer',

  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}

class JwtService {
  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = true

  // ** For Refreshing Token
  subscribers = []
  authConfig = AuthConfig

  constructor(jwtOverrideConfig) {
    const authConfig = { ...this.authConfig, ...jwtOverrideConfig }
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL
    // axios.defaults.baseURL = 'https://api.harulink.com'


    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          config.headers.Authorization = `${authConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => {
        if (response && response.data && response.data.success === false) {
          if (response.data.error && response.data.error.msg) {
            alert(response.data.error.msg)
          }
        }
        return response.data
      },
      error => {

        // ** const { config, response: { status } } = error
        const { config, response } = error

        const originalRequest = config

        // ** if (status === 401) {
        if (response && response.status === 401) {
          localStorage.removeItem('userData')
          localStorage.removeItem(this.authConfig.storageTokenKeyName)
          localStorage.removeItem(this.authConfig.storageRefreshTokenKeyName)
          window.location.href = '/moaland/auth/intro'
          return Promise.reject(error)
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then(r => {
              this.isAlreadyFetchingAccessToken = false

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken)
              this.setRefreshToken(r.data.refreshToken)

              this.onAccessTokenFetched(r.data.accessToken)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${AuthConfig.tokenType} ${accessToken}`
              resolve(this.axios(originalRequest))
            })
          })
          return retryOriginalRequest
        }
        if (response && response.status === 403) {
          alert(response.data?.error?.msg || '이 작업에 접근할 권한이 없습니다.')
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.authConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.authConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.authConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.authConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.authConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return axios.post(this.authConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.authConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }
}

// ** Export Service as useJwt
export default function useJwt(jwtOverrideConfig) {
  return new JwtService(jwtOverrideConfig)
}
