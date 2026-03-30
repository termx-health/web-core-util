import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  Optional,
  SecurityContext,
  SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput, isNil, toBoolean} from '@termx-health/core-util';
import {fromEvent} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {DEFAULT_RICH_TEXT_CONFIG, MUI_QUILL_CONFIG, MuiQuillConfig} from './quill.config';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


// fixme: https://github.com/quilljs/quill/issues/3497
// import Quill from 'quill';
declare const Quill: any;


@Component({
  standalone: false,
  selector: 'm-quill',
  host: {'[class.m-quill-wrapper]': 'true'},
  template: `
    <div id="quill-wrapper"></div>
  `,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiQuillComponent), multi: true}]
})
export class MuiQuillComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
  public static ngAcceptInputType_mSanitize: boolean | string;
  public static ngAcceptInputType_mCompareValues: boolean | string;
  public static ngAcceptInputType_mViewMode: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public mToolBarConfig?: any;

  @Input() public mFormat: string | 'html' | 'text' | 'json' | 'object' = 'html';
  @Input() @BooleanInput() public mSanitize: boolean = true;
  @Input() @BooleanInput() public mCompareValues: boolean = true;
  @Input() @BooleanInput() public mViewMode: boolean;
  @Input() @BooleanInput() public disabled: boolean;


  public quillEditor: any;
  private _content: any;
  private _config: any;

  private onChange: (_: string) => void = () => undefined;
  private onTouch: () => void = () => undefined;

  public constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private domSanitizer: DomSanitizer,
    private destroyRef: DestroyRef,
    @Optional() @Inject(MUI_QUILL_CONFIG) private defaultConfig?: MuiQuillConfig
  ) {
    // todo: implement QuillEditor reload when mToolBarConfig or MuiConfig changes
    this.updateConfig();
  }


  public ngOnChanges(changes: SimpleChanges): void {
    const {mToolBarConfig, mViewMode} = changes;
    if (mToolBarConfig) {
      this.updateConfig();
    }
    if (mViewMode) {
      this.setViewMode();
      this.setDisabledState(this.mViewMode);
    }
  }

  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const q = this.quillEditor = new Quill(this.elementRef.nativeElement.querySelector('#quill-wrapper'), {
        theme: 'snow',
        modules: this._config
      });

      this.addListeners(q);
      this.setDisabledState();
      this.setViewMode();

      if (this._content) {
        const val = this.transformValue(this.quillEditor, this._content);
        this.quillEditor.setContents(val);
      }
    });
  }


  /* Public API */

  public getBounds(index: number, length: number = 0): {left: number, top: number, height: number, width: number} {
    return this.quillEditor.getBounds(index, length);
  }

  public getSelection(): {index: number, length: number} {
    return this.quillEditor.getSelection();
  }

  public setSelection(index: number, length: number = 0, source: string = 'api'): void {
    this.quillEditor.setSelection(index, length, source);
  }

  public getText(index: number = 0, length?: number): string {
    return this.quillEditor.getText(index, length ?? this.quillEditor.getLength());
  }

  public deleteText(index: number, length: number, source: string = 'api'): void {
    this.quillEditor.deleteText(index, length, source);
  }

  public insertText(index: number, text: string, source: string = 'api'): void {
    this.quillEditor.insertText(index, text, source);
  }


  /* Internal API */

  private updateConfig(): void {
    const toolbar = this.mToolBarConfig || this.defaultConfig?.toolBarConfig || DEFAULT_RICH_TEXT_CONFIG.toolBarConfig;
    this._config = {toolbar};
  }

  private addListeners(q): void {
    fromEvent(q, 'text-change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.ngZone.run(() => {
        const val = this.getFormattedValue(this.quillEditor, this.elementRef.nativeElement.querySelector('#quill-wrapper'));
        this.onChange(val);
      });
    });

    fromEvent(q, 'selection-change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.ngZone.run(() => this.onTouch());
    });
  }

  private setViewMode(viewMode = this.mViewMode): void {
    const editor = this.elementRef.nativeElement.getElementsByClassName("ql-container")?.[0];
    const toolBar = this.elementRef.nativeElement.getElementsByClassName("ql-toolbar")?.[0];
    if (isNil(toolBar) || isNil(editor)) {
      return;
    }
    if (viewMode) {
      editor.style?.setProperty("border", "none");
      toolBar.style?.setProperty("display", "none");
    } else {
      editor.style?.removeProperty("display");
      toolBar.style?.removeProperty("display");
    }
  }

  private getFormattedValue = (ql: any, element: HTMLElement): string | any => {
    let html: string | null = element.querySelector('.ql-editor')!.innerHTML;
    if (html === '<p><br></p>' || html === '<div><br></div>') {
      html = "";
    }

    if (this.mFormat === 'html') {
      return html;
    }
    if (this.mFormat === 'text') {
      return ql.getText();
    }
    if (this.mFormat === 'object') {
      return ql.getContents();
    }
    if (this.mFormat === 'json') {
      try {
        return JSON.stringify(ql.getContents());
      } catch (e) {
        return ql.getText();
      }
    }

    throw Error(`Unsupported format: ${this.mFormat}`);
  };

  private transformValue = (ql: any, value: any): any => {
    if (this.mFormat === 'html') {
      const sanitizedValue = toBoolean(this.mSanitize) ? this.domSanitizer.sanitize(SecurityContext.HTML, value) : value;
      return ql.clipboard.convert({html: sanitizedValue});
    }
    if (this.mFormat === 'text') {
      return ql.clipboard.convert({text: value});
    }
    if (this.mFormat === 'json') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [{insert: value}];
      }
    }
    return value;
  };


  public writeValue(val: string): void {
    this._content = val;
    if (!this.quillEditor) {
      return;
    }

    const newContent = this.transformValue(this.quillEditor, val);

    if (this.mCompareValues) {
      const currentEditorValue = this.quillEditor.getContents();
      if (JSON.stringify(currentEditorValue) === JSON.stringify(newContent)) {
        return;
      }
    }

    if (newContent) {
      this.quillEditor.setContents(newContent);
      return;
    }

    this.quillEditor.setText('');
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean = this.disabled): void {
    this.disabled = isDisabled;

    if (this.quillEditor) {
      if (this.disabled) {
        this.quillEditor.disable();
      } else {
        this.quillEditor.enable();
      }
    }
  }
}
