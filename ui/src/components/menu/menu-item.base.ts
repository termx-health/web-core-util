import {MuiSubMenuComponent} from './submenu.component';


export class MuiMenuItemBaseComponent {
  public constructor(public subMenu: MuiSubMenuComponent) { }

  public get mLevel(): number {
    return (this.subMenu?.mLevel ?? 0) + 1;
  }

  public get offset(): number {
    const previousOffset = this.subMenu?.offset ?? 0;
    return previousOffset + 1 + (this.subMenu?.mIcon ? 0.5 : 0);
  }
}

