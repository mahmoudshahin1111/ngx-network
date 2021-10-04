import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  delay,
  map,
  repeat,
  repeatWhen,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { NetworkSpeedInfo } from './api/network-speed-info';
import { Units } from './api/units';
@Injectable({
  providedIn: 'root',
})
export class NgxNetworkService {
  private speedUnit: Units;
  private delay: number;
  private speedChanged$: Subject<NetworkSpeedInfo>;
  private onSpeedChanged: Observable<NetworkSpeedInfo>;
  private startSendingPayloadSubscription: Subscription;
  constructor(private http: HttpClient) {
    this.delay = 100;
    this.speedChanged$ = new Subject();
    this.onSpeedChanged = this.speedChanged$
      .asObservable()
      .pipe(throttleTime(this.delay));
    this.startSendingPayloadSubscription = new Subscription();
    this.speedUnit = Units['mb/s'];
  }
  start(): Observable<NetworkSpeedInfo> {
    if (this.startSendingPayloadSubscription) {
      this.startSendingPayloadSubscription.unsubscribe();
    }
    this.startSendingPayloadSubscription = this.startSendingPayload(
      `https://speed.hetzner.de/100MB.bin`
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
          let speed: string = '0';
          if (this.speedUnit === Units['kb/s']) {
            speed = Number(
              downloadPayloadSize / 1024 / (elapseTimeForEveryPayload / 1000)
            ).toFixed(2);
          } else if (this.speedUnit === Units['mb/s']) {
            speed = Number(
              downloadPayloadSize /
                (1024 * 1024) /
                (elapseTimeForEveryPayload / 1000)
            ).toFixed(2);
          } else if (this.speedUnit === Units['gb/s']) {
            speed = Number(
              downloadPayloadSize /
                (1024 * 2) /
                (elapseTimeForEveryPayload / 1000)
            ).toFixed(2);
          } else if (this.speedUnit === Units['tb/s']) {
            speed = Number(
              downloadPayloadSize /
                (1024 * 3) /
                (elapseTimeForEveryPayload / 1000)
            ).toFixed(2);
          }
          lastPayloadSize = e.loaded;
          lastTime = Date.now();
          this.speedChanged$.next({
            speed,
            unit: this.speedUnit,
          } as NetworkSpeedInfo);
        } else {
          this.speedChanged$.next({
            speed: '0',
            unit: this.speedUnit,
          } as NetworkSpeedInfo);
        }
      }),
      map((e) => null)
    );
  }
}
