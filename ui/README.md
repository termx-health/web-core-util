# UI

See `modules/ui/src/components/_example` folder for the file structure of the component.

### Type coercion

Use `@BooleanInput()` decorator to coerce any type to boolean. Don't forget to add `ngAcceptInputType_*` static property to class with `boolean | string` type.

```ts
class ExampleComponent {
  public static ngAcceptInputType_mProperty: boolean | string;

  @Input() @BooleanInput() public mProperty: boolean;
}
```

### Property configuration

```ts
class ExampleComponent {
  public _mModuleName: MuiConfigKey = 'exampleComponent';

  @Input() @WithConfig() public mProperty: string;

  public constructor(public configService: MuiConfigService) { }
}
```

```ts
export interface MuiConfig {
  exampleComponent?: {
    mProperty: string
  };
}
```
