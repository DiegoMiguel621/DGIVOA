import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEmpleadosModalComponent } from './editar-empleados-modal.component';

describe('EditarEmpleadosModalComponent', () => {
  let component: EditarEmpleadosModalComponent;
  let fixture: ComponentFixture<EditarEmpleadosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEmpleadosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarEmpleadosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
