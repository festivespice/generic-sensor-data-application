import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorConfigFormComponent } from './sensor-config-form.component';

describe('SensorConfigFormComponent', () => {
  let component: SensorConfigFormComponent;
  let fixture: ComponentFixture<SensorConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
