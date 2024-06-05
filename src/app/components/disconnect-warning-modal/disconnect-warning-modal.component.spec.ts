import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisconnectWarningModalComponent } from './disconnect-warning-modal.component';

describe('DisconnectWarningModalComponent', () => {
  let component: DisconnectWarningModalComponent;
  let fixture: ComponentFixture<DisconnectWarningModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectWarningModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisconnectWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
