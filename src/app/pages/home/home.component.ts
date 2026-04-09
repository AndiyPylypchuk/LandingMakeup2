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
    { icon: '💍', title: 'Весільний макіяж', desc: 'Незабутній образ у найважливіший день вашого життя.' },
    { icon: '✨', title: 'Вечірній макіяж', desc: 'Яскравий, стійкий макіяж для особливих подій.' },
    { icon: '🌸', title: 'Денний макіяж', desc: 'Природний, легкий образ для повсякденного життя.' },
    { icon: '📸', title: 'Макіяж для фото/відео', desc: 'Образи, що бездоганно виглядають на фото.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Візажист Анна Пилипчук',
      description: 'Професійний візажист Анна Пилипчук. Весільний, вечірній та денний макіяж у Чернівцях. Запишіться онлайн.',
    });
  }
}
