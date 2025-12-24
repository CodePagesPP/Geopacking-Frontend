import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialBobinaComponent } from './historial-bobina.component';

describe('HistorialBobinaComponent', () => {
  let component: HistorialBobinaComponent;
  let fixture: ComponentFixture<HistorialBobinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialBobinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialBobinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
