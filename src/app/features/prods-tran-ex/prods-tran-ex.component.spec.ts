import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdsTranExComponent } from './prods-tran-ex.component';

describe('ProdsTranExComponent', () => {
  let component: ProdsTranExComponent;
  let fixture: ComponentFixture<ProdsTranExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdsTranExComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdsTranExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
