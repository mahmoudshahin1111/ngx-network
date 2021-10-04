import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxNetworkService } from 'projects/ngx-network/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ngx-network';
  constructor(private networkService: NgxNetworkService) {}
  ngOnInit() {
    this.networkService.start().subscribe((e) => {
      console.log(e);
    });
    
  }
}
