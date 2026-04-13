import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MOCK_FUNNELS } from './funnel.mock';

export interface FunnelPage {
  slug: string;
  title: string;
  youtube_id: string;
  body_text: string;
  button_text: string;
  button_url: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class FunnelService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  getBySlug(slug: string): Observable<FunnelPage> {
    if (environment.mockFunnel) {
      const mock = MOCK_FUNNELS.get(slug);
      if (mock) {
        return of(mock).pipe(delay(300));
      }
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    }
    return this.http.get<FunnelPage>(`${this.apiBase}/funnel.php?slug=${encodeURIComponent(slug)}`);
  }
}
