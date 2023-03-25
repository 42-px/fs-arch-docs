# 🏭 Фабрики

Очень часто в проектах требуется использовать высокоуровневые блоки бизнес-логики, которые могут повторяться несколько раз.

Например:

- grid списки с тонкой настройкой полей, фильтрацией, логикой подгрузки данных
- модальные окна, с бойлерплейт-логикой открытия/закрытия 
- фильтрация, и её настройки, которые в итоге собираются в параметры эффекта получения данных

Фабрики помогают избавиться от дублирования в подобных кейсах.

## Структура

Мы делим фабрики на фабрики модели / фабрики view.

Фабрики располагаются обычно в отдельных директориях:

```ts
./feature/model/factory/createSmthModel.ts
./feature/view/factory/createSmthView.tsx
```

## Пример фабрики

Ниже приведён пример фабрики-модели для создания отдельного окна верификации действия 
пользователя в системе через телефонный номер и присланный код:

```tsx
// @/features/agreement-compose/model/factory/createAgreementFactoryModel.ts

import { Method, requestFx } from '@/dal'
import { requiredValidator } from '@/lib/form-validators'
import { showNotification } from '@/ui/notifications'
import { attachWrapper } from '@42px/effector-extra'
import { AxiosError, AxiosResponse } from 'axios'
import { Domain, guard, sample } from 'effector'
import { createForm } from 'effector-forms'
import { AgreementStep, ValidateAgreementCodeFxError, ValidateAgreementCodeFxPayload } from './types'

type CreateAgreementFactoryModelPayload = {
    d: Domain
}
export const createAgreementFactoryModel = ({ d }: CreateAgreementFactoryModelPayload) => {
    const $agreementStep = d.store(AgreementStep.phone)

    const validateAgreements = d.event()
    const validateAgreementsCode = d.event()
    const validateAgreementFx = attachWrapper({
        effect: requestFx,
        mapParams: (phone: string) => ({
            method: Method.post,
            body: {
                phone
            },
            url: '/user/send-phone'
        }),
        mapResult: ({ result }: { result: AxiosResponse<void> }) => result.data,
        mapError: ({ error }: { error: AxiosError }) => error.response?.data as ValidateAgreementCodeFxError
    })

    const validateAgreementCodeFx = attachWrapper({
        effect: requestFx,
        mapParams: (payload: ValidateAgreementCodeFxPayload) => ({
            method: Method.post,
            body: payload,
            url: '/user/accept-code',
        }),
        mapResult: ({ result }: { result: AxiosResponse<void> }) => result.data,
        mapError: ({ error }: { error: AxiosError }) => error.response?.data as ValidateAgreementCodeFxError
    })

    const agreementForm = createForm({
        domain: d,
        fields: {
            phone: {
                init: '',
                rules: [
                    requiredValidator,
                ],
            },
            code: {
                init: '',
                rules: [
                    requiredValidator,
                ],
            },
        },
        validateOn: ['submit'],
    })


    $agreementStep
        .on(validateAgreementFx.done, () => AgreementStep.code)

    sample({
        clock: validateAgreements,
        source: agreementForm.$values,
        fn: ({ phone }) => phone,
        target: validateAgreementFx,
    })

    sample({
        clock: validateAgreementsCode,
        source: agreementForm.$values,
        target: validateAgreementCodeFx,
    })


    sample({
        clock: guard({
            clock: validateAgreementFx.failData,
            filter: (d) => d.message.type === 'errorPhone',
        }),
        fn: ({ message }) => ({
            rule: 'errorPhone',
            errorText: message.text
        }),
        target: agreementForm.fields.phone.addError
    })

    sample({
        clock: guard({
            clock: validateAgreementCodeFx.failData,
            filter: (d) => d.message.type === 'errorCode',
        }),
        fn: ({ message }) => ({
            rule: 'errorCode',
            errorText: message.text
        }),
        target: agreementForm.fields.code.addError
    })


    sample({
        clock: validateAgreementFx.done,
        fn: () => ({
            message: 'Код был отправлен по СМС',
        }),
        target: showNotification
    })

    /*
        Здесь мы можем выбрать, какие юниты мы хотим пошарить внешнему миру
    */
    return {
        validateAgreementCodeFx,
        validateAgreementFx,
        validateAgreements,
        validateAgreementsCode,
        $agreementStep,
        agreementForm
    }
}

```

Ниже приведена фабрика, создающая компонент под модель из примера выше:

```tsx
import React from 'react'
import styled from 'styled-components'
import { useForm } from 'effector-forms'
import { useStore } from 'effector-react'

import { Button, FormField, FormLabel, Input, LinkButton } from '@/ui'
import { createAgreementFactoryModel } from '../../model'
import { AgreementStep } from '../../model/types'

export const createAgreementForm = ({
    agreementForm,
    $agreementStep,
    validateAgreementCodeFx,
    validateAgreements,
    validateAgreementsCode
}: ReturnType<typeof createAgreementFactoryModel>) => {

    const AgreementForm = () => {
        const { fields } = useForm(agreementForm)
        const agreementStep = useStore($agreementStep)
        const loading = useStore(validateAgreementCodeFx.pending)

        return (
            <>
                <FormField>
                    <FormLabel>Телефон</FormLabel>
                    <Input
                        value={fields.phone.value}
                        onChange={fields.phone.onChange}
                        hasError={fields.phone.hasError()}
                        errorText={fields.phone.errorText()}
                        placeholder='+7 (999) 000 00 00'
                        disabled
                    />
                </FormField>

                {agreementStep === AgreementStep.phone && (
                    <ButtonWrapper>
                        <Button onClick={() => validateAgreements()}>
                            Отправить код
                        </Button>
                    </ButtonWrapper>
                )}
                {agreementStep === AgreementStep.code && (
                    <>
                        <FormField>
                            <FormLabel>Код</FormLabel>
                            <Input
                                type="code"
                                value={fields.code.value}
                                onChange={fields.code.onChange}
                                hasError={fields.code.hasError()}
                                errorText={fields.code.errorText()}
                                placeholder=''
                            />
                        </FormField>
                        {!loading && (
                            <ButtonWrapper>
                                <LinkButton
                                    onClick={() => validateAgreements()}
                                >
                                    Запросить код ещё раз
                                </LinkButton>
                            </ButtonWrapper>
                        )}
                        <ButtonWrapper>
                            <Button
                                onClick={() => validateAgreementsCode()}
                                loading={loading}
                            >
                                Отправить код
                            </Button>
                        </ButtonWrapper>
                    </>
                )}
            </>
        )
    }
    return AgreementForm

}
```

## Использование 

Созданную выше фабрику можно экспортировать во внешний мир, и переиспользовать в других фичах:

### Model

```ts
// @/features/buy-product/model/private.ts
import { createAgreementFactoryModel } from '@/features/agreement-compose/model'
import { d } from './domain'

export const {
    validateAgreementCodeFx,
    validateAgreementFx,
    validateAgreements,
    validateAgreementsCode,
    $agreementStep,
    agreementForm
} = createAgreementFactoryModel({ d })

```


### View

```ts
// @/features/buy-product/view/entries/Agreement.tsx

import * as AgreementModel from '../../model/private'
import { createAgreementForm } from '@/features/agreement-compose/view'

export const AgreementForm = createAgreementForm(AgreementModel)

```