import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClipboardService implements OnDestroy {
  private queue: {content: string, notifier: BehaviorSubject<boolean>}[] = [];
  private queueProcessor$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  private tempTextArea: HTMLTextAreaElement | undefined;
  private window: Window;

  public constructor(
    @Inject(DOCUMENT) public document: Document
  ) {
    this.window = document.defaultView as Window;
    this.initQueue();
  }

  // todo: fix deprecated methods & check browser support/platform

  private initQueue(): void {
    let processing = false;
    this.queueProcessor$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (processing || this.queue.length === 0) {
        return;
      }

      const {content, notifier} = this.queue.shift()!;
      const didCopy = this.copyFromContent(content);
      notifier.next(didCopy);
      notifier.complete();
      processing = false;

      if (this.queue.length) {
        this.queueProcessor$.next(void 1);
      }
    });
  }

  public copy(content: string): Subject<boolean> {
    const notifier = new BehaviorSubject<boolean>(false);
    const data = {content, notifier};

    this.queue.push(data);
    this.queueProcessor$.next(void 1);

    return notifier;
  }

  public copyFromContent(content: string, container: HTMLElement = this.document.body): boolean {
    if (!this.tempTextArea) {
      this.tempTextArea = ClipboardService.createTextArea(this.document, this.window);
      try {
        container.appendChild(this.tempTextArea);
      } catch (error) {
        throw new Error('Container should be a Dom element');
      }
    }

    // set value
    this.tempTextArea.value = content;
    this.tempTextArea.select();
    this.tempTextArea.setSelectionRange(0, this.tempTextArea.value.length);

    // copy value
    this.document.execCommand('copy');

    // restore state
    this.tempTextArea.focus();
    this.window.getSelection()?.removeAllRanges();
    this.destroy(this.tempTextArea.parentElement || undefined);

    this.queueProcessor$.next(void 1);
    return true;
  }

  private static createTextArea(doc: Document, window: Window): HTMLTextAreaElement {
    const ta: HTMLTextAreaElement = doc.createElement('textarea');
    ta.style.fontSize = '12pt';

    ta.style.border = '0';
    ta.style.padding = '0';
    ta.style.margin = '0';

    ta.style.position = 'absolute';
    ta.style.left = '-9999px';

    const yPosition = window.pageYOffset || doc.documentElement.scrollTop;
    ta.style.top = yPosition + 'px';
    ta.setAttribute('readonly', '');
    return ta;
  }

  public destroy(container: HTMLElement = this.document.body): void {
    if (this.tempTextArea) {
      container.removeChild(this.tempTextArea);
      this.tempTextArea = undefined;
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(void 1);
    this.destroy$.complete();
  }

}
