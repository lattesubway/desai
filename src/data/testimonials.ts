export type Testimonial = {
  quote: string;
  author: string;
  /** 1–5 stars */
  rating?: number;
  /** ISO date string, e.g. '2025-09-14' */
  date?: string;
  /** Procedure category — used as a tag/filter */
  procedure?: string;
  /** Platform that hosted the review */
  source?: 'Google' | 'RealSelf' | 'Yelp' | 'Healthgrades' | 'Direct';
};

export const testimonials: Testimonial[] = [
  {
    quote: "Dr. Desai listened more than any surgeon I'd consulted with. The result is exactly what I asked for — and somehow more.",
    author: 'Patient · Rhinoplasty',
    rating: 5, date: '2026-02-14', procedure: 'Rhinoplasty', source: 'Google',
  },
  {
    quote: "There's a quietness to his confidence. You feel cared for from the first call to the final follow-up.",
    author: 'Patient · Facelift',
    rating: 5, date: '2026-01-22', procedure: 'Facelift', source: 'RealSelf',
  },
  {
    quote: "I've recommended him to three friends. Every one of them has thanked me.",
    author: 'Patient · Mommy Makeover',
    rating: 5, date: '2025-11-08', procedure: 'Mommy Makeover', source: 'Google',
  },
  {
    quote: "His credentials are extraordinary, but it's his eye for proportion that sets him apart.",
    author: 'Patient · Eyelid Surgery',
    rating: 5, date: '2025-10-30', procedure: 'Eyelid Surgery', source: 'Healthgrades',
  },
];
