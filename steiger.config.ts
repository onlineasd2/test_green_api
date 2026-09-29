import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Кричащая архитектура: слайсы названы по действиям пользователя (sign-in, send-message…)
    // и остаются отдельными, даже если пока используются в одном месте
    rules: { 'fsd/insignificant-slice': 'off' },
  },
  {
    // Сгенерированные примитивы shadcn/ui — деталь реализации UI-кита, наружу не экспортируются
    files: ['./src/shared/ui/primitives/**'],
    rules: { 'fsd/public-api': 'off' },
  },
])
