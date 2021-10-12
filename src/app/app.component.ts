import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NetworkSpeedInfo, NgxNetworkService, Units } from 'projects/ngx-network/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ngx-network';
  networkSpeedInfo:NetworkSpeedInfo;
  constructor(private networkService: NgxNetworkService) {
    this.networkSpeedInfo = {
      speed:0,
      unit:Units['kb/s']
    }
  }
  ngOnInit() {
    this.networkService.getSpeed().subscribe((networkSpeedInfo) => {
      this.networkSpeedInfo = networkSpeedInfo;
    });
    
  }
}
