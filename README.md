# Telegram Chat · GREEN-API

Тестовое задание на должность «Фронтенд разработчик React».

Веб-интерфейс для отправки и получения текстовых сообщений в **Telegram** через сервис
[GREEN-API](https://green-api.com/telegram/). Внешний вид — по мотивам [web.telegram.org](https://web.telegram.org).

## Возможности

- Вход по учётным данным инстанса GREEN-API (`idInstance`, `apiTokenInstance`) с проверкой состояния инстанса
- Создание чата по номеру телефона получателя
- Отправка текстовых сообщений — метод [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- Получение сообщений через [HTTP API](https://green-api.com/telegram/docs/api/receiving/technology-http-api/):
  long polling `ReceiveNotification` → обработка → `DeleteNotification`
- Статусы исходящих: отправляется / отправлено / доставлено / прочитано / ошибка (с повтором отправки)
- Новые входящие чаты появляются автоматически, счётчик непрочитанных
- Чаты сохраняются в `localStorage` (отдельно для каждого инстанса)
- Адаптивная вёрстка: на телефоне список чатов и окно чата — отдельные экраны

## Стек

| Задача | Решение |
| --- | --- |
| UI | React 19, TypeScript, [shadcn/ui](https://ui.shadcn.com) (Radix), Tailwind CSS v4, lucide-react |
| Серверное состояние | [TanStack Query v5](https://tanstack.com/query) — мутации, кэш состояния инстанса |
| Клиентское состояние | [Zustand](https://zustand.docs.pmnd.rs) + `persist` |
| Формы и валидация | react-hook-form + zod |
| Уведомления | sonner |
| Сборка, тесты, линт | Vite, Vitest, oxlint, Steiger (FSD) |

## Локальный запуск

Нужен Node.js 20.19+ (или 22.12+).

```bash
npm install
npm run dev
```

Откройте http://localhost:5173.

| Команда | Что делает |
| --- | --- |
| `npm run dev` | dev-сервер |
| `npm run build` | проверка типов и production-сборка в `dist` |
| `npm run preview` | просмотр production-сборки |
| `npm test` | unit-тесты (Vitest) |
| `npm run lint` | линтер (oxlint) |
| `npm run lint:fsd` | проверка архитектуры FSD (Steiger) |
| `npm run typecheck` | проверка типов |

## Подготовка инстанса GREEN-API

1. Зарегистрируйтесь в [личном кабинете GREEN-API](https://console.green-api.com) и создайте инстанс
   Telegram (есть бесплатный тариф Developer).
2. Авторизуйте инстанс: в Telegram на телефоне «Настройки → Устройства → Подключить устройство»
   и отсканируйте QR-код из кабинета.
3. В настройках инстанса оставьте **пустым** поле webhookUrl и включите уведомления о входящих
   и исходящих сообщениях и статусах — иначе HTTP API не будет получать события.
4. Скопируйте `idInstance` и `apiTokenInstance` со страницы инстанса.

## Как пользоваться

1. Введите `idInstance` и `apiTokenInstance`. Поле `apiUrl` необязательно: по умолчанию хост
   вычисляется из первых 4 цифр `idInstance` (`4100…` → `https://4100.api.green-api.com`).
2. Введите номер получателя (например, `+7 999 123-45-67`) и нажмите «+» — приложение найдёт
   chatId собеседника методом `CheckAccount` и откроет чат.
3. Напишите сообщение и нажмите Enter (Shift+Enter — перенос строки).
4. Ответ собеседника из Telegram появится в чате автоматически.

Для проверки нужен второй аккаунт Telegram: сообщение самому себе уходит в «Избранное».

## Архитектура

Проект построен по [Feature-Sliced Design](https://feature-sliced.design) и принципу **кричащей архитектуры**:
имена слайсов и компонентов говорят, *что* делает приложение (`sign-in`, `start-chat-by-phone`,
`send-message`, `ChatCard`, `DeliveryStatusIndicator`), а не *как* оно устроено. Правила слоёв
проверяет линтер [Steiger](https://github.com/feature-sliced/steiger) (`npm run lint:fsd`).

```
src/
├── app/                          # инициализация: провайдеры (setup), выбор страницы (router), стили
├── pages/
│   ├── sign-in/                  # страница входа
│   └── messenger/                # мессенджер; model/use-messenger-page — запуск получения сообщений
├── widgets/
│   ├── chat-list-panel/          # боковая панель: статус, новый чат, список чатов
│   └── conversation/             # окно переписки: собеседник, лента сообщений, поле ввода
├── features/                     # действия пользователя
│   ├── sign-in/                  # вход по idInstance / apiTokenInstance
│   ├── sign-out/                 # выход
│   ├── start-chat-by-phone/      # новый чат по номеру (CheckAccount)
│   ├── send-message/             # отправка (SendMessage) и повтор неудачной отправки
│   └── receive-messages/         # получение через HTTP API, статус подключения
├── entities/                     # бизнес-сущности
│   ├── session/                  # ключи инстанса, проверка состояния инстанса
│   ├── chat/                     # чаты: стор, переходы состояния, карточка чата
│   └── message/                  # сообщения: пузырь, статус доставки, группировка по дням
└── shared/
    ├── api/                      # клиент GREEN-API, query-ключи, QueryClient
    ├── config/                   # константы
    ├── lib/                      # форматирование, хуки, notify, утилиты
    └── ui/                       # UI-кит: абстракции над примитивами
        └── primitives/           # сгенерированные компоненты shadcn/ui (деталь реализации)
```

Внутри слайса код разделён по сегментам: `api` — запросы (TanStack Query), `model` — состояние и логика
(Zustand, кастомные хуки, схемы zod), `ui` — компоненты, `lib` — вспомогательные функции.
Снаружи слайс доступен только через `index.ts`.

### Логика отдельно от UI

Каждый компонент с поведением получает всё из своего хука и только рисует:

| Компонент (`ui`) | Хук (`model` / `api`) |
| --- | --- |
| `SignInForm` | `useSignInForm` → `useSignInMutation` |
| `StartChatForm` | `useStartChatForm` → `useStartChatMutation` |
| `MessageComposer` | `useMessageComposer` → `useSendMessageMutation` |
| `ConnectionStatus` | `useConnectionStore` ← `useMessagePolling` |
| `ChatList` | `useChatList` |
| `Conversation` | `useConversation` |
| `MessengerPage` | `useMessengerPage` |

### Абстракции над UI

Слайсы не импортируют shadcn/ui напрямую, только UI-кит `@/shared/ui`. Он собран из абстракций с понятным
назначением: `IconButton` (кнопка-иконка с обязательной подписью и подсказкой), `LoadingButton`, `TextField` /
`FormTextField` (поле с подписью и ошибкой, подключённое к react-hook-form), `ListItem`, `UserAvatar`,
`CounterBadge`, `ErrorAlert`, `OverlayPill`, `ScrollContainer`, `AutosizeTextarea`, `FormCard` и т.д.
Иконки экспортируются под семантическими именами (`SendIcon`, `LogoutIcon`…), тосты — через `notify`.
Поэтому библиотеку компонентов, иконок или тостов можно заменить в одном месте.

### Ключевые решения

- **Серверное и клиентское состояние разделены.** Запросы к GREEN-API идут через TanStack Query: `useMutation`
  для входа, создания чата и отправки, `useQuery` для проверки состояния инстанса. Переписка накапливается
  из уведомлений и хранится в Zustand.
- **Переходы состояния чатов — чистые функции** (`entities/chat/model/chat-transitions.ts`), разбор уведомлений —
  тоже (`features/receive-messages/model/parse-notification.ts`). Это основная бизнес-логика, она покрыта тестами.
- **Оптимистичная отправка.** Сообщение сразу появляется со статусом «отправляется» (`onMutate`), затем получает
  `idMessage` или статус ошибки. Мутации отправки объединены общим `scope`, поэтому сообщения уходят строго по
  порядку. Автоповтор выключен, чтобы не дублировать сообщения; повторяет пользователь.
- **Long polling живёт в эффекте с `AbortController`, а не в `useQuery`**: это поток событий, а не кэш.
  Уведомление удаляется из очереди даже при ошибке обработки; дубликаты отсекаются по `idMessage`.
  Реакцию на отозванные ключи (выход) задаёт страница: фичи не импортируют друг друга.
- **Страницы загружаются лениво** (`React.lazy`).

## Примечания

- Все запросы идут напрямую из браузера в GREEN-API (сервис разрешает CORS), бэкенд не нужен.
- Учётные данные хранятся только в `localStorage` браузера; кнопка «Выйти» их удаляет.
- Если номер нельзя проверить через `CheckAccount` (лимиты, сбой), сообщение отправляется по номеру
  (`79991234567@c.us`), а настоящий chatId подставляется из первого входящего сообщения собеседника.
