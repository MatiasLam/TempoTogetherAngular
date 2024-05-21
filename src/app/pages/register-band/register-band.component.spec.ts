import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBandComponent } from './register-band.component';

describe('RegisterBandComponent', () => {
  let component: RegisterBandComponent;
  let fixture: ComponentFixture<RegisterBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
