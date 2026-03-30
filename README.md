# TermX Web Commons

Shared Angular libraries for the [TermX](https://github.com/termx-health) ecosystem.

## Libraries

| Package | Description |
|---------|-------------|
| `@termx-health/core-util` | Core utilities, i18n, pipes, services |
| `@termx-health/ui` | UI component library (forms, tables, modals, etc.) |
| `@termx-health/util` | Shared models and pipes |
| `@termx-health/markdown` | Markdown renderer component |
| `@termx-health/markdown-parser` | Markdown parser (markdown-it + plugins) |
| `@termx-health/quill` | Rich text editor wrapper |

## Build

```shell
npm install
npm run build
```

All 6 libraries are built in dependency order via `scripts/build.sh`.

## Publishing

Packages are published automatically to [GitHub Packages](https://github.com/orgs/termx-health/packages) on push to `main` or `20.0.x` when a library's `package.json` changes.

## Setup

Add the GitHub Packages registry to your project's `.npmrc`:

```
@termx-health:registry=https://npm.pkg.github.com/
```

Install the packages:

```shell
npm i @termx-health/core-util @termx-health/ui @termx-health/util
```

## Locales

To add a missing locale:

- Add a translation file to `core-util/lib/locales/` and register it in `core-util.module.ts`
- Import the corresponding `date-fns` locale in `date.util.ts`

## License

Apache-2.0

