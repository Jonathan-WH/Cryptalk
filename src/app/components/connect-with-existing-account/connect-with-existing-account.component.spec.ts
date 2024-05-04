import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWithExistingAccountComponent } from './connect-with-existing-account.component';

describe('ConnectWithExistingAccountComponent', () => {
  let component: ConnectWithExistingAccountComponent;
  let fixture: ComponentFixture<ConnectWithExistingAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectWithExistingAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectWithExistingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
