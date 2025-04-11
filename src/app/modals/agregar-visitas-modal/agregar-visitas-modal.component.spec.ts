import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVisitasModalComponent } from './agregar-visitas-modal.component';

describe('AgregarVisitasModalComponent', () => {
  let component: AgregarVisitasModalComponent;
  let fixture: ComponentFixture<AgregarVisitasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarVisitasModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarVisitasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
