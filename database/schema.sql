CREATE TABLE IF NOT EXISTS `funnels` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug`        VARCHAR(80)   NOT NULL UNIQUE,
  `title`       VARCHAR(255)  NOT NULL,
  `youtube_id`  VARCHAR(20)   NOT NULL,
  `body_text`   TEXT,
  `button_text` VARCHAR(100)  NOT NULL DEFAULT 'Написати в Telegram',
  `button_url`  VARCHAR(500)  NOT NULL,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `funnels` (`slug`, `title`, `youtube_id`, `body_text`, `button_text`, `button_url`) VALUES
('summer-offer', 'Літня акція — весільний макіяж', 'dQw4w9WgXcQ', 'Спеціальна пропозиція на весільний макіяж цього літа!\n\nЗалиши заявку зараз і отримай знижку 15% на пробний макіяж.', 'Записатись в Telegram', 'https://t.me/anna_makeup_ua'),
('evening-look', 'Вечірній образ — майстер-клас', 'dQw4w9WgXcQ', 'Дивись безкоштовний урок з вечірнього макіяжу і запишись на персональне заняття.', 'Записатись зараз', 'https://t.me/anna_makeup_ua');
