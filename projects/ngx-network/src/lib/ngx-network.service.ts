import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { delay, map, repeatWhen, tap, throttleTime } from 'rxjs/operators';
import { Config } from './api/config';
import { NetworkSpeedInfo } from './api/network-speed-info';
import { Units } from './api/units';
import { NGX_NETWORK_CONFIG } from './ngx-network.module';
@Injectable()
export class NgxNetworkService {
  private speedChanged$: Subject<NetworkSpeedInfo>;
  private onSpeedChanged: Observable<NetworkSpeedInfo>;
  private startSendingPayloadSubscription: Subscription;
  constructor(
    @Inject(NGX_NETWORK_CONFIG) private config: Config,
    private http: HttpClient
  ) {
    console.log('new services is created');
    this.speedChanged$ = new Subject();
    this.onSpeedChanged = this.speedChanged$
      .asObservable()
      .pipe(throttleTime(this.config.delay || 100));
    this.startSendingPayloadSubscription = new Subscription();
  }
  start(): Observable<NetworkSpeedInfo> {
    if (this.startSendingPayloadSubscription) {
      this.startSendingPayloadSubscription.unsubscribe();
    }
    this.startSendingPayloadSubscription = this.startSendingPayload(
      this.config.url
    ).subscribe();
    return this.onSpeedChanged;
  }
  private startSendingPayload(url: string): Observable<null> {
    const randomQuery = `q=${Math.round(Math.random() * 1000).toString()}`;
    const request = new HttpRequest('GET', url, {
      params: randomQuery,
      responseType: 'arraybuffer',
      reportProgress: true,
    });
    let lastTime: number = 0;
    let lastPayloadSize: number = 0;
    return this.http.request(request).pipe(
      repeatWhen((e) => e.pipe(delay(1000))),
      tap((e: HttpEvent<any>) => {
        if (e.type === HttpEventType.DownloadProgress) {
          let currentTime = Date.now();
          const elapseTimeForEveryPayload = currentTime - lastTime;
          const currentPayloadSize = e.loaded;
          const downloadPayloadSize = Math.abs(
            currentPayloadSize - lastPayloadSize
          );
          const elapseTimeSecs = elapseTimeForEveryPayload / 1000;
          let speed: string = '0';
          switch (this.config.speedUnit) {
            case Units['kb/s']:
              speed = Number(
                downloadPayloadSize / 1024 / elapseTimeSecs
              ).toFixed(3);
              break;
            case Units['mb/s']:
              speed = Number(
                downloadPayloadSize / Math.pow(1024,2) / elapseTimeSecs
              ).toFixed(3);
              break;
            case Units['gb/s']:
              speed = Number(
                downloadPayloadSize / Math.pow(1024,3) / elapseTimeSecs
              ).toFixed(3);
              break;
            case Units['tb/s']:
              speed = Number(
                downloadPayloadSize / Math.pow(1024,4) / elapseTimeSecs
              ).toFixed(3);
              break;
          }
          lastPayloadSize = e.loaded;
          lastTime = Date.now();
          this.speedChanged$.next({
            speed,
            unit: this.config.speedUnit,
          } as NetworkSpeedInfo);
        } else {
          this.speedChanged$.next({
            speed: '0',
            unit: this.config.speedUnit,
          } as NetworkSpeedInfo);
        }
      }),
      map((e) => null)
    );
  }
}
