import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramarFechasComponent } from './programar-fechas.component';

describe('ProgramarFechasComponent', () => {
  let component: ProgramarFechasComponent;
  let fixture: ComponentFixture<ProgramarFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramarFechasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramarFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
