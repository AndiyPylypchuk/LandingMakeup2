import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found__code">404</div>
      <h1 class="not-found__title">Page not found</h1>
      <p class="not-found__desc">Sorry, the page you requested does not exist or has been moved.</p>
      <a routerLink="/" class="btn btn--outline">Back to home</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
      text-align: center;
      padding: 2rem;

      &__code {
        font-size: 7rem;
        font-weight: 800;
        background: linear-gradient(90deg, var(--gold), #e0a0c0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        margin-bottom: 0.5rem;
      }

      &__title {
        font-size: 1.8rem;
        color: #fff;
        margin-bottom: 0.75rem;
      }

      &__desc {
        color: rgba(255, 255, 255, 0.55);
        margin-bottom: 2rem;
      }
    }
  `],
})
export class NotFoundComponent {}
