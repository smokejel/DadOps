# DadOps MVP Technical Specification

## Overview

**Live URL:** dadops.one (already deployed on Vercel via Next.js)

---

## User Flow (Updated: Teaser Before Paywall)

```
1. Landing Page (dadops.one)
   └── CTA scrolls to calculator section
   
2. Calculator Section (same page)
   ├── Step 1: Due Date (month/year dropdowns)
   ├── Step 2: Plan Details (2 plans default, optional 3rd)
   └── "Calculate My Costs" button → Teaser Results
   
3. Teaser Results (same page or modal)
   ├── Shows: "Plan A saves you $X,XXX compared to Plan B"
   ├── Shows: Warning badges (Double Deductible Alert if triggered)
   ├── Blurs: Detailed breakdown, comparison table, math explanation
   └── CTA: "Unlock Full Results — $29"
   
4. Stripe Checkout (external)
   └── $29 one-time payment
   └── Success redirects to /results?token={encoded_data}
   
5. Full Results Page (/results)
   └── Decode URL params, display complete comparison
```

**Key Change:** User sees the SAVINGS NUMBER before paying. They're paying $29 to save $2,000+, not paying $29 to find out IF they can save.

---

## Data Persistence (Updated: URL Params)

**No localStorage. Use URL-encoded params instead.**

Why: A dad fills this out on his phone at lunch, wants to pay on desktop later. URL params work across devices; localStorage doesn't.

### Encoding Strategy

```typescript
// lib/encoding.ts

interface CalculatorData {
  dueMonth: number;
  dueYear: number;
  plans: Plan[];
}

// Encode data to URL-safe string
export function encodeCalculatorData(data: CalculatorData): string {
  const json = JSON.stringify(data);
  const base64 = btoa(json);
  return encodeURIComponent(base64);
}

// Decode URL param back to data
export function decodeCalculatorData(token: string): CalculatorData {
  const base64 = decodeURIComponent(token);
  const json = atob(base64);
  return JSON.parse(json);
}

// Generate shareable URL
export function generateResultsUrl(data: CalculatorData, paid: boolean): string {
  const token = encodeCalculatorData(data);
  if (paid) {
    return `${process.env.NEXT_PUBLIC_URL}/results?token=${token}`;
  }
  return `${process.env.NEXT_PUBLIC_URL}/results?token=${token}&preview=true`;
}
```

### URL Structure

```
# Teaser (unpaid)
dadops.one/results?token=eyJkdWVNb250aCI6Mn0...&preview=true

# Full results (paid)
dadops.one/results?token=eyJkdWVNb250aCI6Mn0...&session_id=cs_xxx
```

---

## Pages & Components

### Page 1: Landing + Calculator (`app/page.tsx`)

Single page with sections:

**Section A: Hero**
- Headline: "The Insurance Math Nobody Teaches Expecting Dads"
- Subhead: "Stop guessing. Compare insurance plans and calculate the true cost of your baby's birth year in 2 minutes."
- Primary CTA: "Calculate My Costs" — scrolls to calculator section
- Secondary CTA: "See How It Works" — scrolls to how-it-works section

**Section B: How It Works**
- 3 steps with icons:
  1. Enter Due Date — "We check if your pregnancy spans two calendar years"
  2. Compare Plans — "Input details for up to 3 insurance plans"
  3. Get Recommendation — "See which plan saves you the most"

**Section C: Calculator Form**
- Anchor ID: `#calculator`
- Step 1: Due Date
  - Month dropdown (January-December)
  - Year dropdown (2025, 2026, 2027)
  - Info box: "The Double Deductible Trap" explanation
- Step 2: Plan Comparison
  - Plan 1 card (required):
    - Plan Nickname (optional, text)
    - Monthly Premium (required, currency)
    - Family Deductible (required, currency)
    - Family Out-of-Pocket Max (required, currency)
    - Employer HSA/HRA Contribution (optional, currency)
  - Plan 2 card (required): same fields
  - "Add a third plan" button (reveals Plan 3 card)
  - Helper: "Need help? Look for the Summary of Benefits and Coverage (SBC) from your HR portal."
- Submit: "Calculate My Costs →" button
  - Disabled until required fields filled
  - On click: Encode data to URL, redirect to `/results?token=xxx&preview=true`

**Section D: Pricing**
- Simple card: "$29 one-time"
- Checkmarks: Compare up to 3 plans, Double-deductible detection, Detailed breakdown
- Trust badges: "Secure payment via Stripe"

**Section E: Footer**
- Disclaimer: "DadOps provides estimates based on your inputs. Not financial advice."
- Links: Privacy Policy, Terms of Service, Contact

---

### Page 2: Results (`app/results/page.tsx`)

**Handles both teaser (preview=true) and full results (paid).**

**Entry Options:**
1. `?token=xxx&preview=true` — Teaser mode (unpaid)
2. `?token=xxx&session_id=cs_xxx` — Full mode (verify payment, then show all)

**Logic:**
```typescript
export default async function ResultsPage({ searchParams }) {
  const { token, preview, session_id } = searchParams;
  
  // Decode calculator data from URL
  const data = decodeCalculatorData(token);
  
  // Run calculations
  const results = calculateAllPlans(data);
  
  // Check if paid
  let isPaid = false;
  if (session_id) {
    isPaid = await verifyStripeSession(session_id);
  }
  
  // Render teaser or full results
  return isPaid ? <FullResults data={results} /> : <TeaserResults data={results} token={token} />;
}
```

---

### Component: Teaser Results (`components/Results/TeaserResults.tsx`)

**What's VISIBLE (the hook):**

1. **Winner Announcement Card**
   - "Based on your inputs, we found a winner."
   - Plan name: "Plan A" (or their custom nickname)
   - Big number: **"$4,200"** / year est. total cost
   - Savings line: **"You save $1,150"** compared to Plan B
   - This is fully visible — it's the dopamine hit

2. **Warning Badges (if triggered)**
   - 🔴 "Double Deductible Alert Detected" — fully visible
   - This creates urgency: "Wait, I triggered something bad?"

3. **Teaser of What's Locked**
   - Blurred comparison table (visible but unreadable)
   - Blurred "The Math" section
   - Blurred detailed breakdown

**What's LOCKED (behind paywall):**

- Full comparison table with all numbers
- Math explanation showing the formula
- Detailed breakdown per plan
- Print/export functionality

**CTA Section:**
```
┌─────────────────────────────────────────────┐
│  🔓 Unlock Your Full Analysis               │
│                                             │
│  ✓ Side-by-side plan comparison            │
│  ✓ Complete cost breakdown                  │
│  ✓ The math behind your savings             │
│  ✓ Printable summary for your partner       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │      $29 one-time                   │   │
│  │   [ Unlock Full Results → ]         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🔒 Secure payment via Stripe               │
│  ✓ 30-day money-back guarantee              │
└─────────────────────────────────────────────┘
```

**"Unlock Full Results" Button Action:**
```typescript
async function handleUnlock() {
  // Create Stripe checkout, passing the token through
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ token }), // Pass token to preserve data
  });
  const { url } = await response.json();
  window.location.href = url;
}
```

---

### Component: Full Results (`components/Results/FullResults.tsx`)

**Everything visible. User has paid.**

**UI Components:**

**Warning Banners (conditional):**
- Double Deductible Alert (if due date Jan-Mar and pregnancy spans years)
  - Red/amber background
  - "Warning: Your pregnancy spans calendar years. You may hit deductibles in BOTH years. We've factored this into our calculations."
- Always show (info): "Your baby gets their own deductible immediately at birth"
- Always show (info): "You have 30 days after birth to add baby to insurance"

**Winner Card:**
- Green background
- "RECOMMENDED PLAN" badge
- Plan name
- Total cost (large): "$X,XXX / year est. total cost"
- Savings line: "You save $X,XXX compared to [other plan]"

**Comparison Table:**
- Columns: Plan Name | Annual Premiums | Max Out-of-Pocket | Employer HSA | Est. Total Cost
- Winner row highlighted
- All numbers fully visible

**Calculation Explanation Card:**
- "The Math: How we calculated this"
- Formula: `Total Cost = (12 × Monthly Premium) + Family OOP Max - Employer HSA`
- Plain English explanation
- Why we assume you'll hit OOP max (statistically likely for birth year)

**Actions:**
- "Print Results" button (window.print())
- "Start Over" button (redirects to /)
- "Share Link" button (copies current URL — they can send to partner)

---

## Core Calculation Logic

```typescript
// lib/calculations.ts

interface Plan {
  id: number;
  name: string;
  monthlyPremium: number;
  familyDeductible: number;
  familyOopMax: number;
  employerHsa: number;
}

interface CalculationResult {
  plan: Plan;
  annualPremium: number;
  expectedOop: number;
  totalCost: number;
  effectiveCost: number;
  doubleDeductibleRisk: boolean;
}

interface FullResults {
  results: CalculationResult[];
  winner: CalculationResult;
  runnerUp: CalculationResult | null;
  savings: number;
  doubleDeductibleRisk: boolean;
  dueMonth: number;
  dueYear: number;
}

export function calculateAllPlans(data: {
  dueMonth: number;
  dueYear: number;
  plans: Plan[];
}): FullResults {
  const { dueMonth, dueYear, plans } = data;
  
  // Check if pregnancy spans calendar years
  const spansYears = dueMonth <= 9; // Conception would be prior year
  const doubleDeductibleRisk = spansYears && dueMonth <= 3;
  
  // Calculate each plan
  const results: CalculationResult[] = plans.map((plan) => {
    const annualPremium = plan.monthlyPremium * 12;
    
    let expectedOop: number;
    if (doubleDeductibleRisk) {
      // Year 1: hit family deductible (prenatal care)
      // Year 2: hit family OOP max (birth + baby)
      expectedOop = plan.familyDeductible + plan.familyOopMax;
    } else {
      // Standard: assume you'll hit family OOP max
      expectedOop = plan.familyOopMax;
    }
    
    const totalCost = annualPremium + expectedOop;
    const effectiveCost = totalCost - (plan.employerHsa || 0);
    
    return {
      plan,
      annualPremium,
      expectedOop,
      totalCost,
      effectiveCost,
      doubleDeductibleRisk,
    };
  });
  
  // Sort by effective cost (lowest first)
  results.sort((a, b) => a.effectiveCost - b.effectiveCost);
  
  const winner = results[0];
  const runnerUp = results[1] || null;
  const savings = runnerUp ? runnerUp.effectiveCost - winner.effectiveCost : 0;
  
  return {
    results,
    winner,
    runnerUp,
    savings,
    doubleDeductibleRisk,
    dueMonth,
    dueYear,
  };
}
```

---

## Stripe Integration

### Setup Required
1. Stripe account with product: "DadOps Birth Cost Calculator" — $29 one-time
2. Environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID`
   - `NEXT_PUBLIC_URL`

### API Route: `/api/create-checkout-session`

```typescript
// app/api/create-checkout-session/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { token } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'payment',
    // Pass token through to results page
    success_url: `${process.env.NEXT_PUBLIC_URL}/results?token=${token}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/results?token=${token}&preview=true`,
  });

  return NextResponse.json({ url: session.url });
}
```

### API Route: `/api/verify-session`

```typescript
// app/api/verify-session/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { session_id } = await request.json();
  
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json({
      paid: session.payment_status === 'paid',
    });
  } catch (error) {
    return NextResponse.json({ paid: false });
  }
}
```

---

## Design Tokens

Based on Stitch mockups:

```css
:root {
  /* Colors */
  --color-primary: #22C55E;        /* Green - buttons, accents */
  --color-primary-dark: #16A34A;   /* Green hover state */
  --color-primary-light: #DCFCE7;  /* Green backgrounds */
  
  --color-warning: #F59E0B;        /* Amber - warnings */
  --color-warning-light: #FEF3C7;  /* Amber background */
  
  --color-error: #EF4444;          /* Red - alerts */
  --color-error-light: #FEE2E2;    /* Red background */
  
  --color-info: #3B82F6;           /* Blue - info callouts */
  --color-info-light: #DBEAFE;     /* Blue background */
  
  --color-gray-50: #F9FAFB;        /* Page background */
  --color-gray-100: #F3F4F6;       /* Card backgrounds */
  --color-gray-200: #E5E7EB;       /* Borders */
  --color-gray-500: #6B7280;       /* Secondary text */
  --color-gray-900: #111827;       /* Primary text */
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  
  /* Spacing */
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

---

## File Structure

```
dadops/
├── app/
│   ├── page.tsx                 # Landing + Calculator
│   ├── results/
│   │   └── page.tsx             # Teaser OR Full Results
│   ├── api/
│   │   ├── create-checkout-session/
│   │   │   └── route.ts
│   │   └── verify-session/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Calculator/
│   │   ├── DueDateStep.tsx
│   │   ├── PlanInputCard.tsx
│   │   └── CalculatorForm.tsx
│   ├── Results/
│   │   ├── TeaserResults.tsx    # NEW: Blurred preview
│   │   ├── FullResults.tsx      # NEW: Unlocked view
│   │   ├── WinnerCard.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── WarningBanner.tsx
│   │   └── CalculationExplainer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Card.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── calculations.ts          # Core calculation logic
│   ├── encoding.ts              # NEW: URL encode/decode
│   ├── stripe.ts                # Stripe helpers
│   └── constants.ts
├── public/
│   └── (images, favicon)
├── .env.local
└── package.json
```

---

## Environment Variables

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_URL=https://dadops.one
```

---

## MVP Scope Lock

### In Scope
- [x] Landing page with hero, how-it-works, pricing
- [x] Calculator form (due date + 2-3 plans)
- [x] **Teaser results with blurred paywall** (UPDATED)
- [x] Stripe Checkout integration ($29)
- [x] Full results page after payment
- [x] Double-deductible warning logic
- [x] **URL-encoded data persistence** (UPDATED)
- [x] Mobile responsive
- [x] Print results
- [x] Share link (URL with token)

### Out of Scope (v2+)
- [ ] User accounts / login
- [ ] Database storage
- [ ] PDF export
- [ ] Email results
- [ ] Discount codes
- [ ] Analytics beyond Stripe dashboard

---

## Testing Checklist

Before launch:
- [ ] Happy path: Fill form → See teaser → Pay → See full results
- [ ] Teaser shows correct savings amount
- [ ] Teaser shows Double Deductible warning when triggered
- [ ] Comparison table is blurred in teaser, visible after payment
- [ ] Double-deductible scenario: Due date Feb 2026, verify warning
- [ ] Normal scenario: Due date July 2026, verify no warning
- [ ] 2 plans comparison works
- [ ] 3 plans comparison works
- [ ] **URL token works across devices** (copy URL, open on different browser)
- [ ] Mobile responsive on iPhone/Android
- [ ] Stripe test mode payment works
- [ ] Stripe live mode payment works
- [ ] "Start Over" redirects correctly
- [ ] "Share Link" copies correct URL

---

## Launch Checklist

- [ ] Stripe live mode enabled with real $29 product
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (dadops.one)
- [ ] Test purchase completed (refund yourself)
- [ ] Email to 20 subscribers drafted
- [ ] Reddit update post drafted for r/predaddit
- [ ] Focus message: "Check if you're falling into the Double Deductible trap"

---

## Key Conversion Psychology (From Advisor)

**Old Flow (Blind Paywall):**
```
Work (enter data) → Pay $29 → See value
❌ User fears: "What if I pay and it's useless?"
```

**New Flow (Teaser Paywall):**
```
Work (enter data) → See value ($2,450 savings!) → Pay $29 → See details
✅ User thinks: "I'm paying $29 to save $2,450. No brainer."
```

**The Hook:** You're not selling a calculator. You're selling the $2,450 they're about to save.
