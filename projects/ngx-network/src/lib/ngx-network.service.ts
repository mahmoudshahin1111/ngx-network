import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscriber,
  Subscription,
} from 'rxjs';
import {
  concatMap,
  filter,
  finalize,
  map,
  repeat,
  takeLast,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { Config } from './api/config';
import { NetworkSpeedInfo } from './api/network-speed-info';
import { Units } from './api/units';
import { NGX_NETWORK_CONFIG } from './ngx-network.module';
@Injectable()
export class NgxNetworkService {
  private speedChanged$: BehaviorSubject<NetworkSpeedInfo>;
  private onSpeedChanged$: Observable<NetworkSpeedInfo>;
  private startSendingPayloadSubscription: Subscription;
  private lastTime: number;
  private lastPayloadSize: number;
  constructor(
    @Inject(NGX_NETWORK_CONFIG) private config: Config,
    private http: HttpClient
  ) {
    this.speedChanged$ = new BehaviorSubject({
      speed: 0,
      unit: config.speedUnit,
    });
    this.onSpeedChanged$ = this.speedChanged$.asObservable().pipe(
      throttleTime(this.config.delay),
      filter((payload) => payload.speed !== 0)
    );
    this.startSendingPayloadSubscription = new Subscription();
    this.lastPayloadSize = 0;
    this.lastTime = 0;
  }
  getSpeed() {
    if (this.startSendingPayloadSubscription) {
      this.startSendingPayloadSubscription.unsubscribe();
    }
    this.startSendingPayloadSubscription = this.startSendingPayload(
      this.config.url,
      false
    ).subscribe();
    return this.onSpeedChanged$;
  }
  onSpeedChanged(): Observable<NetworkSpeedInfo> {
    if (this.startSendingPayloadSubscription) {
      this.startSendingPayloadSubscription.unsubscribe();
    }
    this.startSendingPayloadSubscription = this.startSendingPayload(
      this.config.url,
      true
    ).subscribe();
    return this.onSpeedChanged$;
  }
  private startSendingPayload(url: string, repeatRequest: boolean): Observable<null> {
    this.lastTime = 0;
    this.lastPayloadSize = 0;
    const randomQuery = `q=${Math.round(Math.random() * 99959).toString()}`;
    if(!repeatRequest){
       return this.sendRequest(url, randomQuery).pipe(
        takeLast(1),
        tap((payload) => {
          this.speedChanged$.next(payload);
        }),
        map((e) => null)
      );
    }
    return this.sendRequest(url, randomQuery).pipe(
      tap((payload) => {
        this.speedChanged$.next(payload);
      }),
      finalize(() => {
        if (!repeatRequest) return;
        this.startSendingPayloadSubscription.unsubscribe();
        this.startSendingPayloadSubscription = this.startSendingPayload(
          url,
          repeatRequest
        ).subscribe();
      }),
      map((e) => null)
    );
  }

  private sendRequest(url: string, params: string) {
    const request = new HttpRequest('GET', url, {
      params,
      responseType: 'arraybuffer',
      reportProgress: true,
    });

    return this.http
      .request(request)
      .pipe(
        concatMap((httpEvent: HttpEvent<any>) =>
          this.handleHttpEvents(httpEvent)
        )
      );
  }
  private handleHttpEvents(e: HttpEvent<ArrayBuffer>) {
    return new Observable<NetworkSpeedInfo>(
      (subscriber: Subscriber<NetworkSpeedInfo>) => {
        if (e.type === HttpEventType.DownloadProgress) {
          let currentTime = Date.now();
          const elapseTimeForEveryPayload = currentTime - this.lastTime;
          const elapseTimeSecs = elapseTimeForEveryPayload / 1000;
          let speed: string = this.speedChanged$.getValue().speed.toString();
          const currentPayloadSize = e.loaded;
          const downloadPayloadSize = Math.abs(
            currentPayloadSize - this.lastPayloadSize
          );
          switch (this.config.speedUnit) {
            case Units['kb/s']:
              speed = Number(
                downloadPayloadSize / 1024 / elapseTimeSecs
              ).toFixed(3);
              break;
            case Units['mb/s']:
              speed = Number(
                downloadPayloadSize / Math.pow(1024, 2) / elapseTimeSecs
              ).toFixed(3);
              break;
            case Units['gb/s']:
              speed = Number(
                downloadPayloadSize / Math.pow(1024, 3) / elapseTimeSecs
              ).toFixed(3);
              break;
            case Units['tb/s']:
              speed = Number(
                downloadPayloadSize / Math.pow(1024, 4) / elapseTimeSecs
              ).toFixed(3);
              break;
          }
          this.lastPayloadSize = e.loaded;
          this.lastTime = Date.now();
          subscriber.next({
            speed: Number(
              Number(speed) === 0 ? this.speedChanged$.getValue().speed : speed
            ),
            unit: this.config.speedUnit,
          });
        }
        subscriber.complete();
      }
    );
  }
}
