import {Injectable} from '@angular/core';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {MuiEditableTableComponent} from './editable-table.component';
import {findFocusableElements, isNil} from '@termx-health/core-util';
import {ExtendedKeyboardEvent} from 'angular2-hotkeys';


function findFormControl(el: HTMLElement): HTMLElement {
  if (!el || el.attributes['data-type']?.nodeValue === 'editable-table-form-control') {
    return el;
  }
  return findFormControl(el.parentElement);
}


@Injectable({providedIn: 'root'})
export class MuiEditableFlexTableHotkeysManager<T> {
  private focus: {
    component: MuiEditableTableComponent<T>,
    rowIndex?: number,
    colIndex?: number
  };

  public constructor(hotkeysService: HotkeysService) {
    const triggers: Record<string, (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean> = {
      'tab': e => {
        const target = e.target as HTMLElement;
        const elements = findFocusableElements(findFormControl(target)).map(el => el.contains(target));
        return !elements[elements.length - 1] || this.navigateTab(1);
      },
      'shift+tab': e => {
        const target = e.target as HTMLElement;
        const elements = findFocusableElements(findFormControl(target)).map(el => el.contains(target));
        return !elements[0] || this.navigateTab(-1);
      },

      'ctrl+up': () => this.navigateArrows(-1, 0),
      'ctrl+down': () => this.navigateArrows(1, 0),
      'ctrl+right': () => this.navigateArrows(0, 1),
      'ctrl+left': () => this.navigateArrows(0, -1),

      'ctrl+shift+a': () => this.addRow(),
      'ctrl+shift+d': () => this.deleteCurrentRow()
    };


    Object.entries(triggers).forEach(([combo, clb]) => {
      hotkeysService.add(new Hotkey(combo, clb, ['INPUT', 'SELECT', 'TEXTAREA']));
    });
  }

  public attach(opts: {
    component: MuiEditableTableComponent<T>,
    rowIndex?: number,
    colIndex?: number
  }): void {
    this.focus = opts;
  }

  public detach(): void {
    this.focus = undefined;
  }


  private navigateArrows(deltaRow, deltaCol: -1 | 0 | 1): boolean {
    if (isNil(this.focus) || isNil(this.focus.colIndex)) {
      return true;
    }
    this.focus.component.navigateArrows({row: this.focus.rowIndex, col: this.focus.colIndex}, {row: deltaRow, col: deltaCol});
    return false;
  }


  private navigateTab(delta: -1 | 1): boolean {
    if (isNil(this.focus) || isNil(this.focus.colIndex)) {
      return true;
    }
    this.focus.component.navigateTab(this.focus.rowIndex, this.focus.colIndex, delta);
    return false;
  }

  private addRow(): boolean {
    if (isNil(this.focus)) {
      return true;
    }
    const c = this.focus.component;
    if (!c.mEditAllowed || !c.mAddAllowed) {
      return false;
    }
    c.initRow(false);
    c.editRow(c.mData.length - 1, c['_columns'][this.focus.colIndex]?.mName);
    return false;
  }

  private deleteCurrentRow(): boolean {
    if (isNil(this.focus)) {
      return true;
    }
    const c = this.focus.component;
    if (!c.mEditAllowed || !c.mDeleteAllowed || c.mData.length === 0) {
      return false;
    }
    if (c.deleteCandidateIdx === undefined || c.deleteCandidateIdx !== this.focus.rowIndex) {
      c.setDeleteCandidateIdx(this.focus.rowIndex);
      this.navigateArrows(0, 0);
    } else {
      c.removeRow(this.focus.rowIndex);
      c.resetDeleteCandidateIdx();

      if (c.mData.length) {
        this.focus.component.navigateArrows({row: this.focus.rowIndex, col: this.focus.colIndex}, {row: 0, col: 0}, false);
      }
    }
    return false;
  }
}
