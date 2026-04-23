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