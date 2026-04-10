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
    'Bridal makeup', 'Evening makeup', 'Day makeup',
    'Photo makeup', 'Brow correction', 'Airbrush technique',
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'About Anna Pylypchuk',
      description: 'Learn more about Anna Pylypchuk, a professional makeup artist in Düsseldorf, her experience, training, makeup courses, and creative approach.',
    });
  }
}
