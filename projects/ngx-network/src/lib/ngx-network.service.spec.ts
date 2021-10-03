import { TestBed } from '@angular/core/testing';

import { NgxNetworkService } from './ngx-network.service';

describe('NgxNetworkService', () => {
  let service: NgxNetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxNetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
