# 🧭 Навигация

## Императивная навигация из любой точки проекта

Входные данные: наличие react-router v5

Если требуется завязать effector-логику на переходах по страницам (будь то переход на главную страницу после успешной регистрации, переход на главную страницу после успешного действия, или любой другой кейс),то ниже приведён пример враппера, который подписывает события из `@/app` на работу вместе с history


### @/features/app/model/public.ts

```ts
import { d } from './domain'

export const pushNavigate = d.event<string>()
export const goBackNavigate = d.event<void>()
export const replaceNavigate = d.event<string>()
```

### RouterNavigator.tsx

```tsx
import React from 'react'

import { useHistory } from 'react-router-dom'

import {
    pushNavigate,
    replaceNavigate,
    goBackNavigate,
} from '@/features/app/model'

export const RouterNavigator =  () => {
    const history = useHistory()

    React.useEffect(() => {
        const unwatchPush = pushNavigate.watch((url) => history.push(url))
        const unwatchReplace = replaceNavigate.watch((url) => history.replace(url))
        const unwatchGoBack = goBackNavigate.watch(() => history.goBack())
        return () => {
            unwatchPush()
            unwatchGoBack()
            unwatchReplace()
        }
    }, [history])


    return null
}

```

### @/src/Routes.tsx

```tsx

export const Routes = () => {


    return (
        <BrowserRouter>
            <RouterNavigator />
            <Switch>
                {...}
            </Switch>
        </BrowserRouter>

    )
}
```

## Применение

Ниже приведены примеры применения императивного перехода:

```ts

sample({
    clock: logout,
    target: pushNavigate,
    fn: () => '/'
})


sample({
    clock: fetchAuthDataFx.doneData,
    filter: $isRegisterIncomplete,
    fn: () => `/register`,
    target: pushNavigate,
})


```