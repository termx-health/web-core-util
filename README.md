# Kodality Utils

## Build

```shell
npm run build
```

### Local Paths (dev)

* Run`npm run watch`
* In projects that calls libraries:
    * Configure `package.json`
      ```json
       {
          "dependencies": {
             "@kodality-web/core-util": "file:path_to_this_project/dist/core-util"
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

### Library translations

In order to use locales other than **en**

  ```ts
  import localeEt from '@angular/common/locales/et';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localeEt)
  ```

Proxy **ngx-translate** lang changes to `CoreI18nModule`

  ```ts
  export class AppModule {
  constructor(
    private translateService: TranslateService,
    private i18nService: CoreI18nService
  ) {
    this.translateService.onLangChange.subscribe(({lang}) => {
      this.i18nService.use(lang);
    })
  }
}
  ```

Proxy **ngx-translate** traslations to `CoreI18nModule`

```ts
export function TranslationHandlerFactory(translateService: TranslateService): CoreI18nTranslationHandler {
  return (key, params) => translateService.instant(key, params);
}

@NgModule({
  // imports & declarations & stuff
  providers: [
    {provide: TRANSLATION_HANDLER, useFactory: TranslationHandlerFactory, deps: [TranslateService]}
  ]
})
export class AppModule {}
```

Useful resource: *https://stackblitz.com/edit/translations-and-lazy-loading?file=src%2Fapp%2Fnon-lazy-loaded%2Fnon-lazy-loaded.module.ts*


