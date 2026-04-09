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
      category: 'Весільний макіяж',
      icon: '💍',
      items: [
        { name: 'Весільний макіяж (наречена)', price: '1 500 грн', duration: '90 хв' },
        { name: 'Пробний весільний макіяж', price: '1 200 грн', duration: '90 хв' },
        { name: 'Макіяж для подружок нареченої', price: '900 грн', duration: '60 хв' },
      ],
    },
    {
      category: 'Вечірній макіяж',
      icon: '✨',
      items: [
        { name: 'Вечірній макіяж', price: '800 грн', duration: '60 хв' },
        { name: 'Макіяж на випускний', price: '850 грн', duration: '60 хв' },
        { name: 'Святковий макіяж', price: '750 грн', duration: '55 хв' },
      ],
    },
    {
      category: 'Денний макіяж',
      icon: '🌸',
      items: [
        { name: 'Денний / повсякденний макіяж', price: '600 грн', duration: '45 хв' },
        { name: 'Натуральний макіяж', price: '550 грн', duration: '40 хв' },
        { name: 'Макіяж для ділових заходів', price: '650 грн', duration: '50 хв' },
      ],
    },
    {
      category: 'Фото та відео',
      icon: '📸',
      items: [
        { name: 'Фотомакіяж', price: '900 грн', duration: '60 хв' },
        { name: 'Макіяж для відеозйомки', price: '950 грн', duration: '70 хв' },
      ],
    },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Послуги та ціни',
      description: 'Ціни на послуги візажиста Анни Пилипчук: весільний макіяж від 1500 грн, вечірній від 800 грн. Чернівці.',
    });
  }
}
