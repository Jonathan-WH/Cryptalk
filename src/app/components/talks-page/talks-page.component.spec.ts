import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalksPageComponent } from './talks-page.component';

describe('TalksPageComponent', () => {
  let component: TalksPageComponent;
  let fixture: ComponentFixture<TalksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalksPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TalksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
