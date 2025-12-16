import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenProdEXComponent } from './orden-prod-ex.component';

describe('OrdenProdEXComponent', () => {
  let component: OrdenProdEXComponent;
  let fixture: ComponentFixture<OrdenProdEXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenProdEXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenProdEXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
