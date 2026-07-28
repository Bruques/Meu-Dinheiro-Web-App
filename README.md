# MeuDinheiro — Web

Angular web client for MeuDinheiro, a personal finance tracker with WhatsApp-based, AI-parsed
expense logging. Shares the same [Spring Boot backend](https://github.com/Bruques/Meu-Dinheiro-Backend)
as the [iOS app](https://github.com/Bruques/MeuDinheiroiOS).

## What it does

- Dashboard, expense entry, and account settings for the same expense-tracking data used on iOS.
- Firebase Authentication for sign-in, with an HTTP interceptor attaching the auth token to API
  requests automatically.

## Tech stack

Angular (standalone components) · TypeScript · Firebase Auth

## Running locally

```bash
ng serve
```

Then open `http://localhost:4200`.

## Status

Secondary client for the MeuDinheiro backend — the iOS app is the primary, more actively
developed surface of this product.
