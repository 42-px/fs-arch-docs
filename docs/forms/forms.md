
# Работа с формами. 

Для работы с формами мы рекомендуем использовать библиотеку [effector-forms](https://www.npmjs.com/package/effector-forms)

Формы вы можете хранить на стороне feature: `/features/%featurename%/model/forms.ts`

## Пример формы и валидация

```ts
// @/features/login/model/forms.ts


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

Обратите внимание, валидаторы вынесены в отдельный блок библиотек

```ts
// @/lib/form-validators.ts


export const requiredValidator = {
    name: 'required',
    validator: <T>(value: T) => Boolean(value),
    errorText: 'Поле обязательно для заполнения',
}

export const allFieldsRequiredValidator = (errorText: string) => ({
    errorText,
    name: 'required',
    validator: (value: string[]) => value.every(Boolean),
})


export const confirmValidator = {
    name: 'confirmation',
    validator: (confirmation, { password }) => confirmation === password,
    errorText: 'Пароли не совпадают'
}

export const confirmCodeValidator = {
    name: 'codeConfirmation',
    validator: (confirmation, { code }) => confirmation === code,
    errorText: 'Введен неверный код'
}
```