# metro-ui

Единая дизайн-система сервисов `metro*` (metroLog, metroGen, metroCheck,
metroAccounts) в виде **[shadcn-реестра](https://ui.shadcn.com/docs/registry)**.

Это **источник правды по внешнему виду**: токены и темы, каркас приложения
(шелл), переключатель темы и примитивы. Сервисы не заводят свой цвет, свой
шрифт и свои контролы — они ставят items отсюда. Цель — чтобы по интерфейсу
нельзя было понять, в каком сервисе ты находишься.

Тема **только тёмная** и переключается атрибутом `data-theme` на `<html>`;
по умолчанию — `dark`.

## Что внутри

### Тема и тема-инфраструктура

| Item | Тип | Что даёт |
|------|-----|----------|
| `@metro/metro-theme` | `registry:file` | тёмная палитра + `tokyonight`, `catppuccin`, `kanagawa`, `nord`, `dracula`, `gruvbox`; маппинг переменных shadcn на токены, базовый слой, общие классы; шрифт IBM Plex Sans |
| `@metro/theme-store` | `registry:lib` | стор темы: один ключ `metro.theme` на весь флот, `data-theme`, дефолт `dark`, миграция старых ключей, без зависимостей |
| `@metro/theme-switcher` | `registry:component` | переключатель темы (наше меню, не shadcn-дропдаун) |
| `@metro/version-badge` | `registry:component` | версия и канал релиза рядом с вордмарком |

### Утилиты (`registry:lib`)

| Item | Что даёт |
|------|----------|
| `@metro/utils` | `cn` |
| `@metro/mentions` | разбор `@ФамилияИО` (совпадает с ключом бэкенда) |
| `@metro/numeric-input` | фильтр «только цифры» для числовых полей |

### Примитивы

| Item | Тип | Что даёт |
|------|-----|----------|
| `@metro/button` | component | кнопка |
| `@metro/badge` | component | бейдж |
| `@metro/card` | component | карточка |
| `@metro/switch` | component | переключатель (булевы настройки; чекбоксы — для выбора из списка) |
| `@metro/dialog` | component | диалог: фон **не** закрывает, только кнопка или Escape |
| `@metro/app-dialog` | component | наша оболочка диалога (заголовок, тело, футер) |
| `@metro/select` | component | выбор из списка — **никогда** нативный `<select>` |
| `@metro/searchable-select` | component | поиск по списку, чипы, клавиатура, история запросов |
| `@metro/floating-autocomplete-menu` | component | поверхность выпадающего списка (fixed, портал в диалог) |
| `@metro/date-input` | component | поле даты + календарь (`react-day-picker`, ru) |
| `@metro/number-input` | component | числовое поле (текстовое, `inputMode=numeric`) |
| `@metro/mention-text` | component | текст с подсветкой упоминаний |
| `@metro/icon-action-button` | component | иконочная кнопка действия |
| `@metro/status-badge` | component | бейдж статуса на семантических токенах |
| `@metro/stat-card` | component | карточка метрики |
| `@metro/page-header` | component | заголовок страницы + действия |

### Блок

| Item | Тип | Что даёт |
|------|-----|----------|
| `@metro/app-shell` | `registry:block` | каркас: сворачиваемый сайдбар, мобильный drawer, топбар (бренд, бейдж версии, статус, действия). Всё специфичное для сервиса — слоты |

## Как подключить в сервисе

1. Один раз инициализировать shadcn (Tailwind v4):

```bash
npx shadcn@latest init
```

2. Прописать реестр в `components.json`:

```json
"registries": {
  "@metro": "https://raw.githubusercontent.com/mflkee/metro-ui/main/public/r/{name}.json"
}
```

3. Поставить тему и нужное:

```bash
npx shadcn@latest add @metro/metro-theme @metro/utils
npx shadcn@latest add @metro/app-shell @metro/theme-store @metro/theme-switcher @metro/version-badge
```

4. Подключить тему в `src/index.css` (сразу после Tailwind):

```css
@import "tailwindcss";
@import "./metro-theme.css";
```

5. Применить тему до рендера и отрисовать каркас:

```ts
import { initializeTheme } from "@/lib/theme-store";
initializeTheme();
```

```tsx
<AppShell
  brand="metroLog"
  mobileNavTitle="metroLog"
  nav={[{ items: navItems }]}
  help={{ label: "Справка", items: [helpItem] }}
  versionBadge={<AppVersionBadge version={__APP_VERSION__} stage="beta" />}
  topbarActions={<><ThemeSwitcher /><AccountMenu /></>}
>
  {children}
</AppShell>
```

## Правила флота

- **Скопированный из реестра файл не правим.** Изменение идёт в `metro-ui`, потом
  сервис обновляется (`--overwrite`).
- **Хардкода цвета в сервисе быть не должно** — только токены и классы темы.
- **Только тёмные темы**, каталог курируется; светлой нет.
- **Свои контролы вместо нативных**: `select`/`searchable-select` вместо
  `<select>`, `date-input` вместо `<input type="date">`, `number-input` вместо
  `<input type="number">`, `app-dialog` вместо `window.confirm`.

## Разработка

```bash
npm install
npm run build      # shadcn build -> public/r/*.json (коммитим: их раздаёт raw.githubusercontent)
```

Правки вносим в `registry/<item>/<файл>`, затем `npm run build` и пуш. Потребители
обновляются так:

```bash
npx shadcn@latest add @metro/app-shell --overwrite
```

План унификации и порядок адопции по сервисам — `openspec/changes/unify-metro-ui/`
(`proposal.md`, `design.md`, `tasks.md`).
