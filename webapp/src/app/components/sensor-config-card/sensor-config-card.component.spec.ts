import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorConfigCardComponent } from './sensor-config-card.component';

describe('SensorConfigCardComponent', () => {
  let component: SensorConfigCardComponent;
  let fixture: ComponentFixture<SensorConfigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorConfigCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
