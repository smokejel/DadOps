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
- In double deductible scenarios: `expectedOop = familyDeductible + familyOopMax`
- Standard scenarios: `expectedOop = familyOopMax`

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
- Renders `<TeaserResults>` or `<FullResults>` based on payment status

### Teaser vs Full Results

**Teaser (Unpaid) - What's Visible:**
- Winner announcement with plan name and total cost
- Exact savings amount (e.g., "You save $1,150 compared to Plan B")
- Warning badges if double deductible triggered
- Blurred comparison table/math/breakdown (visible but unreadable)

**Full Results (Paid) - Complete Access:**
- All comparison tables with full numbers
- Detailed cost breakdown per plan
- Mathematical formula explanation
- Print/share/export functionality

## File Structure (To Be Created)

```
app/
├── page.tsx                          # Landing + Calculator (single page)
├── results/page.tsx                  # Teaser OR Full Results
├── api/
│   ├── create-checkout-session/route.ts  # Stripe checkout creation
│   └── verify-session/route.ts           # Payment verification
├── layout.tsx
└── globals.css

components/
├── Calculator/
│   ├── DueDateStep.tsx              # Month/year dropdowns
│   ├── PlanInputCard.tsx            # Individual plan input (2-3 instances)
│   └── CalculatorForm.tsx           # Parent form component
├── Results/
│   ├── TeaserResults.tsx            # Blurred preview with unlock CTA
│   ├── FullResults.tsx              # Complete unlocked view
│   ├── WinnerCard.tsx               # Recommended plan card
│   ├── ComparisonTable.tsx          # Side-by-side plan table
│   ├── WarningBanner.tsx            # Double deductible alerts
│   └── CalculationExplainer.tsx     # "The Math" section
└── ui/                              # Reusable components (Button, Input, etc.)

lib/
├── calculations.ts                  # Core calculation engine
├── encoding.ts                      # URL encode/decode for data persistence
├── stripe.ts                        # Stripe helper functions
└── constants.ts                     # Shared constants
```

## Environment Variables Required

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...           # $19 one-time product
NEXT_PUBLIC_URL=https://dadops.one
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
- Teaser results with blurred paywall
- Stripe Checkout integration ($19 one-time)
- Full results after payment verification
- URL-based data persistence (cross-device)
- Print results functionality
- Mobile responsive design

**Out of Scope (v2+):**
- User accounts/authentication
- Database storage
- PDF export (only print supported)
- Email delivery of results
- Analytics beyond Stripe dashboard

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