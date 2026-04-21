import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shazam } from './shazam';

describe('Shazam', () => {
  let component: Shazam;
  let fixture: ComponentFixture<Shazam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shazam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shazam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
