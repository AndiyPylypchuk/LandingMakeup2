import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FunnelService, FunnelPage } from '../../services/funnel.service';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'app-funnel',
  standalone: true,
  imports: [NotFoundComponent],
  templateUrl: './funnel.component.html',
  styleUrl: './funnel.component.scss',
})
export class FunnelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly funnelService = inject(FunnelService);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  page = signal<FunnelPage | null>(null);
  loading = signal(true);
  notFound = signal(false);
  embedUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit(): void {
    // Always mark funnel pages as noindex
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.funnelService.getBySlug(slug).subscribe({
      next: (data) => {
        this.page.set(data);
        this.titleService.setTitle(data.title);
        const url = `https://www.youtube.com/embed/${data.youtube_id}?rel=0&modestbranding=1`;
        this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }
}
