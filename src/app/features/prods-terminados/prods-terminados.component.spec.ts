import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdsTerminadosComponent } from './prods-terminados.component';

describe('ProdsTerminadosComponent', () => {
  let component: ProdsTerminadosComponent;
  let fixture: ComponentFixture<ProdsTerminadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdsTerminadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdsTerminadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
