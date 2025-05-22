import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFechaInspeccionComponent } from './modal-fecha-inspeccion.component';

describe('ModalFechaInspeccionComponent', () => {
  let component: ModalFechaInspeccionComponent;
  let fixture: ComponentFixture<ModalFechaInspeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFechaInspeccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFechaInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
