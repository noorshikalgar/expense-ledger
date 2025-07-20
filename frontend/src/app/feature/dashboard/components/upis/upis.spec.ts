import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Upis } from './upis';

describe('Upis', () => {
  let component: Upis;
  let fixture: ComponentFixture<Upis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Upis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Upis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
