import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  private readonly seo = inject(SeoService);

  services = [
    {
      category: 'Bridal makeup',
      icon: '💍',
      items: [
        { name: 'Bridal makeup (bride)', price: '1,500 UAH', duration: '90 min' },
        { name: 'Bridal trial makeup', price: '1,200 UAH', duration: '90 min' },
        { name: 'Bridesmaid makeup', price: '900 UAH', duration: '60 min' },
      ],
    },
    {
      category: 'Evening makeup',
      icon: '✨',
      items: [
        { name: 'Evening makeup', price: '800 UAH', duration: '60 min' },
        { name: 'Prom makeup', price: '850 UAH', duration: '60 min' },
        { name: 'Holiday makeup', price: '750 UAH', duration: '55 min' },
      ],
    },
    {
      category: 'Day makeup',
      icon: '🌸',
      items: [
        { name: 'Day / everyday makeup', price: '600 UAH', duration: '45 min' },
        { name: 'Natural makeup', price: '550 UAH', duration: '40 min' },
        { name: 'Business event makeup', price: '650 UAH', duration: '50 min' },
      ],
    },
    {
      category: 'Photo and video',
      icon: '📸',
      items: [
        { name: 'Photo makeup', price: '900 UAH', duration: '60 min' },
        { name: 'Video shoot makeup', price: '950 UAH', duration: '70 min' },
      ],
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Makeup Services',
      description: 'Explore bridal, fashion week, event makeup, makeup team services, and beauty education by Anna Pylypchuk in Düsseldorf, NRW.',
    });
  }
}
