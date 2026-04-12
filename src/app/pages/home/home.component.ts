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
      photo: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=1200&q=80',
      title: 'Bridal Makeup & Hairstyle',
      desc: 'Your special day will be perfect with our team of beauty experts.',
    },
    {
      anchor: 'trial-session',
      photo: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80',
      title: 'Trial Session',
      desc: 'A trial helps you feel relaxed and confident before your most memorable day.',
    },
    {
      anchor: 'touch-up-service',
      photo: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
      title: 'Touch up Service',
      desc: 'Stay polished through emotions, photos, and kisses with on-site touch-up support.',
    },
    {
      anchor: 'photoshoot-service',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      title: 'Photoshoot service',
      desc: 'Model preparation and continuous touch-ups for flawless shoot results.',
    },
    {
      anchor: 'exceptional-events',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      title: 'Exceptional events',
      desc: 'Refined glam for premieres, galas, birthdays, and VIP evenings.',
    },
    {
      anchor: 'education',
      photo: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&w=1200&q=80',
      title: 'Education',
      desc: 'Hands-on lessons and masterclasses for artists and beauty enthusiasts.',
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Professional Makeup Artist in Düsseldorf, NRW',
      description: 'Makeup artist based in Düsseldorf, NRW influencing beauty, fashion, and media. Specializing in bridal makeup & hair for destination weddings across Europe, as well as editorial and red carpet looks with a professional team and luxury, on-location service.',
    });
  }
}
