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
    icon: '💍',
    title: 'Bridal glam',
    desc: 'Luxury bridal makeup and hair with a long-wear, photo-ready finish — perfect for destination weddings and on-location services.',
  },
  {
    icon: '✨',
    title: 'Exceptional events',
    desc: 'Polished full-glam looks for galas, premieres, birthdays, and VIP evenings — expressive, elegant, and made to last all night.',
  },
  {
    icon: '🌸',
    title: 'Fashion projects',
    desc: 'Editorial and fashion makeup & hair for photoshoots, campaigns, runway, and creative productions — tailored to your concept and team.',
  },
  {
    icon: '📸',
    title: 'Education',
    desc: '1:1 lessons and masterclasses for artists and clients — technique, product guidance, and camera-ready makeup for real-life and photos.',
  },
];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Professional Makeup Artist in Düsseldorf, NRW',
      description: 'Makeup artist based in Düsseldorf, NRW influencing beauty, fashion, and media. Specializing in bridal makeup & hair for destination weddings across Europe, as well as editorial and red carpet looks with a professional team and luxury, on-location service.',
    });
  }
}
