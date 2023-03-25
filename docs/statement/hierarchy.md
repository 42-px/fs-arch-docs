
# Иерархия состояния 

Все состояние в клиентский приложениях можно разделить на три категории (последние две часто объединяют, но для наших целей важно подчеркнуть различие):

1. **Application state** (global state, common state) глобальное состояние, которое может быть востребовано во многих, не связанных друг с другом, частях приложения: профиль текущего пользователя, данные для нотификации, etc
2. **Local state** (ephemeral state) локальное состояние отдельных независимых частей приложения: пользовательский ввод в формах, данные для вывода пользователю (каталог товаров, новости, список постов, комментари)
3. **Element state** состояние конкретного элемента интерфейса: закрыт/открыт выпадающий список, меню или датапикер, активный таб, etc 

Одна из ключевых идей данной архитектуры заключается в следующем

> Как глобальное состояние приложение (Application state), так и состояние его частей (Local state) хранится *только* в эффектор-сторах. Внутри компонентов (```React.useState```) допустимо хранить *только* состояние элементов. 

Глобальное состояние хранится внутри фич "app", "profile", "user" или подобных им фичах. Все прочее локальное состояние - внутри остальных фич.

Ниже будет подробно описан способ организации состояния, вплоть до его распределения по директории.
