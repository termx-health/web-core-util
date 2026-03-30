import {Directive, EventEmitter, Input, OnChanges, Optional, TemplateRef} from '@angular/core';
import {NgChanges} from '../core';

@Directive({
  standalone: false,
  selector: '[m-dropdown-item], [mDropdownItem], [mDropdownItemIf]'
})
export class MuiDropdownItemDirective implements OnChanges {
  @Input('mDropdownItemIf') public mVisible: boolean = true;
  public visibleChanged = new EventEmitter<boolean>();

  public constructor(@Optional() public template: TemplateRef<any>) { }

  public ngOnChanges(changes: NgChanges<MuiDropdownItemDirective>): void {
    const {mVisible} = changes;
    if (mVisible) {
      this.visibleChanged.emit(this.mVisible);
    }
  }
}
