import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxNetworkService } from './ngx-network.service';
import { Config } from './api/config';
import { Units } from './api/units';

export const NGX_NETWORK_CONFIG = 'NGX_NETWORK_CONFIG';
@NgModule({
  imports: [HttpClientModule],
})
export class NgxNetworkModule {
  static forRoot(config?: Config): ModuleWithProviders<NgxNetworkModule> {
    return {
      ngModule: NgxNetworkModule,
      providers: [
        NgxNetworkService,
        {
          provide: NGX_NETWORK_CONFIG,
          useValue: config||{
            url: `https://speed.hetzner.de/100MB.bin`,
            speedUnit: Units['mb/s'],
            delay: 100,
          } as Config,
        },
      ],
    };
  }
}
