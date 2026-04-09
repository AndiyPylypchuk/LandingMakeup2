import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<FunnelPage>(`${this.apiBase}/funnel.php?slug=${encodeURIComponent(slug)}`);
  }
}
