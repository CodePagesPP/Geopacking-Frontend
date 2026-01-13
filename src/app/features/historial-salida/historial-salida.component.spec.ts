import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSalidaComponent } from './historial-salida.component';

describe('HistorialSalidaComponent', () => {
  let component: HistorialSalidaComponent;
  let fixture: ComponentFixture<HistorialSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialSalidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
