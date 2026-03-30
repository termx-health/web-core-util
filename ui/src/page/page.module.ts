import {NgModule} from '@angular/core';
import {MuiPageHeaderAccessibilityComponent, MuiPageHeaderComponent} from './components/page-header.component';
import {MarinaComponentsModule} from '../components/components.module';
import {CoreDirectivesModule, CoreI18nModule, CorePipesModule, CoreUtilModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../zorro';
import {CommonModule} from '@angular/common';
import {MuiPageLayoutComponent} from './components/page-layout.component';
import {FormsModule} from '@angular/forms';
import {
  MuiPageMenuBlockItemComponent,
  MuiPageMenuComponent,
  MuiPageMenuHorizontalBlockComponent,
  MuiPageMenuVerticalBlockComponent
} from './components/page-menu.component';
import {MuiPageComponent} from './components/page.component';
import {MuiPageBarComponent} from './components/page-bar.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {RouterLink} from '@angular/router';
import {MuiPageTitleComponent} from './components/page-title.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    CoreUtilModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreI18nModule,

    MarinaComponentsModule,
    CoreZorroModule,
    OverlayModule,
  ],
  declarations: [
    MuiPageTitleComponent,

    MuiPageHeaderAccessibilityComponent,
    MuiPageHeaderComponent,

    MuiPageMenuVerticalBlockComponent,
    MuiPageMenuHorizontalBlockComponent,
    MuiPageMenuBlockItemComponent,
    MuiPageMenuComponent,

    MuiPageComponent,
    MuiPageBarComponent,
    MuiPageLayoutComponent,
  ],
  exports: [
    MuiPageTitleComponent,
    MuiPageHeaderComponent,
    MuiPageMenuComponent,
    MuiPageComponent,
    MuiPageBarComponent,
    MuiPageLayoutComponent,
  ]
})
export class MarinPageLayoutModule {
}
