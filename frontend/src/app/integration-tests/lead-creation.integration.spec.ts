/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { LeadFormComponent } from '../pages/leads/lead-form.component';
import { LeadService } from '../core/services/lead.service';
import { Lead, LeadStatus } from '../core/models/lead.model';

describe('Lead Creation Integration Test', () => {
  let component: LeadFormComponent;
  let fixture: ComponentFixture<LeadFormComponent>;
  let leadService: LeadService;
  let router: Router;
  let snackBar: MatSnackBar;
  let mockActivatedRoute: any;

  const mockCreatedLead: Lead = {
    id: 'new-lead-id',
    name: 'Teste Integration',
    email: 'integration@test.com',
    status: 'New',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  };

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj('LeadService', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
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
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFormComponent);
    component = fixture.componentInstance;
    leadService = TestBed.inject(LeadService) as jasmine.SpyObj<LeadService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create a lead from form submission to navigation', async () => {
    // Arrange
    const leadData = {
      name: 'Teste Integration',
      email: 'integration@test.com',
      status: 'New' as LeadStatus
    };

    (leadService.create as jasmine.Spy).and.returnValue(of(mockCreatedLead));

    // Act - Fill the form
    const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    const statusSelect = fixture.nativeElement.querySelector('mat-select[formControlName="status"]');

    nameInput.value = leadData.name;
    nameInput.dispatchEvent(new Event('input'));
    
    emailInput.value = leadData.email;
    emailInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // Submit the form
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('ngSubmit'));

    // Assert
    expect(leadService.create).toHaveBeenCalledWith(leadData);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Lead criado com sucesso',
      'Fechar',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/leads', mockCreatedLead.id]);
  });

  it('should validate form before submission', () => {
    // Act - Try to submit empty form
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    
    // Assert - Submit button should be disabled for invalid form
    expect(submitButton.disabled).toBe(true);
    expect(component['form'].valid).toBe(false);
  });

  it('should enable submit button when form is valid', () => {
    // Arrange
    const leadData = {
      name: 'Valid Lead',
      email: 'valid@email.com',
      status: 'New' as LeadStatus
    };

    // Act - Fill form with valid data
    component['form'].patchValue(leadData);
    fixture.detectChanges();

    // Assert
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(false);
    expect(component['form'].valid).toBe(true);
  });

  it('should display validation errors for invalid inputs', async () => {
    // Arrange & Act - Touch the fields to trigger validation
    const nameControl = component['form'].get('name');
    const emailControl = component['form'].get('email');
    
    nameControl?.markAsTouched();
    emailControl?.markAsTouched();
    emailControl?.setValue('invalid-email');
    
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(nameControl?.hasError('required')).toBe(true);
    expect(emailControl?.hasError('email')).toBe(true);
  });
});