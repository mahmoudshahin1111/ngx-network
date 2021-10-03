import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxNetworkComponent } from './ngx-network.component';

describe('NgxNetworkComponent', () => {
  let component: NgxNetworkComponent;
  let fixture: ComponentFixture<NgxNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
