import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SeoService } from '../../services/seo.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  errorMsg = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    website: [''], // honeypot — must remain empty
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Contacts',
      description: 'Contact Anna Pylypchuk, a professional makeup artist in Düsseldorf, NRW for bridal, fashion week, event makeup, makeup team bookings, and courses.',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Honeypot check — if filled by bot, silently ignore
    if (this.form.value.website) {
      this.status.set('success');
      return;
    }

    this.status.set('sending');
    const { name, email, message, website } = this.form.getRawValue();

    this.contactService.send({ name, email, message, website }).subscribe({
      next: (res) => {
        if (res.success) {
          this.status.set('success');
          this.form.reset();
        } else {
          this.status.set('error');
          this.errorMsg.set(res.message || 'Something went wrong. Please try again.');
        }
      },
      error: () => {
        this.status.set('error');
        this.errorMsg.set('Connection error. Please try again later.');
      },
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
