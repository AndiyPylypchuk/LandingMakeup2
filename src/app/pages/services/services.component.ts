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


  ngOnInit(): void {
    this.seo.setPage({
      title: 'Makeup Services',
      description: 'Explore bridal, fashion week, event makeup, makeup team services, and beauty education by Anna Pylypchuk in Düsseldorf, NRW.',
    });
  }
}
