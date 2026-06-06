interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`
        rounded-lg animate-shimmer
        ${className}
      `}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
