# Authentication: 
Nice — good call thinking about orgs early. Below I’ll compare **Clerk**, **Kinde**, and **WorkOS** focused on the things you care about: organizations (multi-tenant/teams), developer experience, enterprise SSO/features, and costs during development and at scale. I used each vendor’s docs/pricing while preparing this so the numbers/limits are current. ([Clerk][1])

---

# Quick TL;DR

* **If you want fastest dev DX + beautiful auth UIs and a very generous free tier** → **Clerk**. Very dev-friendly and supports Organizations, SSO, RBAC. Free: first **10,000 MAUs and 100 active organizations** included. ([Clerk][1])
* **If you want an all-in-one dev platform (auth + billing + feature flags) to minimize extra services** → **Kinde**. Free tier already includes organizations and billing primitives, so you can build and monetize from day one. ([Kinde][2])
* **If you’re targeting Enterprise customers that require wide SSO/Directory integrations and audit/logs** → **WorkOS**. It’s focused on enterprise features (SSO, Directory Sync, Audit Logs) and is often used in front of your auth to handle many enterprise IdP integrations. Expect enterprise pricing patterns (per-org / product). ([WorkOS][3])

---

# Short feature comparison

### Organizations / multi-tenant support

* **Clerk**: First-class *Organizations* concept (teams/workspaces), membership, roles/permissions, ability to configure enterprise connections per organization (SAML/OIDC). Good docs for building B2B flows. ([Clerk][4])
* **Kinde**: Built for B2B/B2C; their free tier explicitly lists *B2B management with organizations* and includes role/permission basics. Also bundles billing and feature management useful for SaaS tenants. ([Kinde][2])
* **WorkOS**: Focus is on adding enterprise features to your existing auth. It provides org discovery, SSO, directory sync, and enterprise admin features — excellent for turnkey enterprise IdP integrations, less of a full user-management UI unless you build around it. ([WorkOS][3])

### Enterprise SSO & Directory

* **Clerk**: Supports SAML/OIDC enterprise connections at the org level. Good when you want both dev DX and enterprise SSO in one product. ([Clerk][4])
* **Kinde**: Provides SSO options (social, OIDC), and is positioning itself as a combined auth + billing platform — check their docs for enterprise IdP depth if you expect many large customers. ([Kinde][2])
* **WorkOS**: Best in class for enterprise SSO, directory sync (AD, Azure AD, Google Workspace), and audit/logs. Companies often use WorkOS to quickly support *many* enterprise IdPs with one integration. ([WorkOS][3])

### Developer experience & SDKs

* **Clerk**: Very polished SDKs + prebuilt React/UIs, strong DX for building sign-in flows quickly. Good docs and examples for multi-tenant apps. ([Clerk][5])
* **Kinde**: SDKs and hosted UI; marketed to developers as a “platform” (auth + billing + access). If you want fewer third-party integrations overall, Kinde lowers integration count. ([Kinde][6])
* **WorkOS**: SDKs focused on enterprise features. Works best *with* your auth (or combined with a provider like Auth0/Clerk) rather than replacing a full CIAM for all use cases. ([WorkOS][3])

---

# Pricing & cost considerations (development and live)

### Clerk

* **Free tier**: **First 10,000 MAUs and 100 active organizations are free** (and development mode exposes all features). That is very friendly for dev and early production. After free limits, pricing scales per MAU and per product features. Great for minimizing dev costs. ([Clerk][1])

### Kinde

* **Free tier**: Kinde’s free plan explicitly lists organizations, billing primitives, MFA, etc. Their paid tiers remove branding, add higher throughput / transaction handling (G2 lists a Plus at \~\$75/mo with transaction fees removed). Because Kinde bundles billing and access management you may save money by not adding a separate billing provider during early productization. ([Kinde][2])

### WorkOS

* **Pricing model**: WorkOS sells enterprise features modularly (SSO, Directory Sync, Audit Logs). They emphasize “pay as you go” and have enterprise org pricing; some public comparisons note flat org fees for SSO (WorkOS has historically quoted things like \$125/org for SSO in comparisons). WorkOS is more likely to become costly once you onboard multiple paying enterprises that require dedicated SSO/Directory features. If you only need simple auth for customers, WorkOS may be overkill. ([WorkOS][7])

---

# Practical recommendations for a cost-sensitive SaaS

1. **Start with Clerk or Kinde during development**

   * **Clerk** if you want the absolute fastest integration and excellent prebuilt UI components. Their free MAU/org limits let you develop and even launch without much auth cost. ([Clerk][1])
   * **Kinde** if you want auth **plus** billing and feature flags bundled so you don’t integrate Stripe / a feature-flag service immediately — that reduces operational overhead and potential cost. ([Kinde][2])

2. **Plan for enterprise SSO later (opt-in)**

   * If you expect to sell to enterprises that require AD/Azure/Google Workspace SSO or SCIM/Directory Sync, plan a path:

     * Option A (simpler): Use Clerk/Kinde for primary auth and *add WorkOS later* only for enterprise customers that need many IdP integrations. WorkOS is designed exactly for that: add enterprise features to an existing app. ([WorkOS][3])
     * Option B: If you think most customers will already be enterprise from day one, evaluate WorkOS up front — but expect higher ongoing costs (per-org or per-product). ([WorkOS][7])

3. **Concrete cost-saving path**

   * Dev & MVP: **Clerk free** (use their Organizations & hosted UI) or **Kinde free** (if you want built-in billing). Both get you to an MVP quickly at minimal cost. ([Clerk][1])
   * When onboarding your first paying enterprise customer who needs SSO/SCIM: evaluate **WorkOS** as an add-on to handle IdP and directory integrations — you won’t have to rework your core auth. ([WorkOS][3])

---

# Pros & cons (short)

* **Clerk**

  * Pros: superb DX, prebuilt UI, large free MAU/org allowances, orgs + SSO support. Low friction to ship. ([Clerk][1])
  * Cons: If you need built-in billing/feature flags you’ll still integrate other services (Stripe, LaunchDarkly, etc).

* **Kinde**

  * Pros: Auth + billing + access in one platform; free orgs & billing primitives — good if you want fewer vendors and to monetize fast. ([Kinde][2])
  * Cons: Newer than some incumbents; check enterprise IdP depth if you target very large customers.

* **WorkOS**

  * Pros: Best for rapid enterprise SSO and directory integrations, audit logs, SCIM. Integrates with your existing auth. ([WorkOS][3])
  * Cons: Enterprise focus means pricing and per-org costs can be higher if you need the feature for many customers.

---

# What I’d do if I were you (step-by-step)

1. **MVP / dev**: Use **Clerk free** if your priority is speed and low cost — you’ll get orgs + great UI and low/no bill while iterating. If you want billing + auth in one place, try **Kinde free**. ([Clerk][1])
2. **Instrument usage / estimate MAUs & orgs**: Track how many active users and organizations you actually need (Clerk’s MAU/org thresholds are generous, but you should know your growth curve). ([Clerk][1])
3. **Enterprise customers**: When a customer requires enterprise SSO/SCIM, add **WorkOS** (or use Clerk’s enterprise connections if you prefer one vendor)—compare the per-org cost vs your customer’s willingness to pay. ([Clerk][4])

---

If you like, I can:

* make a **three-column cost+feature spreadsheet** (Clerk / Kinde / WorkOS) with the exact free limits, common paid tiers, and the integration work you’ll need (Stripe, SCIM, RBAC) — handy for an engineering/product plan; **or**
* produce a short **roadmap** that shows which vendor to use at MVP vs when to add WorkOS for enterprise customers.

Which would you prefer?

[1]: https://clerk.com/pricing?utm_source=chatgpt.com "Pricing"
[2]: https://kinde.com/pricing/?utm_source=chatgpt.com "Pricing"
[3]: https://workos.com/?utm_source=chatgpt.com "WorkOS — Your app, Enterprise Ready."
[4]: https://clerk.com/docs/organizations/overview?utm_source=chatgpt.com "Build a B2B/B2C multi-tenant SaaS with Clerk Organizations"
[5]: https://clerk.com/docs/guides/multi-tenant-architecture?utm_source=chatgpt.com "Multi-tenant architecture"
[6]: https://kinde.com/?utm_source=chatgpt.com "Kinde Auth, billing and access management for modern SaaS ..."
[7]: https://workos.com/pricing?utm_source=chatgpt.com "Pricing"

Got it — here’s a clean comparison table for **Clerk**, **Kinde**, and **WorkOS** focused on **auth, organizations, enterprise features, DX, and pricing**:

---

# SaaS Auth Providers Comparison

| Feature / Vendor                 | **Clerk**                                                                | **Kinde**                                                          | **WorkOS**                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Core Auth**                    | Full CIAM: email/password, social, passkeys, magic links, MFA            | Full CIAM: email/password, social, MFA                             | Not a full CIAM, instead adds enterprise features on top of your auth                             |
| **Organizations / Multi-tenant** | ✅ Built-in “Organizations” (teams, roles, membership)                    | ✅ Built-in orgs & roles, part of free plan                         | ⚠️ Provides “Organizations API” + directory sync; meant for enterprise SSO, not consumer org mgmt |
| **Enterprise SSO (SAML, OIDC)**  | ✅ Yes, attach enterprise IdPs per org                                    | ✅ Yes, but fewer enterprise IdPs compared to WorkOS                | 🏆 Best in class — supports most IdPs (Okta, Azure AD, Google, Ping, etc.)                        |
| **Directory Sync (SCIM, HRIS)**  | ❌ Limited (some SCIM via enterprise features)                            | ❌ Not core                                                         | ✅ Yes, broad SCIM & directory integrations                                                        |
| **Audit Logs / Compliance**      | Basic event logs                                                         | Basic logs                                                         | ✅ Enterprise-grade audit logs, webhook events                                                     |
| **SDKs & DX**                    | 🏆 Very polished SDKs, prebuilt UIs (React, Next.js, etc.), excellent DX | Good SDKs + hosted UI; simpler all-in-one flow                     | SDKs focus on enterprise SSO & directories; less for general UI/auth                              |
| **Extra features**               | Focused on auth/identity                                                 | Bundles **billing, feature flags, access control**                 | Adds **enterprise-only features** (SSO, directory sync, audit logs)                               |
| **Free tier (2025)**             | **10,000 MAUs + 100 orgs free**                                          | **Free forever tier with orgs, billing, MFA**                      | Free developer sandbox; enterprise features often **\$125/org/month** (historical pricing)        |
| **Scaling cost**                 | After free → MAU-based pricing                                           | Paid plans (e.g. \~\$75/mo to remove limits/branding + usage fees) | Enterprise pricing, usually per-org and per-product module                                        |
| **Best fit**                     | SaaS apps needing fast DX, orgs, and cheap/free early stage              | Startups wanting auth + billing + feature flags bundled            | SaaS targeting **enterprise customers** who demand SSO/Directory integrations                     |

---

✅ **My take if cost-sensitive & early stage**

* Start with **Clerk** (if you want plug-and-play auth + orgs + UI, very generous free tier)
* Or use **Kinde** (if you also want billing + feature flags bundled, fewer services to integrate)
* Add **WorkOS later** only if you land enterprise clients who require deep SSO/SCIM integrations.

---

Do you want me to also make a **cost projection table** (e.g. “100 users, 1k users, 10k users” → what Clerk/Kinde/WorkOS would cost)? That might help estimate your spend when you go live.


Tak — znalazłem sporo nowych rzeczy w Clerk i Kinde. Oto co udało mi się wychwycić, co może Cię interesować:

---

## Clerk — nowe funkcje / zmiany

| Data                      | Co nowego                                                                                                                                                                                                | Co to oznacza dla SaaS / organizacji                                                                                                                                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **10 lipca 2025**         | Wprowadzono *top-level Features* (konstrukcję Features jako pierwszorzędną w aplikacji), przebudowano stronę zarządzania Ról & Uprawnień (Roles & Permissions). ([Clerk][1])                             | Możesz definiować “features” w Clerk (np. “funkcja premium”, “eksperymentalna funkcja”) i przypisywać je do ról albo używać helperów/auth guardów typu `has()`, `protect()` etc. Ułatwia budowę modelu funkcji (feature flags) + kontrolę dostępu w aplikacji bez konieczności osobnego narzędzia. |
| **13 czerwca 2025**       | Ulepszenia OAuth: wprowadzenie *OAuth scoped access*, czyli aplikacje zewnętrzne mogą uzyskiwać tokeny z ograniczonym zakresem uprawnień (scope), potwierdzanie i weryfikacja tokenów, itd. ([Clerk][2]) | To duży plus jeśli planujesz API, integracje zewnętrzne, aplikacje trzecie, albo chcesz pozwolić klientom dać dostęp komuś innemu (np. integracje). Umożliwia bardziej granulowane uprawnienia zamiast “wszystko albo nic”.                                                                        |
| **Integracja z Supabase** | Clerk ma lepsze wsparcie dla integracji Supabase: od \~kwietnia 2025 zmienili sposób integracji ze “szablonami JWT” na natywne wsparcie dla zewnętrznego OAuth, co upraszcza. ([SuperTokens][3])         | Jeśli używasz Supabase jako bazy danych / backendu, to ułatwia budowę autoryzacji + reguł (np. row-level security) z Clerk jako auth providerem. Mniej konfiguracji własnej, lepsza spójność / bezpieczeństwo.                                                                                     |

---

## Kinde — nowe funkcje / zmiany

Z rzeczami od Kinde:

| Data                 | Co nowego                                                                                                                                                                                                           | Co to oznacza                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **29 sierpnia 2025** | *Device Authorization Flow* — obsługa flow urządzeń. („Authentication” update) ([updates.kinde.com][4])                                                                                                             | Użyteczne jeśli chcesz wspierać logowanie z urządzeń, które nie mają łatwej metody wprowadzania loginu (np. TV, IoT).                                                         |
| **5 sierpnia 2025**  | **M2M apps scoped to organizations** — teraz możesz tworzyć aplikacje typu machine-to-machine (M2M) w obrębie organizacji, ograniczając (scoping) funkcjonalność / API dla tych aplikacji. ([updates.kinde.com][4]) | Jeśli Twoje orgy (klienci, zespoły) potrzebują własnych API/ integracji bez “pełnego dostępu”, to bardzo pomocna funkcja. Pozwala na większą separację/bezpieczeństwo.        |
| **30 czerwca 2025**  | Billing (rachunki, płatności) + “self-serve portals” + Account API itd. ([updates.kinde.com][4])                                                                                                                    | Dobrze – od razu możesz mieć panel, w którym klienci (organizacje) mogą zarządzać swoją subskrypcją/płatnościami, masz gotowe API konta, co przyspiesza monetizację produktu. |
| **30 maja 2025**     | Możliwość konfigurowania sesji *na poziomie organizacji* (dla planu “Scale” Kinde) — np. definiujesz, ile sesji / jak długo one trwają per org. ([updates.kinde.com][4])                                            | Ważne dla bezpieczeństwa i zasobów: np. chcesz, żeby organizacje miały sesje wygasające wcześniej albo różne limity. Pomaga kontrolować zużycie/ryzyko.                       |

---

Jeśli chcesz, mogę sprawdzić, **czy są jakieś zmiany bardzo świeże** (ostatnie tygodnie) albo **plany roadmapy** tych serwisów, żebyś wiedział, co może się pojawić. Chcesz?

[1]: https://clerk.com/changelog/2025-07-10-top-level-features-plus-roles-and-permissions?utm_source=chatgpt.com "Introducing top-level Features. Plus redesigned Roles & ..."
[2]: https://clerk.com/changelog/2025-06-13-oauth-improvements?utm_source=chatgpt.com "OAuth Provider Improvements"
[3]: https://supertokens.com/blog/how-to-integrate-clerk-with-supabase?utm_source=chatgpt.com "How to Integrate Clerk with Supabase (Plus another option ..."
[4]: https://updates.kinde.com/?utm_source=chatgpt.com "Kinde - Feature release hub"



