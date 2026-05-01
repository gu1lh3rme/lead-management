/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LeadFormComponent } from './lead-form.component';
import { LeadService } from '../../core/services/lead.service';
import { Lead, LeadCreateDto } from '../../core/models/lead.model';

describe('LeadFormComponent', () => {
  let component: LeadFormComponent;
  let fixture: ComponentFixture<LeadFormComponent>;
  let mockLeadService: jasmine.SpyObj<LeadService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockLead: Lead = {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    status: 'New',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  };

  beforeEach(async () => {
    mockLeadService = jasmine.createSpyObj('LeadService', ['create', 'update', 'getById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('new')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        LeadFormComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LeadService, useValue: mockLeadService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for new lead', () => {
    expect(component['form'].get('name')?.value).toBe('');
    expect(component['form'].get('email')?.value).toBe('');
    expect(component['form'].get('status')?.value).toBe('New');
  });

  it('should validate required fields', () => {
    const nameControl = component['form'].get('name');
    const emailControl = component['form'].get('email');

    // Test required validation
    expect(nameControl?.hasError('required')).toBe(true);
    expect(emailControl?.hasError('required')).toBe(true);

    // Test email validation
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    // Test valid form
    nameControl?.setValue('João Silva');
    emailControl?.setValue('joao@email.com');
    expect(component['form'].valid).toBe(true);
  });

  it('should create a new lead successfully', () => {
    // Arrange
    const createDto: LeadCreateDto = {
      name: 'João Silva',
      email: 'joao@email.com',
      status: 'New'
    };

    mockLeadService.create.and.returnValue(of(mockLead));

    // Fill the form
    component['form'].patchValue(createDto);

    // Act
    component['onSubmit']();

    // Assert
    expect(mockLeadService.create).toHaveBeenCalledWith(createDto);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Lead criado com sucesso',
      'Fechar',
      { duration: 3000 }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/leads', mockLead.id]);
  });

  it('should handle create lead error', () => {
    // Arrange
    const createDto: LeadCreateDto = {
      name: 'João Silva',
      email: 'joao@email.com',
      status: 'New'
    };

    mockLeadService.create.and.returnValue(throwError(() => new Error('Server error')));

    // Fill the form
    component['form'].patchValue(createDto);

    // Act
    component['onSubmit']();

    // Assert
    expect(mockLeadService.create).toHaveBeenCalledWith(createDto);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Erro ao salvar lead',
      'Fechar',
      { duration: 3000 }
    );
    expect(component['saving']).toBe(false);
  });

  it('should not submit invalid form', () => {
    // Arrange - form is invalid by default (empty required fields)
    
    // Act
    component['onSubmit']();

    // Assert
    expect(mockLeadService.create).not.toHaveBeenCalled();
    expect(component['saving']).toBe(false);
  });

  it('should navigate back to leads list', () => {
    // Act
    component['goBack']();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/leads']);
  });

  it('should load lead for editing', () => {
    // Arrange
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('123');
    mockLeadService.getById.and.returnValue(of(mockLead));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockLeadService.getById).toHaveBeenCalledWith('123');
    expect(component['isEditing']).toBe(true);
    expect(component['form'].get('name')?.value).toBe(mockLead.name);
    expect(component['form'].get('email')?.value).toBe(mockLead.email);
    expect(component['form'].get('status')?.value).toBe(mockLead.status);
  });

  it('should handle load lead error', () => {
    // Arrange
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('123');
    mockLeadService.getById.and.returnValue(throwError(() => new Error('Not found')));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Erro ao carregar lead',
      'Fechar',
      { duration: 3000 }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/leads']);
  });

  it('should get lead status label', () => {
    // Act & Assert
    expect(component['getLeadStatusLabel']('New')).toBe('Novo');
    expect(component['getLeadStatusLabel']('Qualified')).toBe('Qualificado');
    expect(component['getLeadStatusLabel']('Won')).toBe('Ganho');
    expect(component['getLeadStatusLabel']('Lost')).toBe('Perdido');
  });
});