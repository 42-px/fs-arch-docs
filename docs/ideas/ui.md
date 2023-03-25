# 🎨 UI



## Представление

Представление реализуется как React-компоненты. Все компоненты можно разделить на две различные категории:

1. Доменные компоненты. Эти компоненты обладают знанием о предметной области проекта, могут обладать доступом к локальному или глобальному состоянию приложения, доступом к локализации и роутингу. Примеры доменных компонентов: LoginForm, RegisterForm, ProductsList, ConfirmDeletionModal.
2. Презентационные или UI компоненты. Являются "чистыми" (речь не идёт о pure-компонентах) компонентами, реализующими определенные элементы пользовательского интерфейса. Не могут обладать доступом к состоянию приложения, локализации или роутингу. Могут содержать собственное состояние. Примеры UI-компонентов: PrimaryButton, DropDown, Modal, InputField.

Доменные компоненты являются непереиспользуемой частью приложения. UI компоненты, напротив, не завязаны на предметную область и могут переиспользоваться. 

Доменные компоненты находятся в папке ```view``` соответствующей им фичи:
```sh
features/catalog/view
features/app/view
features/sign-in/view
```

Все презентационные компоненты находятся в папке UI. Это ваша библиотека компонентов. При необходимости (а также при условии того что библиотека компонентов получилась хорошо) они могут быть вынесены в отдельный репозиторий. 

При использовании сторонней библиотеки компонентов, здесь стоит располагать кастомные компоненты + врапперы и адаптеры над компонентами библиотеки. 

Структура библиотеки компонентов может быть различной. В большинстве случаев вполне подойдет одноуровневая структура:
```sh
src/ui
└── PrimaryButton
└── Dropdown
└── Cart
```

Структура же директории view внутри фичи жестко определена:
```sh
someFeature/view
└── parts
└── containers
└── entries
└── index.ts - точка входа во "view" модели, реэкспортит компоненты из entries
```

В директории parts располагаются любые вспомогательные компоненты, которые нужны исходя из потребностей стилизации, макета или удобства организации верстки. Это лэйауты, шаблоны, строительные блоки. 

В директории containers располагаются компоненты имеющие доступ к состоянию и событиям. 
В папке entries располагаются компоненты, которые экспортируются во внешний мир. 

Таким образом, образуется следующая иерархия (для удобства миграции с atomic design в скобках приводится название соответствующего вида компонентов в atomic):
1. Компоненты внутри parts (atoms, molecules, templates) импортируют UI компоненты прокидывая в них захардкоженные лэйблы, плейсхолдеры и т.п. или связывая их с локализацией. Данные в parts компоненты передаются через props.
2. Компоненты-контейнеры (organisms) импортируют parts компоненты и прокидывают в них состояние и события из модели. При этом, конейнеры вполне могут содержать верстку или импортировать UI компоненты напрямую, если это удобно. Такого запрета нет. 
3. Компоненты entries (organisms/pages) импортируют компоненты из containers и parts собирая их в цельный монолитный кусок интерфейса (некоторая панелька, список, etc) и отдают внешнему миру. Entries компоненты также могут обладать собственной версткой, если это удобно в конкретном случае.

В завершение, дадим еще одну рекомендацию: не бойтесь создавать большое количество контейнеров, каждый из которых присоединяет свой кусочек состояния. Зачастую это лучше, чем расположить все данные внутри одного огромного контейнера (подробнее см. пункт "Оптимизации производительности")

Не создавайте пустые папки только "Ради структуры". Если в данном view нет parts или containers - не создавайте такую директорию.


## Стили. 

Для стилизации и верстки мы используем популярную библиотеку styled-components, реализующую подход css-in-js. 

Хорошей практикой является выделение темы и стилистических переменных. В идеальном мире в переменные следует выносить всё, включая цвета, отступы (соблюдая иерархию отступов), шрифты. В реальном мире тех макетов с которыми мы имеем дело, хорошо бы не хардкодить цвета. 

Пример организации темы можно посмотреть в src/ui/theming.

## Хорошие практики

Так как в `@/ui` у нас находятся абстрактные компоненты не связанные с бизнес-логикой, мы можем запросто переиспользовать все компоненты из этой части приложения, например, в storybook. Это даёт возможность выделять из проектов целые ui-киты, которые можно переиспользовать.