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
    { icon: '💍', title: 'Bridal makeup', desc: 'An unforgettable look for one of the most important days of your life.' },
    { icon: '✨', title: 'Evening makeup', desc: 'Long-lasting, expressive makeup for parties and special events.' },
    { icon: '🌸', title: 'Day makeup', desc: 'A fresh, natural style for daily life and business meetings.' },
    { icon: '📸', title: 'Photo and video makeup', desc: 'Camera-ready looks that stay flawless in photos and on screen.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Professional Makeup Artist in Düsseldorf',
      description: 'Anna Pylypchuk is a professional makeup artist in Düsseldorf, NRW specializing in bridal, fashion week, and event makeup.',
    });
  }
}
