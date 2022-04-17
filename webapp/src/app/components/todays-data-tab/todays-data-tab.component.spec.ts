import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysDataTabComponent } from './todays-data-tab.component';

describe('TodaysDataTabComponent', () => {
  let component: TodaysDataTabComponent;
  let fixture: ComponentFixture<TodaysDataTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysDataTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysDataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
