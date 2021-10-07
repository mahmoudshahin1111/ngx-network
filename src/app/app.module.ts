import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Units } from 'projects/ngx-network/src/lib/api/units';
import { NgxNetworkModule } from 'projects/ngx-network/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxNetworkModule.forRoot({
      url: `https://speed.hetzner.de/100MB.bin`,
      speedUnit: Units['mb/s'],
      delay: 100,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
