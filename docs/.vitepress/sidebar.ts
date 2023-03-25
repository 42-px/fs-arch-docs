
const sidebar = [
    {
        text: 'Основа',
        collapsed: false,
        items: [
            { text: 'Вступление', link: '/introduction/what-is-this' },
            { text: 'Основные идеи', link: '/ideas/start' },
            {
                text: 'Состояние приложения ',
                collapsed: false,
                items: [
                    { text: 'Иерархия', link: '/statement/hierarchy' },
                    { text: 'Модель', link: '/statement/model' },
                    { text: 'Стадии объявления/инициализации', link: '/statement/stages' },
                    { text: 'Структура модели', link: '/statement/structures' },
                    { text: 'Соглашение о нейминге', link: '/statement/agreement' },
                ]
            },
            { text: '🚀 Производительность', link: '/optimization/main' },
        ]
    },
    {
        text: 'Основные элементы ',
        items: [
            { text: '💾 Data Access Layer (/dal)', link: '/dal/intro' },
            { text: '📦 Фичи (/features)', link: '/ideas/feature' },
            { text: '🎨 UI (/ui + /view)', link: '/ideas/ui' },
            { text: '📄 Страницы (/pages)', link: '/ideas/pages' },
            { text: '📚 Libs/Helpers (/lib)', link: '/helpers/intro' },
        ]
    },
    { text: '🐳 Arch CLI', link: '/tools/boilerplate' },
    {
        text: 'Инструменты',
        items: [
            { text: '📥 Формы', link: '/forms/forms' },
            { text: '🏭 Фабрики ', link: '/tools/factory' },
            { text: '🧭 Навигация', link: '/tools/nav' },
            { text: '🔑 Авторизация', link: '/tools/auth' },
            { text: '🌓 UI-Темы', link: '/tools/theme' },
            { text: '🧪 Тестирование', link: '/testing/intro' },
        ]
    },
]

export { sidebar }