import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lead, LeadCreateDto, LeadUpdateDto, LeadStatus } from '../models/lead.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leads`;

  private _leads = signal<Lead[]>([]);
  private _loading = signal(false);

  readonly leads = this._leads.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly leadsCount = computed(() => this._leads().length);

  getAll(search?: string, status?: LeadStatus): Observable<Lead[]> {
    this._loading.set(true);
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);

    return this.http.get<Lead[]>(this.apiUrl, { params }).pipe(
      tap(leads => {
        this._leads.set(leads);
        this._loading.set(false);
      })
    );
  }

  getById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  create(dto: LeadCreateDto): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, dto);
  }

  update(id: string, dto: LeadUpdateDto): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
