# DadOps - Birth Cost Calculator

**Helping expecting fathers take control of birth costs.**

DadOps is a financial planning tool that compares insurance plans to help expecting fathers calculate the true cost of their baby's birth year. Our calculator identifies the cheapest option while accounting for double deductible scenarios and employer HSA contributions.

🌐 **Live at:** [dadops.one](https://dadops.one)

---

## 🎯 Features

### Calculator
- **Compare 2-3 insurance plans** side-by-side
- **Double deductible detection** for January-March births
- **Smart cost calculation** including premiums, deductibles, OOP max, and employer HSA
- **Mobile-optimized** responsive design

### Teaser-to-Paywall Model
- **Free teaser results** showing savings and recommended plan
- **$19 one-time unlock** for detailed breakdown and comparison
- **Stripe Checkout integration** with secure payment processing
- **Email capture** via ConvertKit for customer nurturing

### Dashboard Experience
- **Professional results dashboard** with dashboard-style layout
- **Locked module previews** for future features (Deployment Timeline, Logistics & Gear, Readiness Score)
- **Print & share functionality** for results
- **Dark mode support** throughout the entire experience

### Analytics & Tracking
- **Vercel Analytics integration** tracking 8 key user events
- **Event tracking** for calculator flow, payment events, locked module clicks, and results actions
- **Privacy-first** approach (no cookies, GDPR compliant)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payment:** Stripe Checkout
- **Email:** ConvertKit
- **Analytics:** Vercel Analytics
- **Icons:** Material Symbols (Google)
- **Hosting:** Vercel
- **Font:** Inter (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Stripe account (for payment processing)
- ConvertKit account (for email capture)
- Vercel account (for deployment and analytics)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dadops.git
   cd dadops
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   # Stripe Keys (get from stripe.com/dashboard)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Stripe Product (create a $19 one-time product in Stripe)
   STRIPE_PRICE_ID=price_...

   # Application URL
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
dadops/
├── app/
│   ├── layout.tsx              # Root layout with Analytics
│   ├── page.tsx                # Landing page + calculator
│   ├── globals.css             # Global styles + Tailwind
│   ├── results/
│   │   └── page.tsx           # Results page (teaser/full conditional)
│   └── api/
│       └── create-checkout-session/
│           └── route.ts       # Stripe checkout API
├── components/
│   ├── landing/               # 8 landing page components
│   ├── calculator/            # 4 calculator flow components
│   ├── results/               # 7 results components
│   └── dashboard/             # 4 dashboard components
├── lib/
│   ├── calculations.ts        # Core calculation engine
│   ├── encoding.ts            # URL token encode/decode
│   ├── stripe.ts              # Stripe helper functions
│   ├── analytics.ts           # Vercel Analytics helpers
│   └── constants.ts           # Shared constants
├── .env.local                 # Environment variables (not committed)
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies
```

---

## 🧮 Calculation Logic

The core calculation assumes users will hit family out-of-pocket maximums during a birth year (statistically likely).

### Double Deductible Risk Detection

Pregnancy spans calendar years when due date is **January-March**:
- **January-March births:** `expectedOop = familyDeductible + familyOopMax`
- **April-December births:** `expectedOop = familyOopMax`

### Total Cost Formula

```typescript
effectiveCost = (monthlyPremium × 12) + expectedOop - employerHsa
```

The **winner** is determined by the lowest `effectiveCost` across all entered plans.

---

## 📊 Analytics Events

Vercel Analytics tracks the following events:

| Event | Description | Parameters |
|-------|-------------|------------|
| `calculator_started` | User progresses to plan input step | - |
| `calculator_completed` | User finishes calculator | `due_month`, `due_year`, `num_plans` |
| `payment_initiated` | User clicks "Unlock My Results" | - |
| `payment_completed` | Successful payment verification | `session_id`, `amount` |
| `locked_module_click` | User clicks locked module card | `module_name` |
| `results_printed` | User clicks Print button | - |
| `results_shared` | User clicks Share Link | - |
| `calculator_restarted` | User clicks Start Over | - |

**View events:** Vercel Dashboard → Analytics → Events

---

## 🎨 Design System

### Colors
- **Primary Green:** `#21c45d` (buttons, accents, locked modules)
- **Primary Dark:** `#16a34a`
- **Warning Amber:** `#F59E0B` (double deductible alerts)
- **Background Light:** `#f6f8f7`
- **Background Dark:** `#122017`
- **Surface Dark:** `#1a2c23`

### Typography
- **Font:** Inter (weights: 400, 500, 600, 700, 900)
- **Headings:** Bold, tracking-tight
- **Body:** Regular, antialiased

### Component Patterns
- **Cards:** 12-16px border radius, subtle shadows
- **Buttons:** Green primary, hover lift effect
- **Locked modules:** Green-tinted icons, "Coming Q2" badge
- **Dark mode:** Full support with proper contrast ratios

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** (automatic on push to main)

### Environment Variables (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID`
- `NEXT_PUBLIC_URL` (set to `https://dadops.one`)

### Custom Domain
1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. Update `NEXT_PUBLIC_URL` environment variable

---

## 🧪 Testing

### Local Testing

**Test calculator flow:**
1. Navigate to landing page
2. Enter due date (try January-March for double deductible)
3. Enter 2-3 plan details
4. Click "Calculate My Costs"
5. Verify teaser results display correctly

**Test payment flow (test mode):**
1. Click "Unlock My Results"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Complete checkout
4. Verify email capture modal appears
5. Submit email
6. Verify full results dashboard displays

**Test locked modules:**
1. Navigate to full results dashboard
2. Click each locked module card
3. Verify toast notification appears
4. Check browser console for analytics events

### Analytics Testing
1. Complete user journey (calculator → payment → results)
2. Open browser dev tools → Network tab
3. Look for analytics requests to Vercel
4. Check Vercel Dashboard → Analytics → Events

---

## 🔒 Security & Privacy

- **No data storage:** Calculator data persists via URL tokens only
- **Stripe security:** PCI-compliant payment processing
- **HTTPS enforced:** All traffic encrypted
- **Privacy-first analytics:** Vercel Analytics uses no cookies
- **Email consent:** Users explicitly opt-in to email list

---

## 📝 Development Workflow

### Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Run production server locally
npm run lint         # Run ESLint
```

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes** and test locally

3. **Commit with descriptive message**
   ```bash
   git add .
   git commit -m "✨ Add feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   ```

5. **Vercel preview deployment** automatically created

6. **Merge to main** to deploy to production

---

## 🗺️ Roadmap

### Current Features (MVP - Pass 2)
- ✅ Birth cost calculator with 2-3 plan comparison
- ✅ Teaser-to-paywall model with Stripe integration
- ✅ Email capture via ConvertKit
- ✅ Professional results dashboard
- ✅ Locked module previews
- ✅ Vercel Analytics integration
- ✅ Dark mode support

### Future Features (Q2 2026)
- 🔒 **Deployment Timeline** - Week-by-week task roadmap
- 🔒 **Logistics & Gear** - Hospital go-bag & nursery checklists
- 🔒 **Readiness Score** - Preparedness assessment tracker

### Future Enhancements (Backlog)
- User accounts & authentication
- PDF export functionality
- Email delivery of results
- Advanced analytics dashboard
- Mobile app (iOS/Android)

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Open an issue to discuss proposed changes
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

---

## 📄 License

All rights reserved. This is proprietary software for DadOps.

---

## 📧 Contact

- **Website:** [dadops.one](https://dadops.one)
- **Email:** admin@dadops.one
- **Support:** Contact form on website

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/) for payments
- [ConvertKit](https://convertkit.com/) for email
- [Vercel](https://vercel.com/) for hosting & analytics
- [Material Symbols](https://fonts.google.com/icons) by Google

---

**Built by fathers, for fathers. 🍼**
