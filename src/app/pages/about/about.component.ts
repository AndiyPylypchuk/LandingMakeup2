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
    'Весільний макіяж', 'Вечірній макіяж', 'Денний макіяж',
    'Фотомакіяж', 'Корекція брів', 'Airbrush техніка',
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Про мене',
      description: 'Анна Пилипчук — професійний візажист з Чернівців. Дізнайтесь про мій досвід, навчання та підхід до роботи.',
    });
  }
}
