import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorConfigTabComponent } from './sensor-config-tab.component';

describe('SensorConfigTabComponent', () => {
  let component: SensorConfigTabComponent;
  let fixture: ComponentFixture<SensorConfigTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorConfigTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorConfigTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
