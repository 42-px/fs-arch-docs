# 🌓 UI-Темы

Для работы с темами вы можете переиспользовать целиком ui-модуль из демо-проекта: https://github.com/42-px/frontend-architecture/tree/master/examples/react/src/ui/theming

## Установка

1. Скопируйте директорию в `@/ui`.
2. Подключите `init.ts`:

```ts
// ./src/init.ts

import './ui/theming/init'
```

## API

```ts
changeTheme: Event<string>
```

effector-ивент для изменения темы на ту, название которой надо передать параметром.

```ts
registerTheme: Event<string>
```

effector-ивент, позволяющий императивно регистрировать новую тему.

## Использование

### Хук useTheme

Для доступа к переменным темы можете использовать хук `useTheme`:

```tsx
import { themeVar, useTheme } from '@/ui/theming'


export const MyPopup = () => {
    const theme = useTheme()
    return (
        <Popup
            color={theme.yellow}
        >
            <Container>
               {...}
            </Container>
        </Popup>
    )
}

```

### Инъекция через themeVar

Вы также можете в процессе описания стилей элементов использовать функцию `themeVar`:

```tsx
type NavItemProps = {
  active?: boolean
}
const NavItem = styled.div<NavItemProps>`
  color: ${themeVar('grayNonActive')};
  font-weight: 700;
  padding-bottom: 8px;
  ${({ active }) =>
    Boolean(active) &&
    active &&
    css`
      color: ${themeVar('green')};
      border-bottom: 3px solid ${themeVar('green')};
    `}
`
```

## Добавление тем

Доступные темы находятся в директории `@/ui/theming/themes`.

Для добавления новой темы необходимо:

1. Создать файл с темой.
2. Описать тему. Пример:

```ts
import { ThemeItem } from '../model/types'
import { mainTheme } from './main'

const BASE_FONT = 'Roboto Regular'
const LIGHT_FONT = 'Roboto light'

export const darkTheme = {
  ...mainTheme,
  backgroundColor: 'rgb(25,25,30)',
  contentBg: '#1d1d24',
  fontColor: '#ffffff',
  baseFont: BASE_FONT,
  baseFontLight: LIGHT_FONT,

  default800: '#15151e',
  default700: '#2a2a3c',
  default600: '#3f3f5a',
  default500: '#8888aa',
  default400: '#a5a5c0',

  blue500: '#1E90FF',
  green500: '#6FCF97',

  secondary700: '#1d1d24',

  error: '#F53333',
}
export const createDarkTheme = (): ThemeItem => ({
  name: 'dark',
  variables: darkTheme,
})
```

3. Добавить тему в initial-значение стора из `model/private.ts`:

```ts
export const $availableThemes = privateTheming.store<ThemeItem[]>([
  createDefaultTheme(),
  createDarkTheme(),
])
```
