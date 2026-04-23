# Chat Page Enhancements Plan

## Objective
Enhance the "Recommended Lawyers" section in ChatPage.tsx by adding:
1. "Hire Now" button for each lawyer
2. Display lawyer experience & consultation fee
3. Add rating stars with average rating

## Current State Analysis

### ChatPage.tsx
- Displays recommended lawyers in a simple card layout
- Shows: Name, Specialization, Location
- Uses `getLawyers(category)` from `lawyers.ts` to fetch data
- Data comes from Supabase `lawyers` table

### Lawyer Data Structure
**Supabase Schema:**
- `display_name` (text)
- `location` (text)
- `specializations` (text[])
- `years_experience` (int)
- `consultation_fee` (numeric)
- `profile_photo_url` (text)

**Local Data (localData.ts):**
- `consultationFeePerHour` (number)
- `successRate` (number)
- Reviews array with ratings (1-5 stars)

**Available Helper Functions:**
- `getRankedLawyers()` - returns lawyers with `avgRating` and `reviewsCount`
- `getReviewsForLawyer(lawyerId)` - returns reviews for a lawyer

## Proposed Enhancements

### 1. Enhanced Lawyer Card Design
```
┌─────────────────────────────────────┐
│ Sarah Johnson                       │
│ ⭐⭐⭐⭐⭐ (4.8) • 12 reviews        │
│ Family Law, Divorce                 │
│ New York, NY                        │
│                                     │
│ 8+ years experience • $250/hr       │
│                                     │
│ [Hire Now]                          │
└─────────────────────────────────────┘
```

### 2. Implementation Steps

#### Step 1: Update Data Fetching
- Modify `getLawyers()` in `lawyers.ts` to include rating data
- OR use `getRankedLawyers()` from localData.ts for demo/local data
- For production, create a Supabase view/function that joins lawyers with reviews

#### Step 2: Create RatingStars Component
- Create `src/components/RatingStars.tsx`
- Props: `rating` (0-5), `reviewCount` (optional)
- Displays 5 stars with appropriate fill (full, half, empty)
- Shows average rating and review count

#### Step 3: Enhance Lawyer Card in ChatPage.tsx
- Update the lawyer card JSX in the "Recommended Lawyers" section
- Add:
  - RatingStars component
  - Experience display (using `years_experience` or default)
  - Fee display (format as currency)
  - "Hire Now" button linking to `/book/${lawyer.id}`

#### Step 4: Update Styling
- Improve card layout with better spacing
- Add appropriate Tailwind CSS classes
- Ensure responsive design

### 3. Detailed Changes

#### File: `src/components/RatingStars.tsx` (New)
```tsx
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0-5
  reviewCount?: number;
  size?: number;
}

export default function RatingStars({ rating, reviewCount, size = 16 }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="ml-1 text-sm text-gray-500">({reviewCount} reviews)</span>
      )}
    </div>
  );
}
```

#### File: `src/pages/ChatPage.tsx` (Modifications)
1. Import RatingStars component
2. Update lawyer interface to include rating, experience, fee
3. Enhance the lawyer card JSX:

```tsx
{recommendedLawyers.map((lawyer) => (
  <div key={lawyer.id} className="border p-4 rounded-lg mb-3 hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-lg">{lawyer.display_name || "Unknown"}</p>
        <RatingStars 
          rating={lawyer.avgRating || 0} 
          reviewCount={lawyer.reviewsCount || 0} 
          size={14}
        />
        <p className="text-sm text-gray-600 mt-1">
          {lawyer.specializations?.join(", ") || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          📍 {lawyer.location || "N/A"}
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-gray-700">
            ⚖️ {lawyer.years_experience || 5}+ years experience
          </span>
          <span className="text-gray-700">
            💰 ${lawyer.consultation_fee || lawyer.consultationFeePerHour || 0}/hr
          </span>
        </div>
      </div>
      <Link
        to={`/book/${lawyer.id}`}
        className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
      >
        Hire Now
      </Link>
    </div>
  </div>
))}
```

#### File: `src/lib/lawyers.ts` (Optional Enhancement)
```tsx
export async function getLawyersWithRatings(category: string) {
  // Enhanced version that includes rating data
  // This would require a Supabase view or separate rating fetch
}
```

### 4. Data Considerations

**Option A: Use Local Data (Quick Implementation)**
- Use `getRankedLawyers()` from localData.ts
- Provides all needed data (rating, review count, fee, experience)
- Works offline/demo mode

**Option B: Enhance Supabase Query**
- Create a database view that joins lawyers with reviews
- Modify `getLawyers()` to use this view
- More scalable for production

**Recommended Approach:** Start with Option A for quick implementation, then migrate to Option B.

### 5. Success Metrics
- Users can easily identify qualified lawyers
- Clear pricing and experience information
- Direct path to hiring (Hire Now button)
- Visual rating indicators build trust

## Next Steps
1. Review this plan
2. Approve implementation approach
3. Switch to Code mode for implementation

## Questions for Review
1. Should we use local data or enhance Supabase queries first?
2. Any specific styling preferences for the lawyer cards?
3. Should the "Hire Now" button open a modal or navigate to booking page?