# 🐳 Arch CLI

Для более быстрой развертки и начала разработки вы можете использовать бойлерплейт, 
который уже содержит все необходимые пакеты а также позволяет создавать различные сущности в проекте с помощью CLI.

## Установка

```bash
$ npm -G @42px/frontend-arch-cli
```

## Создание проекта

Для создания проекта используйте следующую команду

```bash
$ arch-cli project:init projectName
```

В результате данной команды будет склонирован репозиторий с бойлерплейтом https://github.com/qvlxty/42px-fs-arch-boilerplate

## CLI комманды

### Фичи

```bash
$ arch-cli create feature todo
```
Создаёт фичу с директориями view/model, и подключить её в `@/src/init.ts`

### login-фича

```bash
$ arch-cli login:create 
```

Создает базовый слепок логики для фичи авторизации

### dal rest-api 

```bash
$ arch-cli dal:create 
```

Создает data-access-layer с авторизованным эффектом authRequestFx 

### theming

```bash
$ arch-cli theming:create 
```

Создает базовые настройки для поддержки тем