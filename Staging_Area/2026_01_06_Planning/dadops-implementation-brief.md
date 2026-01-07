# DadOps MVP Implementation Brief

**Purpose:** Briefing document for Claude Code to implement the Birth Cost Calculator results page  
**Date:** January 6, 2026  
**Timeline:** 1 week to launch

---

## Project Context

DadOps is a financial planning tool for expecting fathers. The MVP is a **Birth Cost Calculator** that compares 2-3 insurance plans and recommends the cheapest option for the birth year.

**Key Pivot:** We originally designed a full "command center" dashboard (see `Screen1_Web.png`). We've since narrowed scope to ship a calculator first. However, we want the *results page* to use the dashboard visual language — making users feel they've joined a platform, not just received a PDF.

---

## Strategic Decision: Dashboard as Results Interface

Instead of showing calculator results in a simple output format, we display them inside a "command center" layout:

- **Active Module:** The Financial Analysis (calculator results) — fully functional
- **Locked Modules:** Roadmap, Go-Bag, Readiness Score — visual only, with "Coming Q2" badges

**Why this works:**
1. Justifies $19 price point (feels like a platform, not a PDF)
2. Validates future features via click tracking on locked modules
3. Reinforces "Family CFO" brand positioning
4. Shows users the vision without scope-creeping the build

---

## Implementation: Two-Pass Strategy

### Pass 1: Ship Week (Priority)

Build the minimum needed to launch with Stripe payments working.

**Must have:**
- Calculator form (3 steps: due date → plan inputs → calculate)
- Calculation logic with double-deductible detection
- Stripe Checkout integration ($19 one-time)
- Results page displaying:
  - Recommended plan with savings amount
  - Cost breakdown (premiums + medical costs - employer HSA)
  - Comparison table for all entered plans
  - Double-deductible warning (if applicable)
- Placeholder cards for locked modules (hardcoded divs, styled but non-functional)
- Mobile responsive

**Can skip for now:**
- Click tracking on locked modules
- Polished animations/transitions
- "Notify me" functionality

### Pass 2: Post-Launch Polish

After confirming payments work:
- Add analytics event tracking on locked module clicks
- Polish the facade cards to match dashboard mockup aesthetic
- Add toast/feedback when users click locked modules

---

## Results Page Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  TOP BANNER: Alert (if double-deductible detected)  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ACTIVE MODULE: Financial Analysis (hero card)      │
│  - Recommended plan name                            │
│  - Savings vs next best option                      │
│  - Total estimated cost                             │
│  - Breakdown: Premiums + Medical - HSA              │
│  - Comparison table (all plans)                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  LOCKED MODULES (3-column grid on desktop)          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │Roadmap  │  │ Go-Bag  │  │Readiness│             │
│  │Coming Q2│  │Coming Q2│  │Coming Q2│             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  BOTTOM: Next Steps / Action Items                  │
└─────────────────────────────────────────────────────┘
```

### Active Module Content

**Header:**
- "FINANCIAL SITUATION REPORT" or similar commanding title
- Strategic Recommendation: "[Plan Name] is your tactical choice"
- Projected Savings: "$X,XXX vs [second best plan]"

**Breakdown Section:**
Display as visual progress bars or stacked costs:
1. Fixed Costs (Premiums): Monthly × 12
2. Variable Risk (Medical): Deductible + OOP Max
3. Asset Offset (Employer HSA): Negative value reducing total

**Comparison Table:**
| Plan | Annual Premium | Expected OOP | Employer HSA | Est. Total Cost |
|------|----------------|--------------|--------------|-----------------|
| Plan A | $X,XXX | $X,XXX | -$X,XXX | **$XX,XXX** |
| Plan B | $X,XXX | $X,XXX | -$X,XXX | $XX,XXX |

### Locked Module Cards

Each card should include:
- Icon (calendar for Roadmap, backpack for Go-Bag, brain/checkmark for Readiness)
- Title
- One-line description of what it will do
- "Coming Q2" or "In Development" badge (use `bg-blue-100 text-blue-800` style)
- Entire card slightly reduced opacity (e.g., `opacity-75`)

**Card content:**

1. **Deployment Timeline**
   - Icon: Calendar
   - Description: "Week-by-week task list customized to your due date"

2. **Logistics & Gear**
   - Icon: Backpack/Bag
   - Description: "Hospital go-bag checklist & nursery inventory tracker"

3. **Readiness Score**
   - Icon: Checkmark/Brain
   - Description: "Track your admin, gear, and mental prep progress"

---

## Calculation Logic

Core formula per plan:
```javascript
function calculatePlanCost(plan, dueDate) {
  const birthMonth = dueDate.getMonth() + 1; // 1-12
  const birthYear = dueDate.getFullYear();
  
  // Check if pregnancy spans calendar years
  const conceptionDate = new Date(dueDate);
  conceptionDate.setMonth(conceptionDate.getMonth() - 9);
  const spansYears = conceptionDate.getFullYear() < birthYear;
  
  // Double deductible risk: spans years AND due in Jan-Mar
  const doubleDeductibleRisk = spansYears && birthMonth <= 3;
  
  // Annual premium
  const annualPremium = plan.monthlyPremium * 12;
  
  // Calculate total cost
  let medicalCosts;
  if (doubleDeductibleRisk) {
    // Hit deductible in year 1, OOP max in year 2
    medicalCosts = plan.familyDeductible + plan.familyOopMax;
  } else {
    // Standard: just family OOP max
    medicalCosts = plan.familyOopMax;
  }
  
  const totalCost = annualPremium + medicalCosts - (plan.employerHsa || 0);
  
  return {
    planName: plan.name,
    annualPremium,
    medicalCosts,
    employerHsa: plan.employerHsa || 0,
    totalCost,
    doubleDeductibleRisk
  };
}
```

---

## User Flow Summary

```
Landing Page (dadops.one)
    ↓
Step 1: Enter Due Date
    ↓
Step 2: Enter Plan Details (up to 3 plans)
    - Plan name
    - Monthly premium
    - Family deductible
    - Family OOP max
    - Employer HSA contribution (optional)
    ↓
Step 3: Click "Calculate"
    ↓
Teaser Results (shows savings amount, blurred details)
    ↓
Stripe Checkout ($19)
    ↓
Full Results Dashboard (this spec)
```

---

## Technical Stack

- **Framework:** Next.js (already deployed on dadops.one)
- **Styling:** Tailwind CSS
- **Payment:** Stripe Checkout (session-based, no backend needed)
- **Hosting:** Vercel
- **State:** URL params or localStorage for passing calc results through Stripe redirect

---

## Reference Files

Include these for visual context:

| File | Purpose |
|------|---------|
| `Screen1_Web.png` | Dashboard mockup — use for locked module visual style |
| `DadOps_-_Birth_Cost_Calculator.pdf` | Landing page design reference |
| `Results_Page.pdf` | Current results page design |
| `dadops-mvp-progress.md` | Full project context and validation history |

---

## Key Constraints

1. **Timeline:** Must ship within 1 week
2. **No backend:** All calculation client-side, Stripe handles payment
3. **No auth:** Pay once, see results (no user accounts)
4. **Mobile-first:** Many users will check on phones
5. **Locked modules are facade only:** No functionality, just visual placeholders

---

## Success Criteria for This Implementation

- [ ] User can enter due date and up to 3 plan details
- [ ] Calculation runs and identifies cheapest plan
- [ ] Double-deductible scenario detected and flagged when applicable
- [ ] Stripe payment completes successfully
- [ ] Results display in dashboard-style layout
- [ ] Locked modules visible with "Coming Q2" badges
- [ ] Works on mobile devices
- [ ] Can launch to real users within 1 week

---

## Questions for Planning Mode

1. What's the best way to persist calculator inputs through the Stripe redirect?
2. Should the teaser/paywall show partial results or just the savings number?
3. Any Stripe Checkout gotchas for one-time payments with dynamic success URLs?

---

*This document provides complete context for implementing the DadOps MVP results dashboard. Reference the attached mockups for visual guidance.*
