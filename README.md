# Kodality Utils

## Build

```shell
npm run build
```

### Local Paths (dev)

* Run`npm run watch`
* In projects that calls local libraries:
    * Configure `package.json`
      ```json
       {
          "dependencies": {
             "@kodality-web/core-util": "file:path_to_this_project/dist/core-util",
             "@kodality-web/core-misc": "file:path_to_this_project/dist/core-misc"
          }
       }
       ```
    * run `npm install`
    * add `projects.$name.architect.build.options.preserveSymlinks: true` to `angular.json`

## Publish

```shell
npm login --registry=https://kexus.kodality.com/repository/npm/
npm set @kodality-web:registry https://kexus.kodality.com/repository/npm/
npm run publish
```

## Setup

Install as dependency.

### Translations

1. Import library assets into project in `angular.json`
    ```json
     {
      "assets": [
        "src/favicon.ico",
        "src/assets",
        {
          "glob": "**/*",
          "input": "./node_modules/@kodality-web/core-util/assets/i18n",
          "output": "/assets/i18n/core-util/"
        }
      ]
    }
    ```
2. Configure `I18nModule` in `app.module.ts`
    ```ts
    export function translateLoader(http: HttpClient): I18nTranslateLoader {
      // files get deep merged
      return new I18nHttpTranslateLoader(http, {
        resources: [
          {prefix: './assets/i18n'},
          {prefix: './assets/i18n/core-util'}
        ]
      });
    }

    @NgModule({
      //... omitted properties
      imports: [
        CoreUtilModule,
        I18nModule.forRoot({
          loader: {
            provide: I18nTranslateLoader,
            useFactory: translateLoader,
            deps: [HttpClient]
          }
        })
      ]
   })
   ```

    * Alternative configuration with core-util namespace
    ```ts
    export function translateLoader(http: HttpClient): I18nTranslateLoader {
      return new I18nHttpTranslateLoader(http, {
        resources: [
          {prefix: './assets/i18n'},
          {prefix: './assets/i18n/core-util', namespace: 'the-best-module'}
        ]
      });
    }

    @NgModule({
      //... omitted properties
      imports: [
        CoreUtilModule.forRoot({
          namespace: 'the-best-module'
        }),
        I18nModule.forRoot({
          loader: {
            provide: I18nTranslateLoader,
            useFactory: translateLoader,
            deps: [HttpClient]
          }
        })
      ]
   })
   ```
    * To use translations along ngx-translate, simply proxy changes to `I18nModule`
   ```ts
    export class AppModule {
      constructor(
        private translateService: TranslateService,
        private i18nService: I18nService
      ) {
        this.translateService.onLangChange.subscribe(({lang}) => {
          this.i18nService.use(lang);
        })
      }
   }
    ```

    Inspired by **ngx-translate**.  
    Useful resource: *https://stackblitz.com/edit/translations-and-lazy-loading?file=src%2Fapp%2Fnon-lazy-loaded%2Fnon-lazy-loaded.module.ts*


