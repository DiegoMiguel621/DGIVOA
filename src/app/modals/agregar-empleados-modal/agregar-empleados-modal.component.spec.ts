import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEmpleadosModalComponent } from './agregar-empleados-modal.component';

describe('AgregarEmpleadosModalComponent', () => {
  let component: AgregarEmpleadosModalComponent;
  let fixture: ComponentFixture<AgregarEmpleadosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarEmpleadosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarEmpleadosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
