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

  serviceSections = [
    {
      id: 'bridal-makeup-hairstyle',
      title: 'Bridal Makeup & Hairstyle',
      description:
        'Your special day will be perfect with our team of beauty experts.',
      image:
        'https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Bridal makeup and hairstyle preparation',
    },
    {
      id: 'trial-session',
      title: 'Trial Session',
      description:
        'A makeup (hair) trial will help you relax and make sure you look your best on your most memorable day.',
      image:
        'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Makeup trial consultation',
    },
    {
      id: 'touch-up-service',
      title: 'Touch up Service',
      description:
        'Your wedding day will be one of the most emotional days of your life, so expect laughter, tears, and lots and lots of kisses! Our touch-up service is the little luxury you deserve. Perhaps you want to change your look from daytime to evening? We have you covered! Our stylists will take care of it.',
      image:
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'On-site touch-up beauty service',
    },
    {
      id: 'photoshoot-service',
      title: 'Photoshoot service',
      description:
        'We are preparing the model for the shoot and providing touch up service during the session.',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Model preparation for photoshoot',
    },
    {
      id: 'exceptional-events',
      title: 'Exceptional events',
      description:
        'Professional beauty styling for gala nights, red carpet moments, and private celebrations.',
      image:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Elegant makeup for exceptional events',
    },
    {
      id: 'education',
      title: 'Education',
      description:
        'Personal lessons and masterclasses for artists and clients who want to build confident, professional techniques.',
      image:
        'https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Beauty education and masterclass',
    },
  ];


  ngOnInit(): void {
    this.seo.setPage({
      title: 'Makeup Services',
      description: 'Explore bridal, fashion week, event makeup, makeup team services, and beauty education by Anna Pylypchuk in Düsseldorf, NRW.',
    });
  }
}
