import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NetworkSpeedInfo, NgxNetworkService } from 'projects/ngx-network/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ngx-network';
  networkSpeedInfo:NetworkSpeedInfo|undefined;
  constructor(private networkService: NgxNetworkService) {
  }
  ngOnInit() {
    this.networkService.getSpeed().subscribe((e) => {
      console.log(e);
      this.networkSpeedInfo = e;
    });
    
  }
}
