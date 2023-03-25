import { DefaultTheme } from 'vitepress'

export const navigation: DefaultTheme.NavItem[] = [
    {
        text: 'Дока',
        link: '/introduction/what-is-this',
    },
    {
        text: 'Элементы',
        activeMatch: '^/(api)/',
        items: [
            { text: '💾 @/dal', link: '/dal/intro' },
            { text: '📦 @/features', link: '/ideas/feature' },
            { text: '🎨 @/ui', link: '/ideas/ui' },
            { text: '📄 @/pages', link: '/ideas/pages' },
            { text: '📚 @/lib', link: '/helpers/intro' },
        ],
    },
    {
        text: 'Наш сайт',
        link: 'https://42px.org',
    },
]