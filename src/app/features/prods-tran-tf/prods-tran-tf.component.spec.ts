import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdsTranTfComponent } from './prods-tran-tf.component';

describe('ProdsTranTfComponent', () => {
  let component: ProdsTranTfComponent;
  let fixture: ComponentFixture<ProdsTranTfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdsTranTfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdsTranTfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
