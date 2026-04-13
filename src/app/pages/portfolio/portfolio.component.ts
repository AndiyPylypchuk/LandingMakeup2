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
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
      alt: 'Bride portrait with elegant makeup',
      size: 'tall',
    },
    {
      title: 'Soft Editorial Skin',
      category: 'Editorial',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
      alt: 'Editorial beauty close-up',
      size: 'wide',
    },
    {
      title: 'Evening Red Carpet',
      category: 'Red Carpet',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80',
      alt: 'Elegant red carpet style makeup',
    },
    {
      title: 'Destination Wedding',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1400&q=80',
      alt: 'Destination wedding bridal look',
      size: 'tall',
    },
    {
      title: 'Studio Beauty Campaign',
      category: 'Beauty Campaigns',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80',
      alt: 'Studio beauty campaign photoshoot',
    },
    {
      title: 'Fashion Portrait',
      category: 'Photoshoot',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
      alt: 'Fashion portrait with polished makeup',
      size: 'wide',
    },
    {
      title: 'Classic Bridal Elegance',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80',
      alt: 'Classic bridal elegance close-up',
    },
    {
      title: 'Masterclass Session',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&w=1400&q=80',
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
