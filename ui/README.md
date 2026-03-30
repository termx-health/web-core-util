# @termx-health/ui

UI component library for the TermX ecosystem.

See `src/components/_example` for the component file structure.

### Type coercion

Use `@BooleanInput()` to coerce any input to boolean:

```ts
class ExampleComponent {
  public static ngAcceptInputType_mProperty: boolean | string;
  @Input() @BooleanInput() public mProperty: boolean;
}
```
