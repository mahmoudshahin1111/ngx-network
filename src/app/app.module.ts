import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNetworkModule, Units } from 'ngx-network';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxNetworkModule.forRoot({
      url:`https://raw.githubusercontent.com/mahmoudshahin1111/ngx-network/master/src/assets/mocks/1mb.jpg`,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
