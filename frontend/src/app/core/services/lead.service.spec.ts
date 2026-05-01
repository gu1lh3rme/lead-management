/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeadService } from './lead.service';
import { Lead, LeadCreateDto, LeadUpdateDto } from '../models/lead.model';
import { environment } from '../../../environments/environment';

describe('LeadService', () => {
  let service: LeadService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/leads`;

  const mockLead: Lead = {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    status: 'New',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  };

  const mockLeads: Lead[] = [
    mockLead,
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      status: 'Qualified',
      createdAt: '2026-05-01T11:00:00Z',
      updatedAt: '2026-05-01T11:00:00Z'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeadService]
    });
    service = TestBed.inject(LeadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should create a new lead', () => {
      // Arrange
      const createDto: LeadCreateDto = {
        name: 'João Silva',
        email: 'joao@email.com',
        status: 'New'
      };

      // Act
      service.create(createDto).subscribe(lead => {
        // Assert
        expect(lead).toEqual(mockLead);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(mockLead);
    });

    it('should handle create lead error', () => {
      // Arrange
      const createDto: LeadCreateDto = {
        name: 'João Silva',
        email: 'joao@email.com',
        status: 'New'
      };
      const errorMessage = 'Email already exists';

      // Act
      service.create(createDto).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
          expect(error.error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getAll', () => {
    it('should get all leads', () => {
      // Act
      service.getAll().subscribe(leads => {
        // Assert
        expect(leads).toEqual(mockLeads);
        expect(service.leads()).toEqual(mockLeads);
        expect(service.loading()).toBe(false);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockLeads);
    });

    it('should get leads with search parameter', () => {
      // Arrange
      const searchTerm = 'João';
      const encodedSearchTerm = encodeURIComponent(searchTerm);

      // Act
      service.getAll(searchTerm).subscribe(leads => {
        expect(leads).toEqual([mockLead]);
      });

      const req = httpMock.expectOne(`${apiUrl}?search=${encodedSearchTerm}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockLead]);
    });

    it('should get leads with status filter', () => {
      // Arrange
      const status = 'New';

      // Act
      service.getAll(undefined, status).subscribe(leads => {
        expect(leads).toEqual([mockLead]);
      });

      const req = httpMock.expectOne(`${apiUrl}?status=${status}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockLead]);
    });
  });

  describe('getById', () => {
    it('should get a lead by id', () => {
      // Arrange
      const leadId = '1';

      // Act
      service.getById(leadId).subscribe(lead => {
        // Assert
        expect(lead).toEqual(mockLead);
      });

      const req = httpMock.expectOne(`${apiUrl}/${leadId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLead);
    });

    it('should handle get lead by id error', () => {
      // Arrange
      const leadId = '999';

      // Act
      service.getById(leadId).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${leadId}`);
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('update', () => {
    it('should update a lead', () => {
      // Arrange
      const leadId = '1';
      const updateDto: LeadUpdateDto = {
        name: 'João Silva Atualizado',
        email: 'joao.novo@email.com',
        status: 'Qualified'
      };
      const updatedLead = { ...mockLead, ...updateDto };

      // Act
      service.update(leadId, updateDto).subscribe(lead => {
        // Assert
        expect(lead).toEqual(updatedLead);
      });

      const req = httpMock.expectOne(`${apiUrl}/${leadId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDto);
      req.flush(updatedLead);
    });
  });

  describe('delete', () => {
    it('should delete a lead', () => {
      // Arrange
      const leadId = '1';

      // Act
      service.delete(leadId).subscribe(result => {
        // Assert
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${leadId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('computed properties', () => {
    it('should compute leads count', () => {
      // Arrange
      service['_leads'].set(mockLeads);

      // Act & Assert
      expect(service.leadsCount()).toBe(2);
    });

    it('should return empty leads initially', () => {
      // Act & Assert
      expect(service.leads()).toEqual([]);
      expect(service.leadsCount()).toBe(0);
    });
  });
});