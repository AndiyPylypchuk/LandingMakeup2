import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  services = [
    {
      anchor: 'bridal-makeup-hairstyle',
      photo:
        'https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=1200&q=80',
      title: 'Bridal glam',
      desc: 'Luxury bridal makeup and hair with a long-wear, photo-ready finish — perfect for destination weddings and on-location services.',
    },
    {
      anchor: 'photoshoot-service',
      photo:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      title: 'Fashion projects',
      desc: 'Editorial and fashion makeup & hair for photoshoots, campaigns, runway, and creative productions — tailored to your concept and team.',
    },
    {
      anchor: 'exceptional-events',
      photo:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      title: 'Exceptional events',
      desc: 'Polished full-glam looks for galas, premieres, birthdays, and VIP evenings — expressive, elegant, and made to last all night.',
    },
    {
      anchor: 'education',
      photo:
        'https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&w=1200&q=80',
      title: 'Education',
      desc: '1:1 lessons and masterclasses for artists and clients — technique, product guidance, and camera-ready makeup for real-life and photos.',
    },
  ];

  portfolioPreview = [
    {
      title: 'Modern Bridal Glow',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1300&q=80',
      category: 'Bridal',
      size: 'tall',
    },
    {
      title: 'Editorial Skin Focus',
      image:
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1300&q=80',
      category: 'Editorial',
      size: 'wide',
    },
    {
      title: 'Destination Wedding',
      image:
        'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1300&q=80',
      category: 'Bridal',
    },
    {
      title: 'Red Carpet Evening',
      image:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1300&q=80',
      category: 'Events',
      size: 'tall',
    },
    {
      title: 'Studio Beauty Campaign',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1300&q=80',
      category: 'Campaign',
    },
    {
      title: 'Masterclass Moment',
      image:
        'https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&w=1300&q=80',
      category: 'Education',
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Professional Makeup Artist in Düsseldorf, NRW',
      description:
        'Makeup artist based in Düsseldorf, NRW influencing beauty, fashion, and media. Specializing in bridal makeup & hair for destination weddings across Europe, as well as editorial and red carpet looks with a professional team and luxury, on-location service.',
    });
  }
}
