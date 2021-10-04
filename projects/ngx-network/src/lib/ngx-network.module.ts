import { NgModule } from '@angular/core';
import { NgxNetworkComponent } from './ngx-network.component';
import {HttpClientModule} from '@angular/common/http'; 


@NgModule({
  declarations: [
    NgxNetworkComponent
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    NgxNetworkComponent,
  ]
})
export class NgxNetworkModule { }
