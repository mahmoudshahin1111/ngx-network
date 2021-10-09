import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Units } from 'projects/ngx-network/src/lib/api/units';
import { NgxNetworkModule } from 'projects/ngx-network/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxNetworkModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
