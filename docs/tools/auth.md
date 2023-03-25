# 🔑 Авторизация / Аутентификация

В данном гайде будет описан пример реализации jwt аутентификации и сохранение ключа для авторизованных запросов при взаимодействия с rest-api.

## Data Access Layer

Для начала давайте подготовим data access layer:


```bash
.
├── auth
│   ├── const.ts
│   ├── index.ts
│   ├── init.ts
│   └── units.ts
├── index.ts
├── init.ts
├── interfaces.ts
└── request
    ├── const.ts
    ├── index.ts
    ├── init.ts
    └── units.ts
```

### Request

В директории Request будут располагаться обёртки для работы с axios, которые будут помогать нам использовать их в математике effector:

#### units.ts
```ts
import { attach, createDomain } from 'effector'
import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { $accessToken } from '../auth'

export enum Method {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

type Request = {
  method: AxiosRequestConfig['method']
  url: AxiosRequestConfig['url']
  headers?: AxiosRequestConfig['headers']
  accessToken?: string
  query?: AxiosRequestConfig['params']
  body?: AxiosRequestConfig['data']
  baseUrl?: AxiosRequestConfig['baseURL']
  responseType?: AxiosRequestConfig['responseType']
  withCredentials?: AxiosRequestConfig['withCredentials']

}

export type AccessToken = string | null

export const restApi = createDomain('rest-api')

export const requestFx = restApi.effect<Request, AxiosResponse<any>, AxiosError>()
export const authRequestFx = attach({
  source: $accessToken,
  effect: requestFx,
  mapParams: (request: Omit<Request, 'accessToken'>, accessToken) => ({
    ...request,
    accessToken: accessToken || undefined,
  }),
})

```

Обратите внимание, мы имеем 2 эффекта для использования запросов: **authRequestFx** и **requestFx**. Их главное отличие в том, что в первом эффекте мы подмешиваем `$accessToken`, который будем сохранять после авторизации, и загружать при каждом старте приложения.



#### init.ts
```ts
import axiosLib from 'axios'
import {
  requestFx,
} from './units'

const axios = axiosLib.create({
  baseURL: '/api',
  withCredentials: true
})

axios.interceptors.response.use(undefined, (error) => {
  throw error
})

requestFx.use((params) => {
  const defaultHeaders = params.headers || {}
  const headers = {
    ...defaultHeaders,
  }

  if (params.accessToken) {
    headers['X-Authorization'] = params.accessToken
  }

  return axios.request({
    headers,
    method: params.method,
    url: params.url,
    params: params.query,
    data: params.body,
    baseURL: params.baseUrl,
  })
})

```

### Auth

#### units.ts
```ts

// @/dal/auth/units.ts 

/*
  Здесь храним эффектор-юниты для управления access-token
*/

import { root } from '@/root-domain'

export const authDomain = root.domain('authDomain')

export const $accessToken = authDomain.store<string | null>(null)

export const setAccessToken = authDomain.event<string | null>()
export const clearAccessToken = authDomain.event<void>()

export const loadAccessTokenFx = authDomain.effect<void, string | null, Error>()
export const saveAccessTokenFx = authDomain.effect<string, void, Error>()
export const clearAccessTokenFx = authDomain.effect<void, void, Error>()


```

#### init.ts


```ts
import { forward } from 'effector'
import { AUTH_TOKEN } from './const'
import {
  $accessToken,
  clearAccessToken,
  clearAccessTokenFx,
  loadAccessTokenFx,
  saveAccessTokenFx,
  setAccessToken,
} from './units'

$accessToken
  .on(setAccessToken, (_, value) => value)
  .on(loadAccessTokenFx.doneData, (_, value) => value)
  .on(saveAccessTokenFx, (_, token) => token)
  .reset(clearAccessToken)

forward({
  from: clearAccessToken,
  to: clearAccessTokenFx
})

loadAccessTokenFx.use(() => localStorage.getItem(AUTH_TOKEN))
saveAccessTokenFx.use((token) => localStorage.setItem(AUTH_TOKEN, token))
clearAccessTokenFx.use(() => localStorage.removeItem(AUTH_TOKEN))
```


## Аутентификация 

Теперь, когда слой dal настроен, можно реализовать вход в систему на стороне фичи **login**

#### form.ts
```ts
import { requiredValidator } from '@/lib/form-validators'
import { createForm } from 'effector-forms'
import { d } from './domain'

export const loginForm = createForm({
    domain: d,
    fields: {
        phone: {
            init: '',
            rules: [requiredValidator,],
        },
        password: {
            init: '',
            rules: [requiredValidator],
        },
    },
    validateOn: ['submit'],
})
```

#### private.ts

```ts
// private.ts


export const loginFx = attachWrapper({
  effect: requestFx,
  mapParams: (payload: LoginFxPayload) => ({
    method: Method.post,
    body: payload,
    url: '/auth/login',
  }),
  mapResult: ({ result }: { result: AxiosResponse<LoginFxResponse> }) => result.data,
  mapError: ({ error }: { error: AxiosError }) => error.response?.data as LoginFxError
})

export const fetchProfileDataFx = attachWrapper({
  effect: authRequestFx, // Обратите внимание, здесь используется эффект authRequest, в котором подмешивается токен
  mapParams: () => {
    return {
      method: Method.get,
      url: '/user/profile',
    }
  },
  mapResult: ({ result }: { result: AxiosResponse<AuthDataFxResponse> }) => result.data,
  mapError: ({ error }: { error: AxiosError }) => error.response?.data
})

```

#### init.ts

```ts
// init.ts


sample({
    clock: loginFx.doneData,
    fn: ({ data }) => data.userData.accessToken,
    filter: ({ data }) => data.userData.isAuthorized,
    target: [
      saveAccessTokenFx,
      replaceNavigate.prepend(() => '/')
    ]
})

sample({
    clock: loginFx.done,
    target: loginForm.reset
})

sample({
    clock: loginForm.formValidated,
    fn: ({ phone, password }) => ({
        phone, code: password
    }),
    target: loginFx,
})

```

## Загрузка токена

Для работы авторизации, после запуска приложения токен необходимо загрузить. Например, так:

```ts
// app/model/init.ts
import { loadAccessTokenFx } from '@/dal'
import { forward } from 'effector'
import { $appLoaded, appInit } from './public'

$appLoaded.on(loadAccessTokenFx.done, () => true)

forward({
    from: appInit,
    to: loadAccessTokenFx,
})

```

```ts
// App.tsx

export const App = () => {
  React.useEffect(() => {
    appInit()
  }, [])

  return (<>{...}</>)
}

```

## Использование

Теперь, для защищённых авторизацией запросов к rest-api вы можете использовать в качестве базового эффекта authRequestFx:


```ts
export const fetchTodos = attachWrapper({
    effect: authRequestFx,
    mapParams: () => ({
        method: Method.get,
        url: '/todo',
    }),
    mapResult: ({ result }: { result: AxiosResponse<Todos[]> }) => result.data,
    mapError: ({ error }: { error: AxiosError }) => error.response?.data
})

```