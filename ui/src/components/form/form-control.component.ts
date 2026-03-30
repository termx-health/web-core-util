import {AfterContentChecked, Component, Input, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {AbstractControl, ControlContainer, UntypedFormGroup, ValidationErrors} from '@angular/forms';
import {NzFormStatusService} from 'ng-zorro-antd/core/form';


@Component({
  standalone: false,
  selector: 'm-form-control, [m-form-control]',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
    <div class="m-form-control-error-explain" *ngIf="errors && mShowExplain">
      <span *ngFor="let code of errors | keys">
        {{P + code | i18n: errors}}
      </span>
    </div>
  `,
  host: {
    class: 'm-form-control',
    '[class.m-form-control--has-error]': `errors`,
  },
  providers: [NzFormStatusService]
})
export class MuiFormControlComponent implements OnInit, AfterContentChecked {
  @Input() public mName: string = '';
  @Input() public mShowExplain: boolean = true;

  public readonly P = 'marina.ui.form.validationError.';
  public controls: {[p: string]: AbstractControl} | undefined | null;

  public constructor(
    @Optional() private cc: ControlContainer,
    @Optional() public nzFormStatusService?: NzFormStatusService,
  ) {}

  public ngOnInit(): void {
    this.controls = this.cc?.control && (this.cc.control as UntypedFormGroup).controls;
  }

  public ngAfterContentChecked(): void {
    // fixme(remove zorro): Remove zorro or drop dependencies on zorro's inputs!
    //  Starting from zorro 13.3.0 update, they have changed the behaviour of 'ant-form-item-has-error' class, that was previously used to outline input red on error. Now it is done programmatically.
    //  This hack/fix/implementation relies on providing NzFormStatusService that every zorro input uses internally to correctly style the input.

    if (this.nzFormStatusService && this.controls?.[this.mName]) {
      const {dirty, errors} = this.controls[this.mName] || {};
      const status = dirty && errors ? 'error' : undefined;

      this.nzFormStatusService.formStatusChanges.next({
        status: status,
        hasFeedback: false
      });
    }
  }


  public get errors(): ValidationErrors | null {
    return this.controls?.[this.mName]?.dirty && this.controls?.[this.mName]?.errors;
  }
}
