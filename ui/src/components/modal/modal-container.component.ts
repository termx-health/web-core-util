import {Component, ContentChild, DestroyRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {BooleanInput, toBoolean} from '@termx-health/core-util';
import {NgChanges} from '../core';
import {DEFAULT_MODAL_CONFIG, MuiConfigService, MuiModalConfig} from '../../config';
import {MuiModalComponent, MuiModalContentDirective, MuiModalFooterDirective, MuiModalHeaderDirective} from './modal.component';
import {MuiModalOverlayService} from './modal-overlay.service';
import {MuiModalOptions, MuiModalPlacement} from './modal';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'm-modal',
  template: ``
})
export class MuiModalContainerComponent implements OnInit, OnChanges, OnDestroy {
  public static ngAcceptInputType_mVisible: boolean | string;
  public static ngAcceptInputType_mClosable: boolean | string;
  public static ngAcceptInputType_mMaskClosable: boolean | string;

  private _modalRef: MuiModalComponent;
  private _config: MuiModalConfig;
  private _options: Partial<MuiModalOptions> = {};

  @Input() @BooleanInput() public mVisible: boolean;
  @Input() @BooleanInput() public mClosable: boolean = true;
  @Input() @BooleanInput() public mMaskClosable: boolean = true;
  @Input() public mStyle?: string;
  @Input() public mClass?: string;
  @Input() public mWidth?: number | string;
  @Input() public mPlacement?: MuiModalPlacement | string;
  @Output() public mVisibleChange = new EventEmitter<boolean>();
  @Output() public mOpen = new EventEmitter<void>();
  @Output() public mClose = new EventEmitter<void>();

  @ContentChild(MuiModalHeaderDirective, {read: TemplateRef})
  public set modalHeader(value: TemplateRef<any>) {
    this.updateOptions({header: value});
  }

  @ContentChild(MuiModalContentDirective, {read: TemplateRef})
  public set modalContent(value: TemplateRef<any>) {
    this.updateOptions({content: value});
  }

  @ContentChild(MuiModalFooterDirective, {read: TemplateRef})
  public set modalFooter(value: TemplateRef<any>) {
    this.updateOptions({footer: value});
  }


  public constructor(
    private configService: MuiConfigService,
    private overlayService: MuiModalOverlayService,
    private destroyRef: DestroyRef
  ) {
    this.updateConfig();
  }


  public ngOnInit(): void {
    this.configService.getConfigChange('modal').pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateConfig());
  }

  public ngOnChanges(changes: NgChanges<MuiModalContainerComponent>): void {
    const {mVisible, mClosable, mMaskClosable, mStyle, mClass, mPlacement} = changes;
    if (mVisible) {
      Promise.resolve().then(() => {
        if (this.mVisible) {
          this.open();
        } else {
          this.close();
        }
      });
    }
    if (mClosable) {
      this.updateOptions({closable: toBoolean(this.mClosable)});
    }
    if (mMaskClosable) {
      this.updateOptions({maskClosable: toBoolean(this.mMaskClosable)});
    }
    if (mStyle) {
      this.updateOptions({style: this.mStyle});
    }
    if (mClass) {
      this.updateOptions({className: this.mClass});
    }
    if (mPlacement) {
      this.updateOptions({placement: this.mPlacement as MuiModalPlacement});
    }
  }

  public ngOnDestroy(): void {
    this._modalRef?.overlayRef.detach();
  }


  private updateConfig(): void {
    this._config = {
      ...DEFAULT_MODAL_CONFIG,
      ...this.configService.getConfigFor('modal'),
    };
  }


  public open(): void {
    this._modalRef = this.overlayService.withContainer(MuiModalComponent);
    this._modalRef.updateOptions({
      ...this._config,
      ...this._options,
      open: true
    });

    this._modalRef.afterOpen.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.mOpen.emit());
    this._modalRef.afterClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this._modalRef.overlayRef.detach();
      this.mVisibleChange.emit(false);
      this.mClose.emit();
    });
  }

  public close(): void {
    this._modalRef?.close();
  }

  private updateOptions(config: Partial<MuiModalOptions> = {}): void {
    this._options = {
      ...this._options,
      ...config
    };

    if (this._modalRef) {
      this._modalRef.updateOptions(this._options);
    }
  }
}
