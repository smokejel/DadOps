# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DadOps** is a Next.js-based birth cost calculator that helps expecting fathers compare insurance plans. The application uses a teaser-before-paywall model where users see their potential savings before paying $19 to unlock detailed breakdowns.

**Live URL:** dadops.one (deployed on Vercel)

## Architecture

### Data Flow Strategy

**Critical: No localStorage. Use URL-encoded parameters for cross-device compatibility.**

The entire user journey relies on URL token persistence:
1. User fills calculator form → Data encoded to URL token
2. Teaser results page loads with `?token=xxx&preview=true`
3. User pays via Stripe → Redirected with `?token=xxx&session_id=cs_xxx`
4. Full results page verifies payment and displays complete analysis

This approach allows users to start on mobile and complete payment on desktop without data loss.

### Key Calculation Logic

The core calculation assumes users will hit family out-of-pocket maximums during a birth year (statistically likely). The critical logic is:

**Double Deductible Risk Detection:**
- Pregnancy spans calendar years when `dueMonth <= 9` (conception in prior year)
- Double deductible warning triggers when `dueMonth <= 3` (Jan-Mar births)
- In double deductible scenarios: `expectedOop = familyOopMax * 2` (OOP max hit in BOTH plan years)
- Standard scenarios: `expectedOop = familyOopMax`
- Note: Deductibles count TOWARD the OOP max within a plan year, not on top of it

**Total Cost Formula:**
```
effectiveCost = (monthlyPremium × 12) + expectedOop - employerHsa
```

Winner is determined by lowest `effectiveCost` across all plans (2-3 plans supported).

### Page Architecture

**Single Landing Page (`app/page.tsx`):**
- Hero section with CTAs
- How It Works (3-step process)
- Calculator form (due date + plan comparison)
- Pricing section
- Footer with legal links

**Results Page (`app/results/page.tsx`):**
- Handles both teaser (`preview=true`) and full results (with `session_id`)
- Server-side payment verification via Stripe API
- **Paywall bypass:** When `NEXT_PUBLIC_BYPASS_PAYWALL=true`, shows full results immediately (for MVP validation)
- Renders `<TeaserResults>` or `<FullResults>` based on payment status (or bypass flag)
- **Email capture:** After payment, shows ConvertKit email capture modal before full results
- **Beta tester signup:** `<BetaTesterSignup>` component appears on full results dashboard

### Teaser vs Full Results

**Teaser (Unpaid) - What's Visible:**
- Winner announcement with plan name and total cost
- Exact savings amount (e.g., "You save $1,150 compared to Plan B")
- Warning badges if double deductible triggered
- Blurred comparison table/math/breakdown (visible but unreadable)

**Full Results (Paid/Bypassed) - Complete Access:**
- All comparison tables with full numbers
- Detailed cost breakdown per plan
- Mathematical formula explanation
- **Beta tester signup form** for AI PDF parser feature (ConvertKit Form 8914101)
- Locked module previews (Deployment Timeline, Logistics & Gear, Readiness Score)
- Print/share/export functionality

## File Structure

```
app/
├── page.tsx                          # Landing + Calculator (single page)
├── results/page.tsx                  # Teaser OR Full Results (with paywall bypass logic)
├── api/
│   └── create-checkout-session/route.ts  # Stripe checkout creation
├── layout.tsx                        # Root layout with Vercel Analytics
└── globals.css                       # Global styles + Tailwind

components/
├── landing/                          # 8 landing page components
├── calculator/                       # 4 calculator flow components
├── results/
│   ├── TeaserResults.tsx            # Blurred preview with unlock CTA
│   ├── FullResults.tsx              # Complete unlocked view (renders DashboardLayout)
│   ├── EmailCaptureModal.tsx        # ConvertKit email capture after payment
│   └── ResultsActions.tsx           # Print/Share/Start Over buttons
├── dashboard/
│   ├── DashboardLayout.tsx          # Main dashboard container
│   ├── FinancialAnalysisModule.tsx  # Winner card + comparison table
│   ├── BetaTesterSignup.tsx         # Beta tester signup form (NEW)
│   ├── LockedModuleCard.tsx         # Preview cards for future features
│   └── Toast.tsx                    # Toast notification component
└── ui/                              # Reusable components (Button, Input, etc.)

lib/
├── calculations.ts                  # Core calculation engine
├── encoding.ts                      # URL encode/decode for data persistence
├── stripe.ts                        # Stripe helper functions
├── analytics.ts                     # Vercel Analytics event tracking
└── constants.ts                     # Shared constants
```

## Environment Variables Required

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...           # $19 one-time product

# Application URL
NEXT_PUBLIC_URL=https://dadops.one

# ConvertKit Configuration
CONVERTKIT_FORM_ID=8914101          # Form ID for email capture and beta signups
CONVERTKIT_API_V4_KEY=kit_...       # API key for ConvertKit v4
CONVERTKIT_API_V3_KEY=...           # API key for ConvertKit v3
CONVERTKIT_API_SECRET=...           # API secret for ConvertKit

# Development Controls
NEXT_PUBLIC_BYPASS_PAYWALL=true    # Set to 'true' to bypass paywall for MVP validation (development only)
```

## Development Commands

**Note:** This repository currently contains only specifications and mockups. No Next.js project has been initialized yet.

**To initialize the project:**
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install stripe @stripe/stripe-js
```

**Standard Next.js commands (once initialized):**
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Run ESLint
```

## Design System

Based on mockups in `/mockups/`:

**Colors:**
- Primary (Green): `#22C55E` (buttons, accents)
- Warning (Amber): `#F59E0B` (double deductible alerts)
- Error (Red): `#EF4444` (critical alerts)
- Info (Blue): `#3B82F6` (informational callouts)
- Gray scale: 50 (backgrounds) → 900 (primary text)

**Typography:** Inter font family

**Component Patterns:**
- Cards use `border-radius: 12-16px`
- Warning banners have colored backgrounds with appropriate contrast
- Winner cards get green highlight treatment
- Blurred content in teaser uses CSS `filter: blur()` with overlay

## Development Features

### Paywall Bypass (MVP Validation)

The paywall can be temporarily bypassed for MVP validation using an environment variable:

**Configuration:**
- Set `NEXT_PUBLIC_BYPASS_PAYWALL=true` in `.env.local`
- Restart dev server: `npm run dev`

**Behavior:**
- Users skip directly to full results dashboard
- No Stripe payment required
- Email capture modal skipped
- All payment code remains intact and functional

**Re-enabling Paywall:**
- Change to `NEXT_PUBLIC_BYPASS_PAYWALL=false` (or remove the variable)
- Restart dev server
- Normal paywall flow resumes

**Implementation:**
- `app/results/page.tsx:78-104` - Decision logic checks bypass flag
- If bypassed: `isPaid = true`, skips email capture, shows `<FullResults>`
- All Stripe integration code preserved for future re-enablement

### Beta Tester Signup Form

A ConvertKit subscription form appears on the full results dashboard to collect beta testers for the AI PDF parser feature.

**Location:**
- `components/dashboard/DashboardLayout.tsx` - Between financial results and "More Tools Coming Soon"
- Component: `components/dashboard/BetaTesterSignup.tsx`

**Features:**
- Email (required) and first name (optional) inputs
- Submits to ConvertKit Form 8914101
- Enriches submission with calculator data (due date, savings, winning plan)
- Tags submission with `interested_feature: "AI PDF Parser"` and `signup_source: "Results Page"`
- Three states: idle (form), submitting (loading), success (confirmation), error (retry)
- Non-blocking - stays on page after submission (no redirect)
- Dark mode support

**ConvertKit Custom Fields:**
- `first_name` - User input
- `due_date` - From calculator
- `savings_amount` - From calculator
- `winning_plan` - From calculator
- `interested_feature` - Set to "AI PDF Parser"
- `signup_source` - Set to "Results Page"

## Critical Implementation Notes

1. **URL Token Encoding:**
   - Use `btoa(JSON.stringify(data))` then `encodeURIComponent()`
   - Decode with reverse: `JSON.parse(atob(decodeURIComponent(token)))`
   - Token contains: `{ dueMonth, dueYear, plans[] }`

2. **Stripe Integration:**
   - Success URL must include `{CHECKOUT_SESSION_ID}` placeholder
   - Pass `token` through success/cancel URLs to preserve calculator data
   - Verify `payment_status === 'paid'` before showing full results

3. **Form Validation:**
   - Plan 1 and Plan 2 are required
   - Plan 3 is optional (revealed by "Add a third plan" button)
   - Required fields: monthlyPremium, familyDeductible, familyOopMax
   - Optional fields: planName (defaults to "Plan A/B/C"), employerHsa (defaults to 0)

4. **Double Deductible Logic:**
   - Alert triggers when due date is Jan-Mar (months 1-3)
   - Formula changes: add both deductible AND OOP max
   - Always show warning banner if triggered (visible in both teaser and full results)

5. **Conversion Psychology:**
   - Teaser MUST show exact savings amount (the "hook")
   - Paywall message should emphasize value: "Unlock to save $X,XXX"
   - User sees ROI before payment ($19 to save $2,000+)

## MVP Scope Lock

**In Scope:**
- Landing page with calculator form (same page, anchor scroll)
- Teaser results with blurred paywall *(currently bypassed for MVP validation)*
- Stripe Checkout integration ($19 one-time) *(code intact, ready to re-enable)*
- Full results after payment verification (or bypass)
- Email capture via ConvertKit *(skipped when paywall bypassed)*
- Beta tester signup for AI PDF parser feature
- Dashboard with locked module previews
- URL-based data persistence (cross-device)
- Print results functionality
- Mobile responsive design
- Dark mode support
- Vercel Analytics integration

**Out of Scope (v2+):**
- User accounts/authentication
- Database storage
- PDF export (only print supported)
- Email delivery of results
- Advanced analytics dashboard

## Testing Scenarios

**Double Deductible Case:**
- Due date: February 2026 → Should trigger warning
- Verify: `expectedOop = deductible + oopMax` for both plans
- Warning banner should be visible in teaser AND full results

**Normal Case:**
- Due date: July 2026 → No warning
- Verify: `expectedOop = oopMax` only
- No warning banner

**Cross-Device Flow:**
1. Fill calculator on mobile → Copy URL from teaser page
2. Open URL on desktop → Should show same teaser results
3. Complete payment on desktop → Should show full results

**Multi-Plan Comparison:**
- Test with 2 plans (required minimum)
- Test with 3 plans (optional maximum)
- Verify winner selection is based on lowest `effectiveCost`

## Reference Documentation

Full technical specification: `/DADOPS_MVP_SPEC_v2.md`
UI mockups: `/mockups/` (5 screens: landing, due-date, plans, payment, results)