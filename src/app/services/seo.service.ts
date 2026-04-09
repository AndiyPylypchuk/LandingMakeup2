import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SeoConfig {
  title: string;
  description: string;
  noindex?: boolean;
  jsonLd?: object;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly siteName = 'Anna Pylypchuk — Makeup Artist';
  private readonly canonicalBase = environment.canonicalBase;

  constructor() {
    this.injectOrganizationJsonLd();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateCanonical());
  }

  setPage(cfg: SeoConfig): void {
    const fullTitle = `${cfg.title} | ${this.siteName}`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: cfg.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: cfg.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.currentUrl() });
    this.meta.updateTag({ property: 'og:image', content: `${this.canonicalBase}/assets/images/og-image.jpg` });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: cfg.description });

    if (cfg.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }

    this.updateCanonical();

    if (cfg.jsonLd) {
      this.injectJsonLd('page-structured-data', cfg.jsonLd);
    }
  }

  private updateCanonical(): void {
    const url = this.currentUrl();
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private currentUrl(): string {
    const path = this.router.url.split('?')[0];
    return `${this.canonicalBase}${path}`;
  }

  private injectOrganizationJsonLd(): void {
    const org = {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness'],
      name: 'Anna Pylypchuk Makeup Artist',
      url: this.canonicalBase,
      logo: `${this.canonicalBase}/assets/images/logo.png`,
      description: 'Професійний візажист Анна Пилипчук. Весільний, вечірній та денний макіяж у Чернівцях.',
      email: 'pylyp69de@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Чернівці',
        addressCountry: 'UA',
      },
      sameAs: [
        'https://www.instagram.com/anna.pylypchuk.makeup',
        'https://t.me/anna_makeup_ua',
      ],
    };
    this.injectJsonLd('org-structured-data', org);
  }

  private injectJsonLd(id: string, data: object): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
