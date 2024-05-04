import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNoConnectedComponent } from './home-no-connected.component';

describe('HomeNoConnectedComponent', () => {
  let component: HomeNoConnectedComponent;
  let fixture: ComponentFixture<HomeNoConnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeNoConnectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeNoConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
