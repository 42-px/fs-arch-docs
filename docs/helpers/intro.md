# 📚 Библиотеки и хелперы

В процессе работы над проектом очень часто приходится писать много вспомогательных инструментов, хелперов и утилит.

Практика показывает, что если вы помещаете их в один файл `utils.ts` или даже в папку `utils`, она очень быстро становится свалкой для кучи логически несвязанных функций.

Вместо этого мы предлагаем организовывать ваш вспомогательный код в тематические библиотеки, которые располагаются в каталоге `lib`. Хотите написать функцию для специфического форматирования даты? Создайте файл `lib/dates.ts` и поместите ее туда. В дальнейшем там вероятно будут добавлены новые функции, а возможно, когда-нибудь оно превратится в легковесный аналог `moment.js`. Кто знает. Если библиотека продемонстрирует хорошее качество, ее можно будет вынести в отдельный репозиторий/NPM-пакет для переиспользования в других проектах.

> Не создавайте хелперы, создавайте библиотеки.

## Примеры библиотек

Ниже приведены довольно часто используемые `libs` в проектах:

### Валидаторы effector-forms

```ts
export const requiredValidator = {
  name: 'required',
  validator: <T>(value: T) => Boolean(value),
  errorText: 'Поле обязательно для заполнения',
}

export const confirmValidator = {
  name: 'confirmation',
  validator: (confirmation, { password }) => confirmation === password,
  errorText: 'Пароли не совпадают',
}

export const minZeroValidator = {
  name: 'minValidator',
  validator: (value: string) => Number(value) >= 0,
  errorText: 'Значение не может быть отрицательным',
}

// Ниже приведены примеры фабрик-валидаторов, у которых можно настроить текст ошибки
export const flagCheckedValidator = (errorText = '') => ({
  errorText,
  name: 'flagCheckedValidator',
  validator: Boolean,
})

export const allFieldsRequiredValidator = (errorText: string) => ({
  errorText,
  name: 'required',
  validator: (value: string[]) => value.every(Boolean),
})
```

### Работа с датами

```ts
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ru'

dayjs.extend(relativeTime)
dayjs.locale('ru')

export const toNormalDate = (date: string) => dayjs(date).fromNow()
export const toNormalDateFull = (date: string | number) =>
  dayjs(date).format('dd, DD.MM.YY')
```
