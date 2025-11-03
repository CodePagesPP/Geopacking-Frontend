import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrappComponent } from './scrapp.component';

describe('ScrappComponent', () => {
  let component: ScrappComponent;
  let fixture: ComponentFixture<ScrappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
