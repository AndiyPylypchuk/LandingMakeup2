import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  skills = [
    'Bridal Look', 'Full Glam', 'Editorial',
    'Red Carpet', 'Education', 'Worldwide',
  ];

  values = [
    {
      photo: '/assets/images/studio3.jpeg',
      alt: 'Makeup artist preparing a client',
      title: 'Experienced experts',
      desc: 'I train regularly with top industry experts to offer you modern techniques and trends.',
    },
    {
      photo: '/assets/images/cosmetic3.jpeg',
      alt: 'Professional makeup products close-up',
      title: 'High-quality products',
      desc: 'I work only with trusted professional brands and skin-safe formulas.',
    },
    {
      photo: '/assets/images/studio5.jpg',
      alt: 'Consultation with a beauty client',
      title: 'Personal approach',
      desc: 'We listen carefully and create a look tailored to your features, style, and event.',
    },
    {
      photo: '/assets/images/1.jpg',
      alt: 'Beauty preparation running on schedule',
      title: 'Punctuality',
      desc: 'We value your time and always work within the agreed schedule.',
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'About Anna Pylypchuk',
      description: 'Makeup artist based in Düsseldorf, NRW influencing beauty, fashion, and media. Specializing in bridal makeup & hair for destination weddings across Europe, as well as editorial and red carpet looks with a professional team and luxury, on-location service.',
    });
  }
}
