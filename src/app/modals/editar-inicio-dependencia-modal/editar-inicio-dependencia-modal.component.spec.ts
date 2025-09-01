import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInicioDependenciaModalComponent } from './editar-inicio-dependencia-modal.component';

describe('EditarInicioDependenciaModalComponent', () => {
  let component: EditarInicioDependenciaModalComponent;
  let fixture: ComponentFixture<EditarInicioDependenciaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarInicioDependenciaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarInicioDependenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
