import {I18nService, I18nTranslateParams} from './i18n.service';
import {Subscription} from 'rxjs';


export abstract class I18nBasePipe {
  private localeChange: Subscription | undefined;
  private translateChange: Subscription | undefined;

  protected constructor(protected translateService: I18nService) { }


  public _translate(key: string, params?: I18nTranslateParams, onTranslate?: (res: string) => void): void {
    const _onTranslate = (res: string): void => {
      onTranslate?.(res);
      // this.ref.markForCheck();
    };
    this.translateService.get(key, params).subscribe(_onTranslate);
  }


  protected _subscribeOnChanges(onChange: () => void): void {
    if (!this.localeChange) {
      this.localeChange = this.translateService.localeChange.subscribe(() => onChange());
    }
    if (!this.translateChange) {
      this.translateChange = this.translateService.translationChange.subscribe(() => onChange());
    }
  }

  protected _dispose(): void {
    if (this.localeChange) {
      this.localeChange.unsubscribe();
      this.localeChange = undefined;
    }
    if (this.translateChange) {
      this.translateChange.unsubscribe();
      this.translateChange = undefined;
    }
  }

}

