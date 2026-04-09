import { FunnelPage } from './funnel.service';

export const MOCK_FUNNELS: Map<string, FunnelPage> = new Map([
  [
    'test-offer',
    {
      slug: 'test-offer',
      title: 'Test Offer — Makeup Artist',
      youtube_id: 'dQw4w9WgXcQ',
      body_text: 'This is a mock funnel page for local development. Replace with real content in the database.',
      button_text: 'Написати в Telegram',
      button_url: 'https://t.me/anna_makeup_ua',
      is_active: true,
    },
  ],
]);
