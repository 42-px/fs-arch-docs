# 📄 Страницы

На практике мы пришли к необходимости выделения в отдельную директорию фич особого рода: фичи-страницы. 
Эти фичи находятся в директории pages (или screens в случае React Native). 

Страницы импортируют отдельные логические компоненты интерфейса из разных фич, собирают их в компоненты страниц и экспортируют наружу (впоследствие они импортируются в роутере). 

Страницы, как и обычные фичи, могут содержать модель и простую логику. 

В отношении страниц действуют два важных ограничения:
1. Страницы могут содержать только простую "лэйаут-логику" - то есть управлять отображением/скрытием отдельных элементов стораницы. Вся бизнес-логика должна оставаться в фичах
2. Страницы импортируют компоненты из фич. Страницы никогда (!) не могут импортироваться внутрь фич

Помимо чисто удобства организации файлов (все страницы в одном месте), страницы являются одной из меры борьбы с циклическими зависимостями через компоненты. 


## Пример

Ниже приведён пример страницы корзины интернет-магазина, в котором используется многоступенчатое оформление заказа.

```ts
import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'

import {
    ContentWrapper,
    Header1,
    SimpleLoader
} from '@/ui'
import { LARGE_WIDTH_PX } from '@/ui/theming'
import {
    $basketStep,
    $loadingBasket,
    $showRelativeProducts,
    BasketStep,
    resetBasketTargetOrderId,
    setCurrentBasketType
} from '@/features/basket/model'

import {
    BasketFirstNav,
    SelectProduct,
} from '@/features/basket/view'
import { RelativeProducts } from '@/features/product/view'
import { BasketDate } from '@/features/basket-date/view'
import { BasketWayRecieve } from '@/features/basket-recieve/view'
import { BasketPayment } from '@/features/basket-payment/view'
import { BasketContract } from '@/features/basket-contract/view'
import { BasketAgreement } from '@/features/basket-agreement/view'
import { BasketTransaction } from '@/features/basket-transaction/view'
import { SuccessMessage } from '../containers'


export const BasketPage = () => {
    const step = useStore($basketStep)
    const showRelativeProducts = useStore($showRelativeProducts)
    React.useEffect(() => {
        setCurrentBasketType('goods')
        return () => resetBasketTargetOrderId()
    }, [])
    const loadingBasket = useStore($loadingBasket)
    if (step === BasketStep.agreementSign) {
        return (<BasketAgreement />)
    }
    return (
        <>
            <Container>
                <PageHeaderWrapper>
                    <Header1>Корзина</Header1>
                    {loadingBasket && <SimpleLoader />}
                </PageHeaderWrapper>
                <BasketFirstNav />
                {step === BasketStep.selectProducts && (
                    <SelectProduct />
                )}
                {step === BasketStep.selectDate && (
                    <BasketDate />
                )}
                {step === BasketStep.selectWayRecieve && (
                    <BasketWayRecieve />
                )}
                {step === BasketStep.selectPayment && (
                    <BasketPayment />
                )}
                {step === BasketStep.selectContract && (
                    <BasketContract />
                )}
                {step === BasketStep.payment && (
                    <BasketTransaction />
                )}
                {step === BasketStep.done && (
                    <SuccessMessage />
                )}

            </Container>
            {showRelativeProducts && (<RelativeProducts />)}
        </>
    )
}

const PageHeaderWrapper = styled.div`
    padding: 50px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
`

const Container = styled(ContentWrapper)`
    width: 100%;
    max-width: ${LARGE_WIDTH_PX}px;
    display: flex;
    flex-direction: column;
    margin: auto;
    margin-top: 140px;
    padding: 0;
`

```