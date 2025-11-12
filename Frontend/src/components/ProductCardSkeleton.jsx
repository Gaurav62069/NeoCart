function ProductCardSkeleton() {
  return (
    <div className="card-neumo !p-3">
      {/* Skeleton Image */}
      <div className="w-full h-56 rounded-lg bg-[var(--neumo-dark-shadow)] opacity-20 animate-pulse"></div>
      <div className="px-1 py-1 mt-3">
        {/* Skeleton Title */}
        <div className="w-3/4 h-6 rounded bg-[var(--neumo-dark-shadow)] opacity-20 animate-pulse"></div>
        {/* Skeleton Price */}
        <div className="w-1/2 h-8 mt-2 rounded bg-[var(--neumo-dark-shadow)] opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton