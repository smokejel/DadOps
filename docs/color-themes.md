# DadOps Dashboard Color Themes

This document outlines all color themes used in the DadOps Dashboard project.

## Primary Brand Colors

| Name | Tailwind Class | Hex | Usage |
|------|----------------|-----|-------|
| Primary | `primary` | `#FF5500` | Primary actions, active states, highlights |
| Primary Dark | `primary-dark` | `#FF3700` | Hover states for primary elements |

## Background & Surface Colors

| Name | Tailwind Class | Hex | Usage |
|------|----------------|-----|-------|
| Background | `gray-900` | `#111827` | Page background |
| Card | `gray-800` | `#1F2937` | Card surfaces, panels |
| Border | `gray-700` | `#374151` | Borders, dividers |

## Category Colors

Used for tasks, budget items, and visual categorization throughout the dashboard.

| Category | Tailwind Class | Hex | Usage |
|----------|----------------|-----|-------|
| Medical | `medical` | `#1A24FF` | Medical appointments, health tasks |
| Finance | `green-500` | `#22c55e` | Financial planning, savings goals |
| Gear | `purple-500` | `#a855f7` | Baby gear, equipment purchases |
| Home/Nursery | `teal-500` | `#14b8a6` | Nursery setup, home preparation |
| Childcare | `orange-500` | `#f97316` | Childcare planning, daycare research |
| Admin | `gray-500` | `#6b7280` | Administrative tasks, paperwork |
| Preparation | `pink-500` | `#ec4899` | Birth preparation, classes, planning |

## Text Colors

| Name | Tailwind Class | Hex | Usage |
|------|----------------|-----|-------|
| Primary | `white` | `#FFFFFF` | Headings, primary text |
| Secondary | `gray-400` | `#9CA3AF` | Descriptions, supporting text |
| Tertiary | `gray-500` | `#6B7280` | Muted text, timestamps |

## Opacity Patterns

Opacity modifiers are used with category colors for various UI elements:

| Pattern | Opacity | Tailwind Suffix | Usage |
|---------|---------|-----------------|-------|
| Background Tint | 10% | `/10` | Category badges, subtle backgrounds |
| Border | 30% | `/30` | Category-colored borders |
| Ring | 20% | `/20` | Focus rings, selection indicators |
| Hover | 50% | `/50` | Hover state backgrounds |

### Examples

```html
<!-- Category badge with tinted background -->
<span class="bg-medical/10 text-medical border border-medical/30">
  Medical
</span>

<!-- Card with category accent -->
<div class="bg-gray-800 border-l-4 border-purple-500">
  Gear item
</div>

<!-- Button with hover state -->
<button class="bg-primary hover:bg-primary-dark">
  Save
</button>
```

## CSS Custom Properties

The following CSS custom properties are defined in `globals.css`:

```css
@theme inline {
  --color-primary: #FF5500;
  --color-primary-dark: #FF3700;
  --color-medical: #1A24FF;
}
```

## Usage Guidelines

1. **Consistency**: Always use the defined category colors for their respective categories
2. **Contrast**: Use white or gray-400 text on dark backgrounds for readability
3. **Hierarchy**: Use opacity variants to create visual hierarchy without introducing new colors
4. **Hover States**: Apply `/50` opacity or darker shade for interactive hover feedback
5. **Focus States**: Use ring utilities with `/20` opacity for accessibility
