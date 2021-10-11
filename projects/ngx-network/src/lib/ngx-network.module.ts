import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxNetworkService } from './ngx-network.service';
import { Config } from './api/config';
import { Units } from './api/units';
import { ModuleConfig } from './api/module-config';

export const NGX_NETWORK_CONFIG = 'NGX_NETWORK_CONFIG';

@NgModule({
  imports: [HttpClientModule],
})
export class NgxNetworkModule {
  static forRoot(config?: ModuleConfig): ModuleWithProviders<NgxNetworkModule> {
    return {
      ngModule: NgxNetworkModule,
      providers: [
        NgxNetworkService,
        {
          provide: NGX_NETWORK_CONFIG,
          useValue:{
              url:config?.url || `https://speed.hetzner.de/100MB.bin`,
              speedUnit: config?.speedUnit ||  Units['mb/s'],
              delay:config?.delay || 100
          }  as Config
        }
      ],
    };
  }
}
