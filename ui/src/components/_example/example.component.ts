import {Component} from '@angular/core';

@Component({
  standalone: false,
  selector: 'm-example-component',
  template: `
    Example works
  `
})
export class MuiExampleComponent {
  // NB: declare & export MuiExampleComponent in MuiExampleModule
}
