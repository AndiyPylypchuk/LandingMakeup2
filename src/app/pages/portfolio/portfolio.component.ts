import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

interface PortfolioItem {
  title: string;
  category: string;
  image: string;
  alt: string;
  size?: 'tall' | 'wide';
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  private readonly seo = inject(SeoService);

  categories = [
    'Bridal',
    'Editorial',
    'Red Carpet',
    'Photoshoot',
    'Beauty Campaigns',
    'Education',
  ];

  items: PortfolioItem[] = [
    {
      title: 'Modern Bridal Glow',
      category: 'Bridal',
      image:
        '/assets/images/wedding3.jpg',
      alt: 'Bride portrait with elegant makeup',
      size: 'tall',
    },
    {
      title: 'Soft Editorial Skin',
      category: 'Editorial',
      image:
        '/assets/images/1.jpg',
      alt: 'Editorial beauty close-up',
      size: 'wide',
    },
    {
      title: 'Evening Red Carpet',
      category: 'Red Carpet',
      image:
        '/assets/images/3.jpeg',
      alt: 'Elegant red carpet style makeup',
    },
    {
      title: 'Destination Wedding',
      category: 'Bridal',
      image:
        '/assets/images/wedding5.jpeg',
      alt: 'Destination wedding bridal look',
      size: 'tall',
    },
    {
      title: 'Studio Beauty Campaign',
      category: 'Beauty Campaigns',
      image:
       '/assets/images/studio1.jpeg',
      alt: 'Studio beauty campaign photoshoot',
    },
    {
      title: 'Fashion Portrait',
      category: 'Photoshoot',
      image:
        '/assets/images/studio4.jpg',
      alt: 'Fashion portrait with polished makeup',
      size: 'wide',
    },
    {
      title: 'Classic Bridal Elegance',
      category: 'Bridal',
      image: '/assets/images/wedding5.jpeg',
      alt: 'Classic bridal elegance close-up',
    },
    {
      title: 'Masterclass Session',
      category: 'Education',
      image:
        '/assets/images/studio2.jpeg',
      alt: 'Professional beauty education session',
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Portfolio',
      description:
        'Discover bridal, editorial, red carpet, and photoshoot makeup portfolio works by Anna Pylypchuk in Dusseldorf, NRW and worldwide.',
    });
  }
}
