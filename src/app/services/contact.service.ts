import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  send(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiBase}/contact`, payload);
  }
}
