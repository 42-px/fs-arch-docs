# Тестирование

Для unit-тестов рекомендуется использовать jest + @testing-library/react (если нужны тесты на компоненты или хуки).

Так как в данной архитектуре компоненты никогда не содержат бизнес-логики и состояния, в большинстве случаев покрытия тестами моделей достаточно (однако ничто не мешает тестировать также рендеринг компонентов).

При тестировании модели ОЧЕНЬ важно форкать корневой домен приложения в каждом тесте (или в хуке `beforeEach`, если параметры форка во всех тестах идентичны) и проверять состояния в рамках заданного скоупа. Это позволяет не думать о сайд-эффектах, а также значительно облегчает создание мок. Для типобезопасных мок рекомендуется использовать хелперы `mockEffects` и `mockStores` из библиотеки [@42px/effector-extra](https://www.npmjs.com/package/@42px/effector-extra):

```ts
const mockCartStorage = () => {
  let cartStorage: CartItem[] = []

  return mockEffects()
    .set(writeCartFx, (cart) => {
      cartStorage = cart
    })
    .set(readCartFx, () => cartStorage)
}

let scope: Scope

test('add to cart', async () => {
  scope = fork(root, {
    handlers: mockCartStorage(),
  })
})
```

При тестировании моделей вы просто императивно вызываете события, так, как будто бы они являются пользовательским вводом, проверяете значения сторов и количество вызовов эффектов (через `jest.fn`).

Обращения к внешнему API подменяются на моки.

Пример юнит-теста на модель можно посмотреть в [features/cart/model/model.spec.ts](https://github.com/42-px/frontend-architecture/tree/master/examples/react/src/features/cart/model/model.spec.ts)

Покрывать тестами элементарные модели зачастую слишком затратно. Однако если в модели имеются нетривиальные вычисления, всегда лучше написать тест, чем накликивать в браузере (это действительно экономит время).

Разумеется, тестами следует покрывать создаваемые в процессе работы над проектом библиотеки.

Помните, что хоть какие-то тесты всегда лучше, чем их отсутствие.
