import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCajasComponent } from './historial-cajas.component';

describe('HistorialCajasComponent', () => {
  let component: HistorialCajasComponent;
  let fixture: ComponentFixture<HistorialCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialCajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
