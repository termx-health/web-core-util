import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';

// fixme: other name?

@Component({
  standalone: false,
  selector: 'm-collapse-panel',
  templateUrl: 'collapse-panel.component.html',
  host: {
    class: 'm-collapse-panel'
  }
})
export class MuiCollapsePanelComponent implements OnChanges, AfterViewInit, OnDestroy {
  public static ngAcceptInputType_mCollapsed: boolean | string;
  public static ngAcceptInputType_mResizable: boolean | string;


  @Input() public mKey = 'm-collapse-panel-generic';
  @Input() @BooleanInput() public mCollapsed: boolean;
  @Input() public mCollapsePosition: 'left' | 'right' | string = 'left';
  @Input() @BooleanInput() public mResizable: boolean;
  @Input() public mResizableMaxWidth: number = 1000;
  @Input() public mResizableMinWidth: number = 200;

  // fixme: is possible to use host property (reducing div nesting), but styles MUST be without the encapsulation
  @Output() public mCollapsedChange = new EventEmitter<boolean>();

  @ViewChild("container") public sidebar?: ElementRef<HTMLElement>;
  protected viewInitialized: boolean;

  protected resizeData = {
    startWidth: 0,
    startCursorX: 0,
    tracking: false,
  };

  protected collapseData = {
    collapsed: false,
    inProgress: false,
  };


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['mCollapsed']) {
      this.setCollapsed(this.mCollapsed);
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true;

      const width = Math.min(this.sidebar.nativeElement.offsetWidth, this.mResizableMaxWidth);
      this.sidebar.nativeElement.style.width = Math.max(this.mResizableMinWidth, width, 14) + 'px';

      if (localStorage.getItem(this.widthVar)) {
        this.sidebar.nativeElement.style.width = localStorage.getItem(this.widthVar);
      }
      if (localStorage.getItem(this.collapseVar)) {
        this.collapseData.collapsed = localStorage.getItem(this.collapseVar) === 'true';
      }
    });

    document.addEventListener('mousemove', this._resizeMouseMove);
    document.addEventListener('mouseup', this._resizeMouseUp);
  }

  public ngOnDestroy(): void {
    removeEventListener('mousemove', this._resizeMouseMove);
    removeEventListener('mouseup', this._resizeMouseUp);
  }


  /* Resize */

  private _resizeMouseMove = (ev: MouseEvent) => this.resizeMouseMove(ev);
  private _resizeMouseUp = (ev: MouseEvent) => this.resizeMouseUp(ev);

  protected resizeMouseDown(event: MouseEvent): void {
    if (!this.mResizable || this.collapseData.collapsed || this.collapseData.inProgress) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.resizeData.startWidth = this.sidebar.nativeElement.offsetWidth;
    this.resizeData.startCursorX = event.x;
    this.resizeData.tracking = true;
  }

  protected resizeMouseMove(event: MouseEvent): void {
    if (this.resizeData.tracking) {
      const cursorDelta = this.mCollapsePosition === 'right'
        ? this.resizeData.startCursorX - event.x
        : event.x - this.resizeData.startCursorX;

      const width = Math.min(this.resizeData.startWidth + cursorDelta, this.mResizableMaxWidth);
      this.sidebar.nativeElement.style.width = Math.max(this.mResizableMinWidth, width, 14) + 'px';
    }
  }

  protected resizeMouseUp(_): void {
    if (this.resizeData.tracking) {
      localStorage.setItem(this.widthVar, this.sidebar.nativeElement.style.width);
      this.resizeData.tracking = false;
    }
  }


  /* Expand */

  public toggleCollapse(): void {
    this.setCollapsed(!this.collapseData.collapsed);
  }

  public setCollapsed(collapsed: boolean): void {
    this.collapseData.inProgress = true;
    this.collapseData.collapsed = collapsed;
    setTimeout(() => {
      this.collapseData.inProgress = false;
      this.mCollapsedChange.emit(this.collapseData.collapsed);
      localStorage.setItem(this.collapseVar, String(this.collapseData.collapsed));
    }, 250);
  }


  /* Utils */

  private get widthVar(): string {
    return `${this.mKey}__width`;
  }

  private get collapseVar(): string {
    return `${this.mKey}__collapse`;
  }
}
