import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AnimationEvent} from '@angular/animations';
import {filter, Subject, take} from 'rxjs';
import {notificationAnimation} from './notification.animation';
import {MuiNotificationEntity, MuiNotificationEntityOptions} from './notification';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'm-notification',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="m-notification m-raised"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
      [@notificationMotion]="state"
      (@notificationMotion.done)="animationStateChanged.next($event)"
    >
      <m-alert
        [mType]="mEntity.type"
        [mTitle]="mEntity.title"
        [mTitleContext]="options.data"
        [mDescription]="mEntity.content"
        [mDescriptionContext]="options.data"
        [mClosable]="options.closable"
        [mShowIcon]="isIconShown && !mEntity.template"
        (mClose)="mClose.emit(mEntity)"
        [style.animation-duration]="options.duration + 'ms'"
        [class.m-alert__time-remained-animated]="eraseTimerAnimationApplied"
      >
        <ng-container *ngIf="mEntity.template">
          <ng-template [ngTemplateOutlet]="mEntity.template" [ngTemplateOutletContext]="{$implicit: options.data, data: options.data}"></ng-template>
        </ng-container>
      </m-alert>
    </div>
  `,
  animations: [notificationAnimation]
})
export class MuiNotificationComponent implements OnInit, OnDestroy {
  @Input() public mEntity: MuiNotificationEntity;
  @Output() public mClose = new EventEmitter<MuiNotificationEntity>();

  private autoClosable: boolean;

  private eraseTimer: number | null;
  private eraseTimeStart: number;
  private eraseTimeRemained: number;
  public eraseTimerAnimationApplied = false;

  public readonly animationStateChanged = new Subject<AnimationEvent>();

  public constructor(
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    if (this.options.animate) {
      this.applyAnimations();
    }

    this.autoClosable = this.options.duration > 0;
    if (this.autoClosable) {
      this.eraseTimeStart = Date.now();
      this.eraseTimeRemained = this.options.duration;

      this.startEraseTimer();
    }
  }

  public ngOnDestroy(): void {
    if (this.autoClosable) {
      clearTimeout(this.eraseTimer);
    }
    if (this.options.animate) {
      this.animationStateChanged.complete();
    }
  }

  private applyAnimations(): void {
    this.mEntity.state = 'enter';

    if (this.options.animateTimer) {
      this.animationStateChanged.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event.phaseName === 'done' && event.fromState === 'void'),
        take(1)
      ).subscribe(() => this.eraseTimerAnimationApplied = true);
    }

    this.animationStateChanged.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(event => event.phaseName === 'done' && event.toState === 'leave'),
      take(1)
    ).subscribe(() => {
      clearTimeout(this.eraseTimer);
      this.mClose.emit(this.mEntity);
    });
  }

  /* Mouse hovers */

  public onEnter(): void {
    if (this.autoClosable && this.options.pauseOnHover) {
      this.clearEraseTimer();
      this.updateEraseRemainedTime();
    }
  }

  public onLeave(): void {
    if (this.autoClosable && this.options.pauseOnHover) {
      this.startEraseTimer();
    }
  }


  /* Timer magic */

  private startEraseTimer(): void {
    if (this.eraseTimeRemained > 0) {
      this.eraseTimer = window.setTimeout(() => this.finishAnimation(), this.eraseTimeRemained);
      this.eraseTimeStart = Date.now();
    } else {
      this.finishAnimation();
    }
  }

  private clearEraseTimer(): void {
    if (this.eraseTimer !== null) {
      clearTimeout(this.eraseTimer);
      this.eraseTimer = null;
    }
  }

  private updateEraseRemainedTime(): void {
    if (this.autoClosable) {
      this.eraseTimeRemained -= Date.now() - this.eraseTimeStart;
    }
  }

  private finishAnimation(): void {
    this.mEntity.state = 'leave';
    this.cdr.detectChanges();
  }


  /* Getters */

  public get options(): MuiNotificationEntityOptions {
    return this.mEntity?.options;
  }

  public get state(): string | undefined {
    if (this.mEntity.state === 'enter') {
      const placementStates = {
        'topLeft': 'enterLeft',
        'bottomLeft': 'enterLeft',
        'top': 'enterTop',
        'bottom': 'enterBottom',
      };
      return placementStates[this.options.placement] || 'enterRight';
    } else {
      return this.mEntity.state;
    }
  }

  public get isIconShown(): boolean {
    return !['blank', 'message'].includes(this.mEntity.type);
  }
}
