import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavOperatorComponent } from './nav-operator.component';

describe('NavOperatorComponent', () => {
  let component: NavOperatorComponent;
  let fixture: ComponentFixture<NavOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
