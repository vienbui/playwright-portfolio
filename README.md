# Playwright Automation Framework

![CI](https://github.com/YOUR_USERNAME/playwright-portfolio/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-1.44-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)

A production-ready QA automation framework built with **Playwright + TypeScript**, demonstrating E2E UI testing, API testing, Page Object Model, custom fixtures, and CI/CD integration.

---

## What this framework covers

| Area | Details |
|------|---------|
| UI Testing | E2E tests for login, product search, cart flows |
| API Testing | Full CRUD + auth tests against a REST API |
| Framework Pattern | Page Object Model (POM) with BasePage |
| Test Isolation | Custom fixtures with automatic login/logout |
| CI/CD | GitHub Actions — parallel E2E + API jobs |
| Reporting | HTML report + screenshot/video on failure |

---

## Project structure

```
playwright-portfolio/
├── .github/workflows/       # CI/CD pipeline
│   └── playwright.yml
├── config/
│   └── env.ts               # Environment variables & credentials
├── data/
│   └── users.ts             # Static test data constants
├── fixtures/
│   └── index.ts             # Custom fixtures (POM + authenticatedPage)
├── pages/                   # Page Object Model classes
│   ├── BasePage.ts          # Shared base class
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ProductPage.ts
│   └── CartPage.ts
├── tests/
│   ├── e2e/                 # UI end-to-end tests
│   │   ├── login.spec.ts
│   │   └── product.spec.ts
│   └── api/                 # API tests (no browser)
│       ├── users.spec.ts
│       └── auth.spec.ts
├── utils/
│   ├── ApiClient.ts         # API request helper
│   └── TestDataGenerator.ts # Dynamic test data
└── playwright.config.ts     # Main config (multi-project)
```

---

## Getting started

### Prerequisites
- Node.js 20+
- npm

### Install

```bash
git clone https://github.com/YOUR_USERNAME/playwright-portfolio.git
cd playwright-portfolio
npm install
npx playwright install --with-deps
```

### Run all tests

```bash
npm test
```

### Run by type

```bash
# E2E tests only
npm run test:e2e

# API tests only
npm run test:api

# Run with browser visible
npm run test:headed

# Debug mode
npm run test:debug
```

### View HTML report

```bash
npm run test:report
```

---

## Key design decisions

**Why custom fixtures?**
The `authenticatedPage` fixture handles login once before each test that needs it, then logs out in teardown. This keeps tests independent, faster, and avoids repeating login steps in every test.

**Why BasePage?**
Common actions like `fillField`, `assertVisible`, and `waitForPageLoad` live in one place. If Playwright's API changes or our app's behavior changes, we fix it once.

**Why separate API project in playwright.config.ts?**
API tests don't need a browser. Running them as a separate project skips browser launch overhead and lets them run in parallel with UI tests in CI.

**Why ApiClient wrapper?**
Centralizes status assertion, JSON parsing, and error messages. Tests read as behavior ("assertStatus 201") not implementation ("expect(response.status()).toBe(201)").

---

## CI/CD

GitHub Actions runs on every push and PR to `main`/`develop`:
- E2E tests (Chromium) and API tests run **in parallel** as separate jobs
- Test credentials stored as **GitHub Secrets** — never hardcoded
- HTML reports and screenshots uploaded as **artifacts** on every run
- Failed tests upload full trace/video for debugging

---

## Test sites used

| Tests | Site | Note |
|-------|------|-------|
| E2E | [automationexercise.com](https://automationexercise.com) | Free practice e-commerce site |
| API | [reqres.in](https://reqres.in) | Free REST API for testing |
