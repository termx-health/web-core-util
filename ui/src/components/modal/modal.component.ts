import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {filter, Subject, take} from 'rxjs';
import {OverlayRef} from '@angular/cdk/overlay';
import {modalAnimations} from './modal.animation';
import {AnimationEvent} from '@angular/animations';
import {MuiModalOptions} from './modal';
import {findFocusableElements} from '@termx-health/core-util';
import {HistoryStateManager} from '../core/history-state-manager';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive()
class MuiModalBaseDirective {
  public constructor(public template: TemplateRef<any>) { }
}

@Directive({standalone: false, selector: '[m-modal-header], [mModalHeader]'})
export class MuiModalHeaderDirective extends MuiModalBaseDirective {
}

@Directive({standalone: false, selector: '[m-modal-content], [mModalContent]'})
export class MuiModalContentDirective extends MuiModalBaseDirective {
}

@Directive({standalone: false, selector: '[m-modal-footer], [mModalFooter]'})
export class MuiModalFooterDirective extends MuiModalBaseDirective {
}


@Component({
  standalone: false,
  selector: 'm-modal-container',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="m-modal-wrapper m-modal-wrapper--{{options.placement}}"
      [ngClass]="options.className"
      [style]="options.style"
      mScrollable
      cdkTrapFocus
      tabindex="-1"
      (mousedown)="mouseDown = true"
    >
      <m-card>
        <!-- Header -->
        <ng-container *ngIf="options.header">
          <div *m-card-header class="m-modal__header">
            <ng-container *ngTemplateOutlet="options.header"></ng-container>
            <ng-container *ngIf="options.closable">
              <ng-container *ngTemplateOutlet="closeBtnTpl"></ng-container>
            </ng-container>
          </div>
        </ng-container>

        <div *ngIf="!options.header && options.closable" class="m-modal__fixed-close-button">
          <ng-container *ngTemplateOutlet="closeBtnTpl"></ng-container>
        </div>

        <!-- Content -->
        <div *ngIf="options.content" class="m-modal-content">
          <ng-container *ngTemplateOutlet="options.content"></ng-container>
        </div>

        <!-- Footer -->
        <ng-container *ngIf="options.footer">
          <div *m-card-footer class="m-modal-footer">
            <ng-container *ngTemplateOutlet="options.footer"></ng-container>
          </div>
        </ng-container>
      </m-card>
    </div>


    <ng-template #closeBtnTpl>
      <m-button mShape="circle" mDisplay="text" mSize="small" (mClick)="close()">
        <m-icon mCode="close"></m-icon>
      </m-button>
    </ng-template>
  `,
  host: {
    class: 'm-modal-overlay-panel',
    '[@modalPanel]': `options.animate ? state : undefined`,
    '(@modalPanel.done)': `animationStateChanged.next($event)`,
    '(mouseup)': `setMouseDown(false)`,
    '(click)': `onHostClick($event)`,
    '(window:popstate)': 'dismissModal()'
  },
  animations: [modalAnimations]
})
export class MuiModalComponent implements OnInit, OnDestroy, AfterViewInit {
  private historyManager = new HistoryStateManager();
  private previouslyFocusedElement: HTMLElement;

  public state: 'open' | 'close';
  public options: MuiModalOptions = {};
  public overlayRef: OverlayRef;
  public mouseDown: boolean; // (pointerdown) could be used instead (if behaviour is acceptable)

  public afterOpen = new Subject<void>();
  public afterClose = new Subject<void>();

  public readonly animationStateChanged = new Subject<AnimationEvent>();

  public constructor(
    private host: ElementRef<HTMLElement>,
    private destroyRef: DestroyRef
  ) {}


  public ngOnInit(): void {
    this.historyManager.pushState();

    if (this.options.animate) {
      this.animationStateChanged.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event.phaseName === 'done' && event.toState === 'close'),
        take(1)
      ).subscribe(() => this.afterClose.next());
    }

    this.overlayRef.keydownEvents().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(e => e.key === 'Escape')
    ).subscribe(() => this.close());

    this.afterOpen.next();
  }


  public ngOnDestroy(): void {
    this.historyManager.resetState();
    this.restoreFocus();
  }

  public ngAfterViewInit(): void {
    this.savePreviouslyFocusedElement();
  }


  public open(): void {
    this.updateOptions({open: true});
  }

  public close(): void {
    if (this.options.animate) {
      this.updateOptions({open: false});
      return;
    }

    this.afterClose.next();
  }

  public updateOptions(options: Partial<MuiModalOptions> = {}): void {
    if ('open' in options) {
      this.state = options.open ? 'open' : 'close';
    }
    this.options = {
      ...this.options,
      ...options
    };
  }


  protected onHostClick(e: MouseEvent): void {
    if (e.target === e.currentTarget && !this.mouseDown && this.options.maskClosable) {
      this.close();
    }
  }

  protected dismissModal(): void {
    if (this.historyManager.isPrevious) {
      this.close();
    }
  }


  private savePreviouslyFocusedElement(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    setTimeout(() => {
      const trapFocusContainer = this.host.nativeElement.querySelector('div[cdktrapfocus]');
      const focusableElements = findFocusableElements(trapFocusContainer);

      if (focusableElements.length > 1 && this.options.closable) {
        // ignore modal's close button
        focusableElements[1]?.focus();
      } else {
        focusableElements[0]?.focus();
      }
    });
  }

  private restoreFocus(): void {
    const activeElement = document.activeElement;
    const host = this.host.nativeElement;

    if (
      !activeElement ||
      activeElement === host ||
      host.contains(activeElement)
    ) {
      this.previouslyFocusedElement.focus();
    }
  }

  protected setMouseDown(isDown: boolean): void {
    setTimeout(() => this.mouseDown = isDown);
  }
}
