import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkingPageComponent } from './talking-page.component';

describe('TalkingPageComponent', () => {
  let component: TalkingPageComponent;
  let fixture: ComponentFixture<TalkingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalkingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TalkingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
