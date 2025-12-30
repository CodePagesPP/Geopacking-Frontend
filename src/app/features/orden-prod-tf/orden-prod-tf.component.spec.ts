import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenProdTfComponent } from './orden-prod-tf.component';

describe('OrdenProdTfComponent', () => {
  let component: OrdenProdTfComponent;
  let fixture: ComponentFixture<OrdenProdTfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenProdTfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenProdTfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
