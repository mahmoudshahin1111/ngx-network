import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNetworkModule, Units } from 'projects/ngx-network/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxNetworkModule.forRoot({
      url:`https://raw.githubusercontent.com/jrquick17/ng-speed-test/02c59e4afde67c35a5ba74014b91d44b33c0b3fe/demo/src/assets/500kb.jpg`,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
