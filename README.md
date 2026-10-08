# metro-ui

Единая дизайн-система для сервисов `metro*` (metroCheck, metroLog, metroGen, …)
в виде **[shadcn-реестра](https://ui.shadcn.com/docs/registry)**.

Источник правды по стилю: тема (светлая + тёмная), шрифт, семантические цвета и
переиспользуемые блоки (каркас приложения, статус-бейдж, стат-карта, шапка страницы).

## Что внутри

| Item | Тип | Что даёт |
|------|-----|----------|
| `@metro/metro-theme` | `registry:theme` | токены light+dark, шрифт Geist, `--radius`, семантические `success/warning/info` |
| `@metro/theme-provider` | `registry:component` | обёртка `next-themes` (class-стратегия) |
| `@metro/theme-toggle` | `registry:component` | кнопка переключения light/dark/system |
| `@metro/status-badge` | `registry:component` | бейдж статуса на семантических токенах |
| `@metro/stat-card` | `registry:component` | карточка метрики |
| `@metro/page-header` | `registry:component` | заголовок страницы + действия |
| `@metro/app-shell` | `registry:block` | каркас: sidebar + топбар + контент (shadcn `sidebar`) |

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

3. Ставить нужное:

```bash
npx shadcn@latest add @metro/metro-theme
npx shadcn@latest add @metro/app-shell @metro/status-badge @metro/stat-card
```

4. Обернуть приложение в провайдеры (`ThemeProvider` + `TooltipProvider`) и
   положить `<AppShell nav={...} />` как layout-роут.

## Разработка

```bash
npm install
npm run build      # shadcn build -> public/r/*.json (коммитим, их раздаёт raw.githubusercontent)
```

Правки вносим в `registry/<item>/<file>`, затем `npm run build` и пуш.
Потребители обновляются так:

```bash
npx shadcn@latest add @metro/app-shell --overwrite
```
