import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CorePipesModule} from './pipe';
// import {CoreOauthModule} from './oauth/core-oauth.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CorePipesModule,
    // CoreOauthModule
  ],
  declarations: [
  ],
  exports: [
    CorePipesModule,
    // CoreOauthModule
  ]
})
export class CoreUtilModule {
}
