import { navigation } from './navigation'
import { sidebar } from './sidebar'

export default {
  // site-level options
  title: '42px Frontend Arch.',
  description: 'Feature Sliced',
  base: '/front-arch/',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/42-px/frontend-architecture',
      },
    ],
    nav: navigation,
    sidebar,
    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница'
    },
    outlineTitle: 'Главы',
    logo: '/logo.png',
    footer: {
      message: '42px Company',
      copyright: `Copyright © 2019-${new Date().getFullYear()}`
    }
  }
}
